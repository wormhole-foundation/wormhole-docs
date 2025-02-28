import {
  fetchVaaId,
  fetchVaa,
  checkVaaValidity,
} from '../src/helpers/vaaHelper';
import { TXS } from '../src/config/constants';

const testCheckVaaValidity = async () => {
  const vaaId = await fetchVaaId(TXS[0]);
  if (!vaaId) {
    console.log('VAA ID not found.');
    return;
  }

  const vaaBytes = await fetchVaa(vaaId);
  if (!vaaBytes) {
    console.log('VAA not found.');
    return;
  }

  const result = await checkVaaValidity(vaaBytes.toString('base64'));
  console.log('VAA Validity:', result);
};

testCheckVaaValidity();
