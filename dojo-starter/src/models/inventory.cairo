use starknet::ContractAddress;

#[derive(Serde, Copy, Drop, Introspect)]
enum ItemType {
    Item0, // e.g., Sword
    Item1, // e.g., Shield
    Item2, // e.g., Potion
    Item3, // e.g., Bow
}

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct Inventory {
    #[key]
    player: ContractAddress,
    item0_count: u8,
    item1_count: u8,
    item2_count: u8,
    item3_count: u8,
}