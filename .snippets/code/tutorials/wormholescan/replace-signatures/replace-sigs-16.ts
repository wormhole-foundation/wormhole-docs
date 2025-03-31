import {
  fetchVaaId,
  fetchVaa,
  checkVaaValidity,
  fetchObservations,
  fetchGuardianSet,
  replaceSignatures,
} from '../helpers/vaaHelper';
import { TXS } from '../config/constants';

async function main() {
  try {
    for (const tx of TXS) {
      console.log(`\nProcessing TX: ${tx}\n`);

      // 1. Fetch Transaction VAA IDs:
      const vaaIds = await fetchVaaId([tx]);
      if (!vaaIds.length) continue;

      // 2. Fetch VAA Data:
      const vaaData = await fetchVaa(vaaIds);
      if (!vaaData.length) continue;

      const vaaBytes = vaaData[0].vaaBytes;
      if (!vaaBytes) continue;

      // 3. Check VAA Validity:
      const { valid } = await checkVaaValidity(vaaBytes);
      if (valid) continue;

      // 4. Fetch Observations (VAA signatures):
      const observations = await fetchObservations(vaaIds[0]);

      // 5. Fetch Current Guardian Set:
      const [currentGuardians, guardianSetIndex] = await fetchGuardianSet();

      // 6. Replace Signatures:
      const response = await replaceSignatures(
        Buffer.from(vaaBytes, 'base64'),
        observations,
        currentGuardians,
        guardianSetIndex
      );

      if (!response) continue;
    }
  } catch (error) {
    console.error('❌ Error in execution:', error);
    process.exit(1);
  }
}

main();
