---
title: RPC Basics
description: Understand Remote Procedure Calls for blockchain and learn how they power interactions through their structure, functions & API usage.
categories: Queries
---

## The Remote Procedural Call

A Remote Procedure Call (RPC) node is a server that enables applications to read blockchain data and send transactions to different networks. It acts as a direct communication bridge, allowing apps to interact efficiently with the blockchain by querying data, submitting transactions, and executing smart contracts. This real-time access to blockchain information enhances application functionality and user experience.

This page will cover the RPC basics, their fundamental purpose, how they operate, and why they are essential for blockchain networks.

## How it Works

Applications interact with blockchain nodes for data and transactions via Remote Procedure Calls (RPCs). The following breaks down the step-by-step flow of this request-response:

1. **Client Request Initiation** - your application calls a client library function to perform a specific blockchain operation
2. **Request Formatting (Client)** - the client library converts your requested operation and its parameters into a standardized RPC request message and then serializes it
3. **Request Transmission to Node** - the client sends this serialized request message over the network to the blockchain node's specific RPC endpoint
4. **Request Processing (Node)** - the blockchain node receives the message, and its Request Decoder component deserializes, validates, and extracts the details from your request.
5. **Blockchain Operation Execution (Node)** - the node's internal router directs the request, and then performs the specified blockchain task
6. **Result Preparation (Node)** - after executing the operation, the node prepares the result, which could be the data you requested or an error message if something went wrong
7. **Response Formatting & Transmission (Node)** - the node's Response Encoder component packages this result along with the original request ID into a formal RPC response message, serializes it, and sends it back to your client over the network
8. **Response Processing (Client)** - your client library receives the serialized response, deserializes it, and uses the request ID to match the response to the original request
9. **Client Application Update** - the library then delivers the retrieved data to your application, which can then use it to update the user interface, confirm an action, or handle any issues


## RPC Components
When sending a request to a blockchain node, you include a unique ID for tracking. The node uses this same ID in its reply, making matching answers to your questions easy. RPC nodes themselves consist of various components—some standard, others provider-specific. Common ones include:

‍- **Request Decoder** - deciphers and verifies incoming requests, then extracts and standardizes key details to ensure they are correctly formatted for the system's internal handling

- ‍**Router** - directs incoming requests to the Core Engine via optimized pathways within an RPC node, ensuring responses are correctly routed back to the client

- ‍**Response Encoder** - formats, compresses, and finalizes processed results into readable outputs (like JSON or XML), then sends this prepared response to the Client Handler for delivery


## Key Functions

- **RPC Tasks** - handles RPC calls from diverse clients for core blockchain operations like data access and transactions

- **Validation & Execution** - verifies data by checking its local copy of the blockchain. They also run computations, manage request queues, and validate inputs and parameters

- **Data & Status** - returns relevant information like account balances and history, block and transaction history details, as well as smart contract states. RPCs also provide transaction status updates and gas estimates

- **Contract RPC Functions** - enables smart contract interactions—including reading states, executing view functions, deploying contracts, processing transactions, and retrieving event logs—which supports contract deployment, function calls, state queries, event monitoring, and analytics

- **Transaction Broadcasting** - broadcasts transactions by validating formats, checking validity, broadcasting to other network nodes, tracking transaction status, and returning confirmation details

## RPC Methods

An RPC endpoint is an address where applications send requests to interact with the blockchain using specific, standardized API methods for various operations, simplifying cross-provider development. Some common examples of these specific, standardized API methods include:

- `eth_getBalance`
- `eth_sendTransaction`
- `eth_call`
- `eth_getBlockByNumber`
- `eth_getTransactionReceipt`

### A Successful Response
- **Language Version** - confirms the communication standard being used 
- **Original Identifier** - a unique ID matches the response directly to your specific request, helping you correlate queries with their answers
- **The Result** - the actual data or answer to your query, like the total supply of a token, which can vary in format and requires interpretation by your application

### Common RPC Errors

Sometimes, a request cannot be completed successfully. This might occur due to a misunderstanding in the request, an invalid address, or another issue on the blockchain. In these situations, the node will send an error response instead, typically indicating the nature of the problem.

- **RPC server is unavailable** - occurs when an RPC node is down or overloaded, typically during peak network congestion. It requires fallback RPC providers since it’s critical for application reliability

- **Invalid JSON-RPC request** - can be caused by improperly structured API calls, wrong parameter types, missing fields, or incorrect method names. Usually it is a developer error

- **Timeout issues** - these occur when long-running queries exceed time limits. Network congestion can also cause delays, which creates a need for retry mechanisms