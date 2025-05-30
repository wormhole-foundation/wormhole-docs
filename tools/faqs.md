---
title: Toolkit FAQs
description: FAQs on Wormhole Toolkit, covering Wormholescan, CLI, SDKs (TypeScript, Solidity), Tilt, error handling, transaction history, and manual VAA submission.
categories: Solidity-SDK, Typescript-SDK
---

# Toolkit FAQs

## Why does the `toNative` function in the TypeScript SDK return an error?

The `toNative` function may return an error if the platform-specific module (such as Solana or EVM) is not correctly imported or passed into the Wormhole constructor.

To fix this, ensure the relevant platform module is imported and included when initializing Wormhole. For example, if you're working with Solana, make sure to import the Solana module and pass it into the Wormhole constructor like this:

```typescript
import solana from '@wormhole-foundation/sdk/solana';
const wh = await wormhole('Testnet', [solana]);
```

## How can I retrieve the history of previously bridged transactions?

To retrieve the history of previously bridged transactions, you can use the Wormholescan API. Use the following endpoint to query the transaction history for a specific address:

```bash
https://api.wormholescan.io/api/v1/operations?address=INSERT_ADDRESS
```

Simply replace `INSERT_ADDRESS_HERE` with the address you want to query. The API will return a list of operations, including details about previously bridged transactions.

???- example "Fetch transaction history for a specific address"
    ```bash
    curl -X GET "https://api.wormholescan.io/api/v1/operations?address=0x05c009C4C1F1983d4B915C145F4E782de23d3A38" -H "accept: application/json"
    ```

## How can I manually submit a VAA to a destination chain in the correct format?

To manually submit a VAA (Verifiable Action Approval) to a destination chain, follow these steps:

1. **Obtain the VAA in Base64 format** - navigate to the **Advanced** tab in [Wormholescan](https://wormholescan.io/){target=\_blank} to find the VAA associated with the transaction you want to submit and copy the VAA in base64 format

    ```bash
    https://wormholescan.io/#/tx/INSERT_TX_HASH?view=advanced
    ```

2. **Convert the VAA to hex** - you must convert the base64 VAA into a hexadecimal (hex) format before submitting it to the destination chain. This can be done using various online tools or via command-line utilities like `xxd` or a script in a language like Python

3. **Submit the VAA through Etherscan (for EVM chains)** - once the VAA is in hex format, go to the [Etherscan UI](https://etherscan.io/){target=\_blank} and submit it through the [`TokenBridge`](https://github.com/wormhole-foundation/wormhole-solidity-sdk/blob/main/src/interfaces/ITokenBridge.sol){target=\_blank} contract’s method (such as the `CompleteTransfer` function or `CompleteTransferWithPayload`)

    - The `TokenBridge` contract addresses for each chain are available in the [Wormhole contract addresses](/docs/products/reference/contract-addresses/){target=\_blank} section

    - Interact with the smart contract through the Etherscan UI by pasting the hex-encoded VAA into the appropriate field

Following these steps, you can manually submit a VAA in the proper format to a destination chain.
