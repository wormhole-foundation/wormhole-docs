1. Install the NTT CLI:

    ```bash
    git clone --branch 'v1.5.0+cli' --single-branch --depth 1 \
        https://github.com/wormhole-foundation/native-token-transfers.git
    cd native-token-transfers
    ```

    ```bash
    curl -fsSL https://bun.com/install | bash -s "bun-v1.2.23"  
    ```

    ```bash
    npm ci
    cd cli
    ./install.sh
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

3. Create the deployment config using the following command. This will generate a `deployment.json` file where your settings are stored:

    === "Mainnet"

        ```bash
        ntt init Mainnet
        ```
