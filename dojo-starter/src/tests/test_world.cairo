#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    // import test utils
    use dojo_starter::{
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait}},
        models::{position::{Position, Vec2, position}, moves::{Moves, Direction, moves}, state::{State, state}, inventory::{Inventory, inventory}, shop::{Shop, BidShop}}
    };

    #[test]
    #[available_gas(200000000)]
    fn test_move() {
        // caller
        let caller = starknet::contract_address_const::<0x0>();

        // models
        let mut models = array![position::TEST_CLASS_HASH, moves::TEST_CLASS_HASH, state::TEST_CLASS_HASH, inventory::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.spawn();

        // call move with direction right
        // actions_system.move(Direction::Right);

        // // Check world state
        // let moves = get!(world, caller, Moves);

        // // casting right direction
        // let right_dir_felt: felt252 = Direction::Right.into();

        // // check moves
        // assert(moves.remaining == 99, 'moves is wrong');

        // check last direction
        // assert(moves.last_direction.into() == right_dir_felt, 'last direction is wrong');

        // get new_position
        // let new_position = get!(world, caller, Position);

        // // check new position x
        // assert(new_position.vec.x == 11, 'position x is wrong');

        // // check new position y
        // assert(new_position.vec.y == 10, 'position y is wrong');

        // // Add item to inventory
        actions_system.add_item_rnd(1);

        actions_system.combine_items(0, 1);

        // Get inventory
        let inventory = get!(world, caller, Inventory);

        // Check inventory item count
        assert(inventory.item0_count == 2, 'item 0 was not');
        assert(inventory.item2_count == 1, 'item 3 was not');
        assert(inventory.trash == 0, 'trash!');

        // check wrong combo that generates trash
        actions_system.combine_items(1, 1);
        let inv2 = get!(world, caller, Inventory);
        assert(inv2.trash == 1, 'trash!');
        
        let state = get!(world, caller, State);
        assert(state.points == 97, 'state is wrong');

        actions_system.create_shop();
        
        let shop = get!(world, caller, Shop);
        assert(shop.slot1.item == 0, 'shop is wrong');

        actions_system.create_bid(1, 1, 1, caller);

        actions_system.buy_item(1, caller);

        let shop1 = get!(world, caller, Shop);
        assert(shop1.slot1.item == 0, 'shop is wrong');
    }
}
