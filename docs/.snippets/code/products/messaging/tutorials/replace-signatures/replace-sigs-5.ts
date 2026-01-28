import { fetchVaaId } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchVaaId = async () => {
  for (const tx of TXS) {
    const vaaIds = await fetchVaaId([tx]);

    if (vaaIds.length > 0) {
      console.log(`Transaction: ${tx}`);
      vaaIds.forEach((vaaId) => console.log(`VAA ID: ${vaaId}`));
    } else {
      console.log(`No VAA ID found for transaction: ${tx}`);
    }
  }
};

testFetchVaaId();
