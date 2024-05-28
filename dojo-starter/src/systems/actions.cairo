use dojo_starter::models::moves::Direction;
use dojo_starter::models::position::Position;
use dojo_starter::models::inventory::ItemType;
use dojo_starter::models::random::Random;
use dojo_starter::models::state::State;

// define the interface
#[dojo::interface]
trait IActions {
    fn spawn();
    fn move(direction: Direction);
    fn add_item_rnd(count: u8);
    fn combine_items(item_one: u8, item_two: u8);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions, next_position, get_random_in_range};
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{position::{Position, Vec2}, moves::{Moves, Direction}, inventory::{Inventory, ItemType}, random::{Random}, state::{State}};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
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
                        item0_count: 0,
                        item1_count: 0,
                        item2_count: 0,
                        item3_count: 0,
                    },
                    Random {
                        player,
                        value: 0,
                    },
                    State {
                        player,
                        health: 100,
                        points: 100,
                        money: 0,
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
            // убрать каунт
            let player = get_caller_address();

            let (mut inventory, mut random, mut state) = get!(world, player, (Inventory, Random, State));
            random.value += 1;

            // Получение случайного числа в диапазоне [0, 100]
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

            let mut inventory = get!(world, player, (Inventory));
            
            if item_one == 0 && item_two == 1 || item_one == 1 || item_two == 0 {
                if inventory.item0_count > 0 && inventory.item1_count > 0 {
                    inventory.item2_count += 1;
                    inventory.item0_count -= 1;
                    inventory.item1_count -= 1;
                }
            }else {
                if(item_one == 0 || item_two == 0) {
                    inventory.item0_count -= 1;
                }
                if(item_one == 1 || item_two == 1) {
                    inventory.item1_count -= 1;
                }
                if(item_one == 2 || item_two == 2) {
                    inventory.item2_count -= 1;
                }
                if(item_one == 3 || item_two == 3) {
                    inventory.item3_count -= 1;
                }
            }
            
            set!(world, (inventory));
            emit!(world, (inventory));
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