use dojo_starter::models::moves::Direction;
use dojo_starter::models::position::Position;
use dojo_starter::models::inventory::Inventory;
use dojo_starter::models::random::Random;
use dojo_starter::models::state::State;
use dojo_starter::models::shop::Shop;
use dojo_starter::models::shop::BidShop;
use starknet::ContractAddress;

// define the interface
#[dojo::interface]
trait IActions {
    fn spawn();
    fn move(direction: Direction);
    fn add_item_rnd(count: u8);
    fn combine_items(item_one: u8, item_two: u8);
    fn create_shop();
    fn create_bid(item: u8, price: u8, count: u8, shopper: ContractAddress);
    fn buy_item(slot_num: u8, shopper: ContractAddress);
    fn cancel_bid(slot_num: u8, shopper: ContractAddress);
    fn setTimestamp(timestamp: u64);
    fn item_trash();
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{
        IActions, 
        next_position, 
        get_random_in_range, 
        deleteItemByNum, 
        getFreeSlot, 
        add_to_shop, 
        getSlot,
        addItemByNum,
        delete_from_shop
    };
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{position::{Position, Vec2}, moves::{Moves, Direction}, inventory::{Inventory}, random::{Random}, state::{State}, shop::{Shop, BidShop}};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create_shop(world: IWorldDispatcher) {
            let player = get_caller_address();
            let bid = BidShop { player: player, item: 0, count: 0, price: 0};
            let shop = Shop {
                player, 
                slot1: bid,
                slot2: bid,
                slot3: bid,
                slot4: bid,
                slot5: bid,
                slot6: bid,
            };
            set!(
                world,
                (
                    shop
                )
            );
        }

        fn spawn(world: IWorldDispatcher) {
            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
            // Retrieve the player's current position from the world.
            let position = get!(world, player, (Position));

            // Update the world state with the new data.
            // 1. Set the player's remaining moves to 100.
            // 2. Move the player's position 10 units in both the x and y direction.
            set!(
                world,
                (
                    Moves { player, remaining: 100, last_direction: Direction::None(()) },
                    Position {
                        player, vec: Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 }
                    },
                    Inventory {
                        player, 
                        item0_count: 2,
                        item1_count: 2,
                        item2_count: 0,
                        item3_count: 0,
                        trash: 0,
                    },
                    Random {
                        player,
                        value: 0,
                    },
                    State {
                        player,
                        health: 100,
                        points: 100,
                        money: 20,
                        shop_slot: 0,
                        timestamp: 0,
                    }
                )
            );
        }

        // Implementation of the move function for the ContractState struct.
        fn move(world: IWorldDispatcher, direction: Direction) {
            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();

            // Retrieve the player's current position and moves data from the world.
            let (mut position, mut moves) = get!(world, player, (Position, Moves));

            // Deduct one from the player's remaining moves.
            moves.remaining -= 1;

            // Update the last direction the player moved in.
            moves.last_direction = direction;

            // Calculate the player's next position based on the provided direction.
            let next = next_position(position, direction);

            // Update the world state with the new moves data and position.
            set!(world, (moves, next));
            // Emit an event to the world to notify about the player's move.
            emit!(world, (moves));
        }

        fn add_item_rnd(world: IWorldDispatcher, count: u8){
            let player = get_caller_address();

            let (mut inventory, mut random, mut state) = get!(world, player, (Inventory, Random, State));
            random.value += 1;

            let random_number = get_random_in_range(random.value, 0, 100);

            if random_number >= 0 && random_number <= 40 {
                inventory.item0_count += count;
            } else if random_number >= 41 && random_number <= 70 {
                inventory.item1_count += count;
            } else if random_number >= 71 && random_number <= 92 {
                state.health -= 10;
            } else if random_number >= 93 && random_number <= 100 {
                inventory.item3_count += count;
            }

            state.points -= 1;
            
            set!(world, (inventory, random, state));
            emit!(world, (inventory, random, state));
        }

        fn combine_items(world: IWorldDispatcher, item_one: u8, item_two: u8){
            let player = get_caller_address();

            let (mut inventory, mut state) = get!(world, player, (Inventory, State));
            
            if (item_one == 0 && item_two == 1) || (item_one == 1 && item_two == 0) {
                if inventory.item0_count > 0 && inventory.item1_count > 0 {
                    inventory.item2_count += 1;
                }
            }else {
                inventory.trash += 1;
            }

            inventory = deleteItemByNum(inventory, item_one, 1);
            inventory = deleteItemByNum(inventory, item_two, 1);

            state.points -= 1;
            
            set!(world, (inventory, state));
            emit!(world, (inventory, state));
        }

        fn create_bid(world: IWorldDispatcher, item: u8, price: u8, count: u8, shopper: ContractAddress){
            let player = get_caller_address();
            let (mut inventory, mut state) = get!(world, player, (Inventory, State));
            let mut shop = get!(world, shopper, (Shop));

            inventory = deleteItemByNum(inventory, item, count);
            let slot = getFreeSlot(shop);
            state.shop_slot = slot;

            let bid = BidShop { player: player, item: item, count: count, price: price};
            let shop = add_to_shop(shop, bid, slot);
            set!(world, (inventory, state, shop));
            emit!(world, (inventory, state, shop));
        }

        fn buy_item(world: IWorldDispatcher, slot_num: u8, shopper: ContractAddress){
            let player = get_caller_address();
            let (mut inventory, mut state) = get!(world, player, (Inventory, State));
            let mut shop = get!(world, shopper, (Shop));

            let slot = getSlot(shop, slot_num);
            let mut state_seller = get!(world, slot.player, (State));

            // destribute money
            state_seller.money += slot.price;
            state_seller.shop_slot = 0;
            state.money -= slot.price;

            // add item and delete it from store
            inventory = addItemByNum(inventory, slot.item, slot.count);
            shop = delete_from_shop(shop, slot_num);

            set!(world, (inventory, state, shop, state_seller));
            emit!(world, (inventory, state, shop, state_seller));
        }

        fn cancel_bid(world: IWorldDispatcher, slot_num: u8, shopper: ContractAddress){
            let player = get_caller_address();
            let (mut inventory, mut state) = get!(world, player, (Inventory, State));
            let mut shop = get!(world, shopper, (Shop));

            let slot = getSlot(shop, slot_num);

            // destribute money
            state.shop_slot = 0;

            // add item and delete it from store
            inventory = addItemByNum(inventory, slot.item, slot.count);
            println!("slot num {}", slot_num);
            shop = delete_from_shop(shop, slot_num);

            println!("shop: {} {} {}", shop.slot1.item, shop.slot1.count, shop.slot1.price);


            set!(world, (inventory, state, shop));
            emit!(world, (inventory, state, shop));
        }

        fn setTimestamp(world: IWorldDispatcher, timestamp: u64){
            let player = get_caller_address();
            let mut state = get!(world, player, (State));
            state.timestamp = timestamp;
            set!(world, (state));
            emit!(world, (state));
        }

        fn item_trash(world: IWorldDispatcher){
            let player = get_caller_address();
            let mut inventory = get!(world, player, (Inventory));

            inventory.trash += 2;

            set!(world, (inventory, inventory));
            emit!(world, (inventory, inventory));
        }
    }
}

// Define function like this:
fn next_position(mut position: Position, direction: Direction) -> Position {
    match direction {
        Direction::None => { return position; },
        Direction::Left => { position.vec.x -= 1; },
        Direction::Right => { position.vec.x += 1; },
        Direction::Up => { position.vec.y -= 1; },
        Direction::Down => { position.vec.y += 1; },
    };
    position
}

fn addItemByNum(mut inventory: Inventory, id: u8, count: u8) -> Inventory {
    match id {
        0 => {
            inventory.item0_count += count;
        },
        1 => {
            inventory.item1_count += count;
        },
        2 => {
            inventory.item2_count += count;
        },
        3 => {
            inventory.item3_count += count;
        },
        _ => {}
    };
    inventory
}

fn deleteItemByNum(mut inventory: Inventory, id: u8, count: u8) -> Inventory {
    match id {
        0 => {
            if inventory.item0_count >= count {
                inventory.item0_count -= count;
            }
        },
        1 => {
            if inventory.item1_count >= count {
                inventory.item1_count -= count;
            }
        },
        2 => {
            if inventory.item2_count >= count {
                inventory.item2_count -= count;
            }
        },
        3 => {
            if inventory.item3_count >= count {
                inventory.item3_count -= count;
            }
        },
        _ => {}
    };
    inventory
}

fn delete_from_shop(mut shop: Shop, slot_num: u8) -> Shop {
    match slot_num {
        0 => {},
        1 => {
            shop.slot1 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        2 => {
            shop.slot2 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        3 => {
            shop.slot3 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        4 => {
            shop.slot4 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        5 => {
            shop.slot5 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        6 => {
            shop.slot6 = BidShop { player: shop.player, item: 0, count: 0, price: 0 };
        },
        _ => {}
    }
    shop
}

fn add_to_shop(mut shop: Shop, bid: BidShop, slot_num: u8) -> Shop {
    match slot_num {
        0 => {},
        1 => {
            shop.slot1 = bid
        },
        2 => {
            shop.slot2 = bid
        },
        3 => {
            shop.slot3 = bid
        },
        4 => {
            shop.slot4 = bid
        },
        5 => {
            shop.slot5 = bid
        },
        6 => {
            shop.slot6 = bid
        },
        _ => {}
    };
    shop
}

fn getSlot(shop: Shop, slot_num: u8) -> BidShop {
    match slot_num {
        0 => BidShop { player: shop.player, item: 0, count: 0, price: 0 },
        1 => shop.slot1,
        2 => shop.slot2,
        3 => shop.slot3,
        4 => shop.slot4,
        5 => shop.slot5,
        6 => shop.slot6,
        _ => BidShop { player: shop.player, item: 0, count: 0, price: 0 }, // Default or error value
    }
}

fn getFreeSlot(shop: Shop) -> u8 {
    if shop.slot1.count == 0 {
        return 1;
    }
    if shop.slot2.count == 0 {
        return 2;
    }
    if shop.slot3.count == 0 {
        return 3;
    }
    if shop.slot4.count == 0 {
        return 4;
    }
    if shop.slot5.count == 0 {
        return 5;
    }
    if shop.slot6.count == 0 {
        return 6;
    }
    0
}

fn lcg_random(seed: u256) -> u256 {
    // Параметры LCG
    let a: u256 = 1664525_u128.into();
    let c: u256 = 1013904223_u128.into();
    let m: u256 = 4294967296_u128.into();

    // Генерация следующего числа
    let next = (a * seed + c) % m;

    next
}

fn get_random_in_range(seed: u256, min: u256, max: u256) -> u256 {
    let random_value = lcg_random(seed);

    // Приведение значения в нужный диапазон
    let range = max - min + 1_u256;
    let random_in_range = (random_value % range) + min;

    random_in_range
}