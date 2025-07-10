#!/usr/bin/env tsx

import { wormholeScanTestnetAPI } from '../helpers/api-client';
import { OperationsResponse } from '../helpers/types';
import { getOperationStatus } from '../helpers/utils';

const EMITTER_ADDRESS = '0xdF77F921a560F6882e4EC4bbDc2fF37a7A26D4Db';
const PAGE_SIZE = 5;

async function fetchTokenTransfers() {
  console.log(
    '🔍 Fetching token transfer operations from WormholeScan API...\n'
  );

  try {
    const response = (await wormholeScanTestnetAPI.get(
      `/operations?address=${EMITTER_ADDRESS}&pageSize=${PAGE_SIZE}`
    )) as OperationsResponse;

    console.log(
      `✅ Found ${response.operations.length} operations for emitter ${EMITTER_ADDRESS}\n`
    );

    for (const operation of response.operations) {
      const overallStatus = getOperationStatus(operation);
      const { standarizedProperties } = operation.content;

      console.log(`📋 Status: ${overallStatus}`);
      console.log(
        `🔗 Transfer: Chain ${standarizedProperties.fromChain} → Chain ${standarizedProperties.toChain}`
      );
      console.log(`📍 From: ${standarizedProperties.fromAddress}`);
      console.log(`📍 To: ${standarizedProperties.toAddress}`);

      if (operation.sourceChain) {
        console.log(
          `🟢 Source: ${operation.sourceChain.transaction.txHash} (${operation.sourceChain.status})`
        );
      }

      if (operation.targetChain) {
        console.log(
          `🟢 Target: ${operation.targetChain.transaction.txHash} (${operation.targetChain.status})`
        );
      }

      if (operation.vaa && !operation.targetChain) {
        console.log(`⏳ VAA emitted, awaiting completion`);
      }

      console.log(''); // Empty line between operations
    }
  } catch (error) {
    console.error('❌ Error fetching token transfers:', error);
    process.exit(1);
  }
}

fetchTokenTransfers();
