use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct Inventory {
    #[key]
    player: ContractAddress,
    item0_count: u8,
    item1_count: u8,
    item2_count: u8,
    item3_count: u8,
    trash: u8,
}