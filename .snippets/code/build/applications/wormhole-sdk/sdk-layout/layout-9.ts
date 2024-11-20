import {
  chainItem,
  universalAddressItem,
} from '@wormhole-foundation/sdk-core/layout-items';

const exampleLayout = [
  { name: 'sourceChain', ...chainItem() }, // Use predefined chain ID layout
  { name: 'senderAddress', ...universalAddressItem }, // Use universal address layout
] as const;
