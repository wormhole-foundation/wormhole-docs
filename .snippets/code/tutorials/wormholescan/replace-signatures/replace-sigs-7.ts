import { fetchVaaId, fetchVaa } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchVaa = async () => {
  for (const tx of TXS) {
    const vaaIds = await fetchVaaId([tx]);

    if (vaaIds.length === 0) {
      console.log(`No VAA ID found for transaction: ${tx}`);
      continue;
    }

    for (const vaaId of vaaIds) {
      const vaaBytes = await fetchVaa([vaaId]);

      console.log(
        `Transaction: ${tx}\nVAA ID: ${vaaId}\nVAA Bytes: ${
          vaaBytes.length > 0 ? vaaBytes[0].vaaBytes : 'Not found'
        }`
      );
    }
  }
};

testFetchVaa();
