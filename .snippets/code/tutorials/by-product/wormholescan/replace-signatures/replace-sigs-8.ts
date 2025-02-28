import { fetchVaaId, fetchObservations } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchObservations = async () => {
  const vaaIds = await fetchVaaId([TXS[0]]);
  if (!vaaIds.length) {
    console.log('No VAA IDs found.');
    return;
  }

  const observations = await fetchObservations(vaaIds[0]);
  console.log('Observations:', observations);
};

testFetchObservations();
