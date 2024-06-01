use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::event] // A model with `dojo::event` is able to be emitted with the `emit!` macro.
struct Shop {
    #[key]
    player: ContractAddress,
    slot1: BidShop,
    slot2: BidShop,
    slot3: BidShop,
    slot4: BidShop,
    slot5: BidShop,
    slot6: BidShop,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct BidShop {
    player: ContractAddress,
    item: u8,
    count: u8,
    price: u8,
}