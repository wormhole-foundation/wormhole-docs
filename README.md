**WIP**

# Documentation for Wormhole

This repository contains documentation for Wormhole, an interoperability platform powering multichain apps and bridges. Here, you'll find both high-level and technical information for developers.

## About This Site

The content in this repository is displayed on the Wormhole documentation site generated using [mkdocs](https://www.mkdocs.org). The theme used is [Material for MkDocs](https://squidfunk.github.io/mkdocs-material).

## Contributing

**WIP**

## Changes Made:

**Token Bridge:** Added guidance on attesting tokens, checking their status, and deploying across multiple chains.
**Core Contracts:** Clarified the multicast process and the separation of VAA creation from relay delivery.
**Native Token Transfers Overview:** Expanded on key features, including fungibility, composability, and integration paths for NTT and Token Bridge.
**Native Token Transfers Security:** Detailed the Global Accountant's role in ensuring token integrity and provided more context on governance and upgradeability.
**Relayers:** Enhanced explanations of specialized and standard relayers, their use cases, and limitations.
VAAs: Added practical details on token transfer, attestation processes, and token transfers with messages.

## Further Suggestions:

**NTT Solana Deployment:**

- Verify whether Anchor is strictly required for all NTT deployments on Solana. If it is found to be optional, provide separate guidance for deploying with and without Anchor in the installation section.
- If Anchor is optional, add two subsections under "Deploy NTT" and "Deploy your SPL Token" to provide:
  - **Context on NTT with Anchor:** Potentially add a brief explanation of the benefits of using Anchor// example scenarios where it is recommended.
  - **Simplified Token Deployment Instructions:** Offer concise steps for token deployment without Anchor, focusing on users who might prefer or require a simpler setup.
