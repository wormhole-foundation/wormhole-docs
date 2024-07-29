---
title: SPY
description: 
---

<!--
[link](#){target=\_blank}
`
!!! note
```js
--8<-- 'code/learn/infrastructure/VAAs/header.js'
```
-->

# SPY

A Spy, in the wormhole context, is a daemon that subscribes to the gossiped messages in the Guardian Network.

The messages available on over gossip are things like

- [VAAs](#){target=\_blank} <!-- link to VAAs page -->
- [Observations](#){target=\_blank} <!-- link to glossary -->
- Guardian Heartbeats

The source for the Spy is available on [Github](https://github.com/wormhole-foundation/wormhole/blob/main/node/cmd/spy/spy.go){target=\_blank}

!!! note
    The Spy has no persistence layer built in, so typically its paired with something like Redis or a SQL database to record relevant messages