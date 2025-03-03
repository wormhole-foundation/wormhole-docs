import { fetchVaaId, fetchObservations } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchObservations = async () => {
  for (const tx of TXS) {
    const vaaIds = await fetchVaaId([tx]);

    if (vaaIds.length === 0) {
      console.log(`No VAA ID found for transaction: ${tx}`);
      continue;
    }

    for (const vaaId of vaaIds) {
      const observations = await fetchObservations(vaaId);

      if (observations.length === 0) {
        console.log(`No observations found for VAA ID: ${vaaId}`);
        continue;
      }

      console.log(
        `Transaction: ${tx}\nVAA ID: ${vaaId}\nObservations:`,
        observations
      );
    }
  }
};

testFetchObservations();
