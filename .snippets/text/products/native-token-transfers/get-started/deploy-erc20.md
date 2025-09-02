Use the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token){target=\_blank} to deploy a basic ERC-20 token contract on testnet.

1. **Install Foundry**: Install the [Forge CLI](https://getfoundry.sh/introduction/installation/){target=\_blank}.

2. **Clone the repository**: Fetch the example contract repository.

    ```bash
    git clone https://github.com/wormhole-foundation/example-ntt-token.git
    cd example-ntt-token
    ```
3. **Deploy the token contract**: Deploy to testnet with your preferred name, symbol, minter, and owner addresses.

    ```bash
    forge create --broadcast \
        --rpc-url INSERT_RPC_URL \
        --private-key INSERT_YOUR_PRIVATE_KEY \
        src/PeerToken.sol:PeerToken \
        --constructor-args "INSERT_TOKEN_NAME" "INSERT_TOKEN_SYMBOL" INSERT_MINTER_ADDRESS INSERT_OWNER_ADDRESS
    ```

4. **Mint tokens**: Send tokens to your address.

    ```bash
    cast send INSERT_TOKEN_ADDRESS \
        "mint(address,uint256)" \
        INSERT_RECIPIENT_ADDRESS \
        INSERT_AMOUNT_IN_WEI \
        --private-key INSERT_YOUR_PRIVATE_KEY \
        --rpc-url INSERT_RPC_URL
    ```

!!! note
    This token uses 18 decimals by default. All minting values must be specified in `wei` (1 token = 10^18).