import axios from 'axios';
import { eth } from 'web3';
import {
  deserialize,
  serialize,
  VAA,
  Signature,
} from '@wormhole-foundation/sdk';
import {
  RPC,
  ETH_CORE,
  LOG_MESSAGE_PUBLISHED_TOPIC,
  WORMHOLE_SCAN_API,
} from '../config/constants';
import { PARSE_AND_VERIFY_VM_ABI } from '../config/layouts';

export async function fetchVaaId(txHashes: string[]): Promise<string[]> {
  const vaaIds: string[] = [];

  for (const tx of txHashes) {
    try {
      const result = (
        await axios.post(RPC, {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getTransactionReceipt',
          params: [tx],
        })
      ).data.result;

      if (!result)
        throw new Error(`Unable to fetch transaction receipt for ${tx}`);

      for (const log of result.logs) {
        if (
          log.address === ETH_CORE &&
          log.topics?.[0] === LOG_MESSAGE_PUBLISHED_TOPIC
        ) {
          const emitter = log.topics[1].substring(2);
          const seq = BigInt(log.data.substring(0, 66)).toString();
          vaaIds.push(`2/${emitter}/${seq}`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${tx}:`, error);
    }
  }

  return vaaIds;
}

export async function fetchVaa(
  vaaIds: string[]
): Promise<{ id: string; vaaBytes: string }[]> {
  const results: { id: string; vaaBytes: string }[] = [];

  for (const id of vaaIds) {
    try {
      const response = await axios.get(`${WORMHOLE_SCAN_API}/signed_vaa/${id}`);
      const vaaBytes = response.data.vaaBytes;
      results.push({ id, vaaBytes });
    } catch (error) {
      console.error(`Error fetching VAA for ${id}:`, error);
    }
  }
  return results;
}

export async function checkVaaValidity(vaaBytes: string) {
  try {
    const vaa = Buffer.from(vaaBytes, 'base64');
    vaa[4] = 4; // Set guardian set index to 4

    const result = (
      await axios.post(RPC, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            from: null,
            to: ETH_CORE,
            data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [
              `0x${vaa.toString('hex')}`,
            ]),
          },
          'latest',
        ],
      })
    ).data.result;

    const decoded = eth.abi.decodeParameters(
      PARSE_AND_VERIFY_VM_ABI.outputs,
      result
    );
    console.log(
      `${decoded.valid ? '✅' : '❌'} VAA Valid: ${decoded.valid}${
        decoded.valid ? '' : `, Reason: ${decoded.reason}`
      }`
    );

    return { valid: decoded.valid, reason: decoded.reason };
  } catch (error) {
    console.error(`Error checking VAA validity:`, error);
    return { valid: false, reason: 'RPC error' };
  }
}

export async function fetchObservations(vaaId: string) {
  try {
    console.log(`Fetching observations`);
    const response = await axios.get(
      `https://api.wormholescan.io/api/v1/observations/${vaaId}`
    );

    return response.data.map((obs: any) => ({
      guardianAddr: obs.guardianAddr.toLowerCase(),
      signature: obs.signature,
    }));
  } catch (error) {
    console.error(`Error fetching observations:`, error);
    return [];
  }
}

export async function fetchGuardianSet() {
  try {
    console.log('Fetching current guardian set');
    const response = await axios.get(
      `${WORMHOLE_SCAN_API}/guardianset/current`
    );
    const guardians = response.data.guardianSet.addresses.map((addr: string) =>
      addr.toLowerCase()
    );
    const guardianSet = response.data.guardianSet.index;

    return [guardians, guardianSet];
  } catch (error) {
    console.error('Error fetching guardian set:', error);
    return [];
  }
}

export async function replaceSignatures(
  vaa: string | Uint8Array<ArrayBufferLike>,
  observations: { guardianAddr: string; signature: string }[],
  currentGuardians: string[],
  guardianSetIndex: number
) {
  console.log('Replacing Signatures...');

  try {
    if (!vaa) throw new Error('VAA is undefined or empty.');
    if (currentGuardians.length === 0)
      throw new Error('Guardian set is empty.');
    if (observations.length === 0) throw new Error('No observations provided.');

    const validSigs = observations.filter((sig) =>
      currentGuardians.includes(sig.guardianAddr)
    );

    if (validSigs.length === 0)
      throw new Error('No valid signatures found. Cannot proceed.');

    const formattedSigs = validSigs
      .map((sig) => {
        try {
          const sigBuffer = Buffer.from(sig.signature, 'base64');
          // If it's 130 bytes, it's hex-encoded and needs conversion
          const sigBuffer1 =
            sigBuffer.length === 130
              ? Buffer.from(sigBuffer.toString(), 'hex')
              : sigBuffer;

          const r = BigInt('0x' + sigBuffer1.subarray(0, 32).toString('hex'));
          const s = BigInt('0x' + sigBuffer1.subarray(32, 64).toString('hex'));
          const vRaw = sigBuffer1[64];
          const v = vRaw < 27 ? vRaw : vRaw - 27;

          return {
            guardianIndex: currentGuardians.indexOf(sig.guardianAddr),
            signature: new Signature(r, s, v),
          };
        } catch (error) {
          console.error(
            `Failed to process signature for guardian: ${sig.guardianAddr}`,
            error
          );
          return null;
        }
      })
      .filter(
        (sig): sig is { guardianIndex: number; signature: Signature } =>
          sig !== null
      ); // Remove null values

    let parsedVaa: VAA<'Uint8Array'>;
    try {
      parsedVaa = deserialize('Uint8Array', vaa);
    } catch (error) {
      throw new Error(`Error deserializing VAA: ${error}`);
    }

    const outdatedGuardianIndexes = parsedVaa.signatures
      .filter(
        (vaaSig) =>
          !formattedSigs.some(
            (sig) => sig.guardianIndex === vaaSig.guardianIndex
          )
      )
      .map((sig) => sig.guardianIndex);

    console.log('Outdated Guardian Indexes:', outdatedGuardianIndexes);

    let updatedSignatures = parsedVaa.signatures.filter(
      (sig) => !outdatedGuardianIndexes.includes(sig.guardianIndex)
    );

    const validReplacements = formattedSigs.filter(
      (sig) =>
        !updatedSignatures.some((s) => s.guardianIndex === sig.guardianIndex)
    );

    // Check if we have enough valid signatures to replace outdated ones**
    if (outdatedGuardianIndexes.length > validReplacements.length) {
      console.warn(
        `Not enough valid replacement signatures! Need ${outdatedGuardianIndexes.length}, but only ${validReplacements.length} available.`
      );
      return;
    }

    updatedSignatures = [
      ...updatedSignatures,
      ...validReplacements.slice(0, outdatedGuardianIndexes.length),
    ];

    updatedSignatures.sort((a, b) => a.guardianIndex - b.guardianIndex);

    const updatedVaa: VAA<'Uint8Array'> = {
      ...parsedVaa,
      guardianSet: guardianSetIndex,
      signatures: updatedSignatures,
    };

    let patchedVaa: Uint8Array;
    try {
      patchedVaa = serialize(updatedVaa);
    } catch (error) {
      throw new Error(`Error serializing updated VAA: ${error}`);
    }

    try {
      if (!(patchedVaa instanceof Uint8Array))
        throw new Error('Patched VAA is not a Uint8Array!');

      const vaaHex = `0x${Buffer.from(patchedVaa).toString('hex')}`;

      console.log('Sending updated VAA to RPC...');

      const result = await axios.post(RPC, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            from: null,
            to: ETH_CORE,
            data: eth.abi.encodeFunctionCall(PARSE_AND_VERIFY_VM_ABI, [vaaHex]),
          },
          'latest',
        ],
      });

      const verificationResult = result.data.result;
      console.log('Updated VAA (hex):', vaaHex);
      return verificationResult;
    } catch (error) {
      throw new Error(`Error sending updated VAA to RPC: ${error}`);
    }
  } catch (error) {
    console.error('Unexpected error in replaceSignatures:', error);
  }
}
