/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/example_cctp_with_executor.json`.
 */
export type ExampleCctpWithExecutor = {
  address: 'CXGRA5SCc8jxDbaQPZrmmZNu2JV34DP7gFW4m31uC1zs';
  metadata: {
    name: 'exampleCctpWithExecutor';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'relayLastMessage';
      discriminator: [68, 157, 251, 90, 201, 66, 40, 60];
      accounts: [
        {
          name: 'payer';
          docs: ['Payer will pay the Executor'];
          writable: true;
          signer: true;
        },
        {
          name: 'payee';
          writable: true;
        },
        {
          name: 'messageTransmitter';
        },
        {
          name: 'executorProgram';
          address: 'Ax7mtQPbNPQmghd7C3BHrMdwwmkAXBDq7kNGfXNcc7dg';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'args';
          type: {
            defined: {
              name: 'relayLastMessageArgs';
            };
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'messageTransmitter';
      discriminator: [71, 40, 180, 142, 19, 203, 35, 252];
    }
  ];
  types: [
    {
      name: 'messageTransmitter';
      docs: ['Main state of the MessageTransmitter program'];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'pendingOwner';
            type: 'pubkey';
          },
          {
            name: 'attesterManager';
            type: 'pubkey';
          },
          {
            name: 'pauser';
            type: 'pubkey';
          },
          {
            name: 'paused';
            type: 'bool';
          },
          {
            name: 'localDomain';
            type: 'u32';
          },
          {
            name: 'version';
            type: 'u32';
          },
          {
            name: 'signatureThreshold';
            type: 'u32';
          },
          {
            name: 'enabledAttesters';
            type: {
              vec: 'pubkey';
            };
          },
          {
            name: 'maxMessageBodySize';
            type: 'u64';
          },
          {
            name: 'nextAvailableNonce';
            type: 'u64';
          }
        ];
      };
    },
    {
      name: 'relayLastMessageArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'recipientChain';
            type: 'u16';
          },
          {
            name: 'execAmount';
            type: 'u64';
          },
          {
            name: 'signedQuoteBytes';
            type: 'bytes';
          },
          {
            name: 'relayInstructions';
            type: 'bytes';
          }
        ];
      };
    }
  ];
};
