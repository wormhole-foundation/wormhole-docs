pub enum GatewayIbcTokenBridgePayload {
    GatewayTransfer {
        chain: u16,
        recipient: Binary,
        fee: u128,
        nonce: u32,
    },
    GatewayTransferWithPayload {
        chain: u16,
        contract: Binary,
        payload: Binary,
        nonce: u32,
    },
}