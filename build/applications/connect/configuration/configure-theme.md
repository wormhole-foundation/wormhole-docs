---
title: Connect Theme & UI Customization
description: Learn how to style Wormhole Connect with custom color schemes, fonts, layouts, and menus for a streamlined user experience.
---

## Theme & UI Customization

This page focuses on how to style the Wormhole Connect widget, covering color schemes, fonts, layout changes (like toggling the hamburger menu), and adding extra menu entries. You'll learn how to customize Connect's look and feel to match your application's branding.

### Changing the Color Scheme

You can customize Connect's color scheme by providing a `theme` prop.

=== "React integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/custom-colors.tsx'
    ```

=== "Hosted integration"

    ```ts
    --8<-- 'code/build/applications/connect/configuration/custom-colors-hosted.tsx'
    ```

The `WormholeConnectTheme` type supports the following properties:

| <div style="width:10em">Property</div> |                              Description                              |        Example        |
|:--------------------------------------:|:---------------------------------------------------------------------:|:---------------------:|
|                 `mode`                 |                 Dark mode or light mode. **Required**                 | `"dark"` or `"light"` |
|                `input`                 |                Color used for input fields, dropdowns                 |      `"#AABBCC"`      |
|               `primary`                |                    Primary color used for buttons                     |      `"#AABBCC"`      |
|              `secondary`               |               Secondary color used for some UI elements               |      `"#AABBCC"`      |
|                 `text`                 |                      Primary color used for text                      |      `"#AABBCC"`      |
|            `textSecondary`             |                 Secondary color used for dimmer text                  |      `"#AABBCC"`      |
|                `error`                 |         Color to display errors in, usually some shade of red         |      `"#AABBCC"`      |
|               `success`                |                 Color to display success messages in                  |      `"#AABBCC"`      |
|                `badge`                 |                 Background color used for chain logos                 |      `"#AABBCC"`      |
|                 `font`                 | Font used in the UI, can be custom font available in your application | `"Arial; sans-serif"` |

### Toggle Hamburger Menu {: #toggle-hamburger-menu }

By setting the `showHamburgerMenu` option to **false**, you can deactivate the hamburger menu, which will position the links at the bottom.

#### Add Extra Menu Entry {: #add-extra-menu-entry }

By setting the `showHamburgerMenu` option to `false,` you can add extra links. The following properties are accessed through the `menu[]` property (e.g., `menu[].label`):

| Property |                 Description                 |
|:--------:|:-------------------------------------------:|
| `label`  |            Link name to show up             |
|  `href`  |              Target URL or URN              |
| `target` | Anchor standard target, by default `_blank` |
| `order`  | Order where the new item should be injected |

```jsx
--8<-- 'code/build/applications/connect/configuration/custom-menu.jsx'
```
