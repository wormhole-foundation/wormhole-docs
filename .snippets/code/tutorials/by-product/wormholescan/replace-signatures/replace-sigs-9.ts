import { fetchGuardianSet } from '../src/helpers/vaaHelper';

const testFetchGuardianSet = async () => {
  const [guardians, guardianSetIndex] = await fetchGuardianSet();

  console.log('Current Guardian Set Index:', guardianSetIndex);
  console.log('Guardian Addresses:', guardians);
};

testFetchGuardianSet();
