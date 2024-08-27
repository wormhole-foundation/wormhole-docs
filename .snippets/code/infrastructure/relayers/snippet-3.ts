wormholeRpcs?: string[];  // List of URLs from which to query missed VAAs
concurrency?: number;     // How many concurrent requests to make for workflows
spyEndpoint?: string;     // The hostname and port of our Spy
logger?: Logger;          // A custom Logger
privateKeys?: Partial<{ [k in ChainId]: any[]; }>; // A set of keys that can be used to sign and send transactions
tokensByChain?: TokensByChain;    // The token list we care about
workflows?: { retries: number; }; // How many times to retry a given workflow
providers?: ProvidersOpts;        // Configuration for the default providers
fetchSourceTxhash?: boolean;      // whether or not to get the original transaction id/hash
// Redis config
redisClusterEndpoints?: ClusterNode[];
redisCluster?: ClusterOptions;
redis?: RedisOptions;