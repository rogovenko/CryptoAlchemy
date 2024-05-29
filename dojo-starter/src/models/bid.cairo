use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct Bid {
    #[key]
    id: u8,
    player: ContractAddress,
    item: u8,
    count: u8,
    price: u8,
}