1. Install the NTT CLI:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/wormhole-foundation/native-token-transfers/main/cli/install.sh | bash
    ```

    Verify installation:

    ```bash
    ntt --version
    ```

2. Initialize a new NTT project:

    ```bash
    ntt new my-ntt-project
    cd my-ntt-project
    ```

3. Create the deployment config**:

    === "Mainnet"

        ```bash
        ntt init Mainnet
        ```

    === "Testnet"

        ```bash
        ntt init Testnet
        ```

    This generates a `deployment.json` file where your deployment settings will be stored.
