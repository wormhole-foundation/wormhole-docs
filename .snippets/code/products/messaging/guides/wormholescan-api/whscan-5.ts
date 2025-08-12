#!/usr/bin/env tsx

import { wormholeScanAPI } from '../helpers/api-client';
import { NTTToken, NTTTokenDetail } from '../helpers/types';
import { getRandomPlatform } from '../helpers/utils';

// Configurable variable - easily adjust the number of tokens to process
const TOKENS_TO_PROCESS = INSERT_NUMBER_OF_TOKENS;

async function fetchNTTTokens() {
  console.log('🔍 Fetching NTT tokens from WormholeScan API...\n');

  try {
    const tokens = (await wormholeScanAPI.getNTTTokens(false)) as NTTToken[];

    // Get detailed information for tokens
    const tokensWithPlatforms = tokens.filter(
      (token) => Object.keys(token.platforms).length > 0
    );
    const tokensToProcess = tokensWithPlatforms.slice(0, TOKENS_TO_PROCESS);

    console.log(
      `🔍 Fetching detailed NTT information for first ${TOKENS_TO_PROCESS} tokens...\n`
    );

    for (const token of tokensToProcess) {
      console.log(`📋 ${token.symbol} (${token.coingecko_id})`);

      // Get a random platform from the token's available platforms
      const platformInfo = getRandomPlatform(token);

      if (!platformInfo) {
        console.error(
          `❌ Could not determine platform info for ${token.symbol}`
        );
        continue;
      }

      const { platform, address, chainId } = platformInfo;

      console.log(`Selected Platform: ${platform} (Chain ID: ${chainId})`);

      try {
        // Fetch detailed NTT information using the correct chain ID
        const detail = (await wormholeScanAPI.get(
          `/ntt/token/${chainId}/${address}`
        )) as NTTTokenDetail;

        console.log(`Token Name: ${detail.home.token.name}`);
        console.log(`Token Symbol: ${detail.home.token.symbol}`);
        console.log(`Mode: ${detail.home.mode}`);
        console.log(`Manager Address: ${detail.home.manager.address}`);
        console.log(`Version: ${detail.home.manager.version}`);
        console.log(
          `Transceiver Address: ${
            detail.home.manager.transceivers[0]?.address || 'N/A'
          }`
        );
      } catch (error) {
        console.log(
          `❌ No NTT configuration found for ${token.symbol} on ${platform}`
        );
      }

      console.log('\n' + '='.repeat(50) + '\n');
    }
  } catch (error) {
    console.error('❌ Error fetching NTT tokens:', error);
    process.exit(1);
  }
}

fetchNTTTokens();
