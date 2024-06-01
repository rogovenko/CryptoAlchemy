use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct State {
    #[key]
    player: ContractAddress,
    health: u8,
    points: u8,
    money: u8,
    shop_slot: u8,
    timestamp: u64,
}