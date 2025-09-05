This section walks you through setting up a wallet, deploying a Sui Coin contract, and minting tokens on testnet.

1. **Clone the repository**: Use the [example NTT token repository](https://github.com/wormhole-foundation/example-ntt-token-sui.git){target=\_blank} to deploy a Sui Coin contract on testnet.

    ```bash
    git clone https://github.com/wormhole-foundation/example-ntt-token-sui.git
    cd example-ntt-token-sui
    ```

2. **Set up a new wallet on testnet**: Before building and deploying your token, you'll need to create a new wallet on the Sui testnet and fund it with test tokens.

    1. **Create a new testnet environment**: Configure your Sui client for testnet.

        ```bash
        sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
        ```

    2. **Generate a new address**: Create a new Ed25519 address for your wallet.

        ```bash
        sui client new-address ed25519
        ```

    3. **Switch to the new address**: The above command will output a new address. Copy this address and switch to it.

        ```bash
        sui client switch --address YOUR_ADDRESS_STEP2
        ```

    4. **Fund your wallet**: Use the faucet to get test tokens.

        ```bash
        sui client faucet
        ```

    5. **Verify funding**: Check that your wallet has been funded.

        ```bash
        sui client balance
        ```

3. **Build the project**: Compile the Move contract.

    ```bash
    sui move build
    ```

4. **Deploy the token contract**: Deploy to testnet.

    ```bash
    sui client publish --gas-budget 10000000
    ```

5. **Mint tokens**: Send tokens to your address.

    ```bash
    sui client call \
    --package YOUR_DEPLOYED_PACKAGE_ID_STEP4 \
    --module MODULE_NAME_STEP1 \
    --function mint \
    --args TREASURYCAP_ID_STEP4 AMOUNT_WITH_DECIMALS RECIPIENT_ADDRESS \
    --gas-budget 10000000
    ```

!!! note
    This token uses 9 decimals by default. All minting values must be specified with that in mind (1 token = 10^9).