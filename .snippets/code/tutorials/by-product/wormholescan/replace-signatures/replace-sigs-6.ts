import { fetchVaaId, fetchVaa } from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testFetchVaa = async () => {
  const vaaId = await fetchVaaId(TXS[0]);

  if (!vaaId) {
    console.log('VAA ID not found.');
    return;
  }

  const vaaBytes = await fetchVaa(vaaId);
  console.log(
    `VAA Bytes: ${vaaBytes ? vaaBytes.toString('hex') : 'Not found'}`
  );
};

testFetchVaa();
