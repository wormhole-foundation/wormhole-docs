import axios from 'axios';

export async function postQuery({
  queryUrl,
  apiKey,
  bytes,
  timeoutMs = 25_000,
}: {
  queryUrl: string;
  apiKey: string;
  bytes: Uint8Array;
  timeoutMs?: number;
}) {
  // Convert the query bytes to hex and POST to the proxy
  const res = await axios.post(
    queryUrl,
    { bytes: Buffer.from(bytes).toString('hex') },
    {
      timeout: timeoutMs,
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      validateStatus: (s) => s === 200,
    }
  );
  return res.data; // throws on non-200
}
