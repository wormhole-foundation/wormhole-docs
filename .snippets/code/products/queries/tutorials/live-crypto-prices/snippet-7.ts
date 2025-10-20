'use client';

import { useEffect, useRef, useState } from 'react';

// Expected API success shape from /api/queries
type ApiOk = {
  ok: true;
  price: string;
  updatedAt: number | string;
  blockNumber: string;
  blockTimeMicros: number;
  decimals: number;
  stale: boolean;
};

// API error shape
type ApiErr = { ok: false; error: string };

// Format timestamps for display
function formatTime(ts: number | string) {
  let n: number;
  if (typeof ts === 'string') {
    const numeric = Number(ts);
    if (Number.isFinite(numeric)) {
      n = numeric;
    } else {
      const parsed = new Date(ts);
      return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
    }
  } else {
    n = ts;
  }
  if (!Number.isFinite(n)) return '—';
  // If it looks like seconds, convert to ms
  const ms = n < 1_000_000_000_000 ? n * 1000 : n;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

export default function PriceWidget() {
  // UI state: fetched data, loading state, and any errors
  const [data, setData] = useState<ApiOk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Keep track of polling and prevent overlapping requests
  const timer = useRef<NodeJS.Timeout | null>(null);
  const inFlight = useRef(false);

  // Fetch price data from the API route
  async function fetchPrice() {
    if (inFlight.current) return; // avoid concurrent requests
    inFlight.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/queries', { cache: 'no-store' });
      const json: ApiOk | ApiErr = await res.json();
      if (!json.ok) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch price');
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }

  // Fetch immediately and refresh every 30 seconds
  useEffect(() => {
    fetchPrice();
    timer.current = setInterval(fetchPrice, 30_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">ETH/USD Live Price</h2>
        {data?.stale ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
            Stale
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Fresh
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold tabular-nums">
          {loading && !data ? 'Loading…' : data ? data.price : '—'}
        </div>

        <div className="text-sm text-gray-600">
          {data ? (
            <>
              Updated at {formatTime(data.updatedAt)}, block {data.blockNumber}
            </>
          ) : error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            'Fetching latest price'
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={fetchPrice}
          className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh now'}
        </button>
      </div>
    </div>
  );
}
