use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct Random {
    #[key]
    player: ContractAddress,
    value: u256
}