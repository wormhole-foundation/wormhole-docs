---
title: Troubleshooting NTT Deployment
description: Resolve common issues in NTT deployment with this troubleshooting guide covering Solana, EVM, mint authority, decimals, and rate limits.
---

# Troubleshooting NTT Deployment

If you encounter issues during the NTT deployment process, check the following common points:

- **Solana and Anchor versions** - ensure you are using the expected versions of Solana and Anchor as outlined in the [deployment page](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#install-dependencies){target=\_blank}
- **Token compliance on EVM** - verify that your token is an ERC20 token on the EVM chain
- **Mint authority transfer**
    - **For burn or spoke tokens on Solana** - ensure the token mint authority was transferred as described in the [set SPL Token Mint Authority](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#set-spl-token-mint-authority){target=\_blank} section
    - **For EVM tokens** - confirm the token minter was set to the NTT Manager. Refer to the [set Token Minter to NTT Manager](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/#set-token-minter-to-ntt-manager){target=\_blank} section for details
- **Decimal configuration** - run `ntt pull` to correctly configure the decimals in your `deployment.json` file. More details in the [configure NTT](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-solana/#configure-ntt){target=\_blank} section
- **Rate limit configuration** - increase your rate limits to a value greater than zero. A rate limit of zero can cause transactions to get stuck. Learn more on how to [configure rate limits](/docs/build/contract-integrations/native-token-transfers/deployment-process/deploy-to-evm/#configure-ntt){target=\_blank}


