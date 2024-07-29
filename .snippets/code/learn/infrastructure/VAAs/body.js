u32         timestamp       // The timestamp of the block this message was                              published in
u32         nonce           //  
u16         emitter_chain   // The id of the chain that emitted the message
[32]byte    emitter_address // The contract address (wormhole formatted)                                that called the core contract
u64         sequence        // The auto incrementing integer that                                       represents the number of messages published by                              this emitter
u8          consistency_level // The consistency level (finality) required                              by this emitter
[]byte      payload         // arbitrary bytes containing the data to be                                acted on