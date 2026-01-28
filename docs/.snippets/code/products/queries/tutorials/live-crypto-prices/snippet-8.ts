import PriceWidget from '@/components/PriceWidget';

export default function Page() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Live Crypto Price Widget
      </h1>
      <PriceWidget />
    </main>
  );
}
