u8      payload_id = 1          // Token Transfer
u256    amount                  // Amount of tokens being transferred.
u8[32]  token_address           // Address on the source chain.
u16     token_chain             // Numeric ID for the source chain.
u8[32]  to                      // Address on the destination chain.
u16     to_chain                // Numeric ID for the destination chain.
u256    fee                     // Portion of amount paid to a relayer.