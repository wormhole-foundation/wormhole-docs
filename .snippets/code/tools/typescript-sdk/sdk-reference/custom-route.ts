import { Network, routes } from '@wormhole-foundation/sdk-connect';

export class CustomRoute<N extends Network>
  extends routes.Route<N>
  implements routes.StaticRouteMethods<typeof CustomRoute>
{
  static meta = {
    name: 'CustomRoute',
  };
  // implementation...
}
