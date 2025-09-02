This section walks you through generating a Solana wallet, deploying an SPL token, creating a token account, and minting tokens.

1. **Generate a key pair**: Run the following command to create a new wallet compatible with supported SVM chains.

    ```bash
    solana-keygen grind --starts-with w:1 --ignore-case
    ```

2. **Set CLI keypair configuration**: Configure the Solana CLI to use the generated key pair.

    ```bash
    solana config set --keypair INSERT_PATH_TO_KEYPAIR_JSON
    ```

3. **Select an RPC URL**: Configure the CLI to use the appropriate network using one of the following commands.

    === "Mainnet"
        ```bash
        solana config set -um
        ```

    === "Testnet (Solana's Devnet)"
        ```bash
        solana config set -ud
        ```

    === "Fogo Testnet"
        ```bash
        solana config set --url INSERT_FOGO_TESTNET_RPC_URL
        ```
                
    !!! note
        Solana's official testnet cluster is not supported for token creation or deployment with NTT. You must use the Solana devnet instead.

4. **Fund your wallet**: Ensure your wallet has enough native tokens to cover transaction fees.

    - On Solana Devnet, you can request an airdrop:

        ```bash
        solana airdrop 2
        solana balance
        ```

5. **Install SPL Token CLI**: Install or update the required [CLI tool](https://www.solana-program.com/docs/token#setup){target=\_blank}.

    ```bash
    cargo install spl-token-cli
    ```

6. **Create a new SPL token**: Initialize the token on your connected SVM chain.

    ```bash
    spl-token create-token
    ```

7. **Create a token account**: Generate an account to hold the token.

    ```bash
    spl-token create-account INSERT_TOKEN_ADDRESS
    ```

8. **Mint tokens**: Send 1000 tokens to the created account.

    ```bash
    spl-token mint INSERT_TOKEN_ADDRESS 1000
    ```

!!! note
    NTT versions `>=v2.0.0+solana` support SPL tokens with [transfer hooks](https://www.solana-program.com/docs/transfer-hook-interface){target=\_blank}.