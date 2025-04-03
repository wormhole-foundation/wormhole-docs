---
title: LLM Resources
description: Download LLM-optimized files of the Wormhole documentation, including full content and category-specific resources for AI agents.
---

# LLM Resources

## Overview

Wormhole provides `.txt` files containing the documentation content and navigation structure. These files are prepared specifically for Large Language Models (LLMs) and AI agents.

You can use these files to:

 - Enable custom AI agents trained on the Wormhole documentation
 - Provide LLMs with reference material for technical support and accurate query responses

These resources are intended to help developers learn and understand the Wormhole Protocol. They contain documentation content only and do not include live data or protocol APIs.

## Full Documentation Files

Use these files to provide LLM access to the complete Wormhole documentation.

| File name          | Description                                              | Download               |
|--------------------|----------------------------------------------------------|------------------------|
| `llms.txt`         |  Navigation index of all Wormhole documentation pages    |  [llms.txt]()          |
| `llms-full.txt`    |  Full content of all documentation pages                 |  [llms-full.txt]()     |

!!! note
    The `llms-full.txt` file may exceed the input limits of some language models due to its size. If you encounter limitations, consider using the [files by category](#files-by-category).

## Files by Category

For convenience, we provide LLM files grouped by product category. Each file is self-contained and includes all the necessary context:

 - Relevant documentation pages for that category
 - Shared foundational concepts such as the Wormhole architecture and messaging infrastructure
 - Reference material including chain IDs, contract addresses, and finality details


| Category       | File                      | Actions                                                                                                                                                                                       |
|----------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Basics         | `llms-basics.txt`         | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-basics.txt" } [:octicons-download-16:](/docs/llms-files/llms-basics.txt){ download="llms-basics.txt" }                           |
| Reference      | `llms-reference.txt`      | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-reference.txt"} [:octicons-download-16:](/docs/llms-files/llms-reference.txt){ download="llms-reference.txt" }                   |
| NTT            | `llms-ntt.txt`            | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-ntt.txt" } [:octicons-download-16:](/docs/llms-files/llms-ntt.txt){ download="llms-ntt.txt" }                                    |
| Connect        | `llms-connect.txt`        | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-connect.txt" } [:octicons-download-16:](/docs/llms-files/llms-connect.txt){ download="llms-connect.txt" }                        |
| Token Bridge   | `llms-token-bridge.txt`   | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-token-bridge.txt" }   [:octicons-download-16:](/docs/llms-files/llms-token-bridge.txt){ download="llms-token-bridge.txt" }       |
| Settlement     | `llms-settlement.txt`     | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-settlement.txt" } [:octicons-download-16:](/docs/llms-files/llms-settlement.txt){ download="llms-settlement.txt" }               |
| Relayers       | `llms-relayers.txt`       | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-relayers.txt" } [:octicons-download-16:](/docs/llms-files/llms-relayers.txt){ download="llms-relayers.txt" }                     |
| MultiGov       | `llms-multigov.txt`       | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-multigov.txt" } [:octicons-download-16:](/docs/llms-files/llms-multigov.txt){ download="llms-multigov.txt" }                     |
| Queries        | `llms-queries.txt`        | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-queries.txt" } [:octicons-download-16:](/docs/llms-files/llms-queries.txt){ download="llms-queries.txt" }                        |
| Solidity SDK   | `llms-solidity-sdk.txt`   | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-solidity-sdk.txt" } [:octicons-download-16:](/docs/llms-files/llms-solidity-sdk.txt){ download="llms-solidity-sdk.txt" }         |
| TypeScript SDK | `llms-typescript-sdk.txt` | [:octicons-copy-16:](){ .llms action="copy" data-value="llms-typescript-sdk.txt" }   [:octicons-download-16:](/docs/llms-files/llms-typescript-sdk.txt){ download="llms-typescript-sdk.txt" } |