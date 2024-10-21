import { wormholeConnectHosted } from '@wormhole-foundation/wormhole-connect';

// Existing DOM element where you want to mount Connect
const container = document.getElementById('bridge-container');

wormholeConnectHosted(container);
