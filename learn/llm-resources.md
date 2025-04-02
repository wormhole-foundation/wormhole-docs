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

| Category      | Download                     |
|---------------|------------------------------|
| Basics        |  [basics-llms.txt]()         |
| Reference     |  [reference-llms.txt]()      |
| NTT           |  [ntt-llms.txt]()            |
| Connect       |  [connect-llms.txt]()        |
| Token Bridge  |  [token-bridge-llms.txt]()   |
| Settlement    |  [settlement-llms.txt]()     |
| Relayers      |  [relayers-llms.txt]()       |
| MultiGov      |  [multigov-llms.txt]()       |
| Queries       |  [queries-llms.txt]()        |
| Solidity SDK  |  [solidity-sdk-llms.txt]()   |
| TypeScript SDK|  [typescript-sdk-llms.txt]() |