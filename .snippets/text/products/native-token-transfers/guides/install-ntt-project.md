Before proceeding, make sure you have the NTT CLI installed and a project initialized. 

Follow these steps (or see the [Get Started guide](/docs/products/native-token-transfers/get-started/#install-ntt-cli){target=\_blank}):

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

3. Create the deployment config using the following command. This will generate a `deployment.json` file where your settings are stored:

    === "Mainnet"

        ```bash
        ntt init Mainnet
        ```
