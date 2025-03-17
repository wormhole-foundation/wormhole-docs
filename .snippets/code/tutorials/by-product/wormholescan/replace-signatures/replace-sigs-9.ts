import {
  fetchVaaId,
  fetchVaa,
  checkVaaValidity,
} from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testCheckVaaValidity = async () => {
  for (const tx of TXS) {
    const vaaIds = await fetchVaaId([tx]);

    if (vaaIds.length === 0) {
      console.log(`No VAA ID found for transaction: ${tx}`);
      continue;
    }

    for (const vaaId of vaaIds) {
      const vaaData = await fetchVaa([vaaId]);

      if (vaaData.length === 0 || !vaaData[0].vaaBytes) {
        console.log(`VAA not found for ID: ${vaaId}`);
        continue;
      }

      const result = await checkVaaValidity(vaaData[0].vaaBytes);
      console.log(
        `Transaction: ${tx}\nVAA ID: ${vaaId}\nVAA Validity:`,
        result
      );
    }
  }
};

testCheckVaaValidity();
