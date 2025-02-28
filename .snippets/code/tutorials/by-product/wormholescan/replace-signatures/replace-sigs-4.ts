import { fetchVaaId } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchVaaId = async () => {
  const vaaId = await fetchVaaId(TXS[0]);

  if (vaaId) {
    console.log(`VAA ID: ${vaaId}`);
  }
};

testFetchVaaId();
