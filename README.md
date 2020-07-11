<p align="center">
    <br/>
    <img width="100" src="./figma-transformer.svg" />
</p>

<h1 align="center">
figma-transformer
</h1>

<div align="center">

A tiny utility library that makes the Figma API more human friendly. 

[![npm version][version-badge]][npm]
[![npm downloads][downloads-badge]][npm]
[![gzip size][size-badge]][size]
![modules][modules-badge]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

</div>

## How to use `figma-transformer`?

```js
import { processFile } from "figma-transformer";

// Fetch the file you want using your favourite method
const originalFile = fetchFigmaFile();

const file = processFile(originalFile);

// ✨ You can now use `file` for whatever you need! ✨

// Let's get the styles for a component named "Test"
const testStyles = file.shortcuts.components.find(
    component => component.name === "Test"
).shortcuts.styles;
```

## Why use `figma-transformer`?

The Figma API is great but sometimes it feels like it's built for machines, not humans. The more you use it, the more you'll end up wasting a lot of time to get to the information that you want.

These are the most common problems:

-   Code needs to change if file structure changes
-   Incomplete information about styles and components
-   No type safety

With `figma-transformer` you get the file structure that you wished the Figma API had.

## How does `figma-transformer` solve these problems?

### Break free from the file structure

The Figma API response is very strict in terms of the file structure. To get to a specific node you have to navigate through the entire tree of nodes and it's really easy for your code to break if there's a change in the design file that changes the initial hierarchy.

We break from that rigid structure by creating shortcuts that are grouped by node type, making it a lot easier to access the nodes that we want irrespective of their placement in the file.

```js
{
    "children": [{...}, {...}],
    "shortcuts": {
        "CANVAS": [...],
        "INSTANCE": [...],
        "RECTANGLE": [...],
        "STYLE": [...],
        "TEXT": [...],
        "FRAME": [...],
        "COMPONENT": [...],
        "GROUP": [...]
    }
}
```

We can see that even though this node just has two direct children, it actually contains a lot more elements down the tree, which are surfaced in the shortcuts.

Each node of the document tree contains the shortcuts to all their respective child nodes, which reduces the amount of work needed to get to the information we need.

### Missing information from nodes

From the API we can get the information about the styles and components that are present in the file, which is great, but it doesn't contain all the information so we need to parse the entire file to get the additional information that we usuallly need.

Let's look at how the Figma API describes the styles in a document:

```js
styles: {
    "1:12": {
        key: "ea017aed6616af00f3c4d59e3d945c8c3e47adca",
        name: "Green",
        styleType: "FILL",
        description: "",
    },
    "1:11": {
        key: "e234400b962ffafce654af9b3220ce88857523ec",
        name: "Red",
        styleType: "FILL",
        description: "",
    },
    "97:6": {
        key: "cc806814e1b9b7d20ce0b6bed8adf52099899c01",
        name: "Body",
        styleType: "TEXT",
        description: "",
    },
},
```

and this is how it's represented after being processed (note the populated styles from the associated nodes)

```js
[
    {
        id: "1:12",
        key: "ea017aed6616af00f3c4d59e3d945c8c3e47adca",
        name: "Green",
        styleType: "FILL",
        description: "",
        styles: [
            {
                blendMode: "NORMAL",
                type: "SOLID",
                color: {
                    r: 0.047774821519851685,
                    g: 0.9563318490982056,
                    b: 0.02923285961151123,
                    a: 1,
                },
            },
        ],
        type: "STYLE",
    },
    {
        id: "1:11",
        key: "e234400b962ffafce654af9b3220ce88857523ec",
        name: "Red",
        styleType: "FILL",
        description: "",
        styles: [
            {
                blendMode: "NORMAL",
                type: "SOLID",
                color: {
                    r: 0.8515284061431885,
                    g: 0.11155396699905396,
                    b: 0.11155396699905396,
                    a: 1,
                },
            },
        ],
        textStyles: {
            fontFamily: "Roboto",
            fontPostScriptName: null,
            fontWeight: 400,
            fontSize: 12,
            textAlignHorizontal: "LEFT",
            textAlignVertical: "TOP",
            letterSpacing: 0,
            lineHeightPx: 14.0625,
            lineHeightPercent: 100,
            lineHeightUnit: "INTRINSIC_%",
        },
        type: "STYLE",
    },
    {
        id: "97:6",
        key: "cc806814e1b9b7d20ce0b6bed8adf52099899c01",
        name: "Body",
        styleType: "TEXT",
        description: "",
        textStyles: {
            fontFamily: "Roboto",
            fontPostScriptName: null,
            fontWeight: 400,
            fontSize: 12,
            textAlignHorizontal: "LEFT",
            textAlignVertical: "TOP",
            letterSpacing: 0,
            lineHeightPx: 14.0625,
            lineHeightPercent: 100,
            lineHeightUnit: "INTRINSIC_%",
        },
        type: "STYLE",
    },
];
```

The same happens with the components, this is what we get from the API:

```js
components: {
    "1:5": { key: "", name: "Rectangle", description: "" },
},
```

and this is the processed data:

```js
{
    "id": "1:5",
    "parentId": "7:0",
    "fileId": "cLp23bR627jcuNSoBGkhL04E",
    "name": "Rectangle",
    "type": "COMPONENT",
    "blendMode": "PASS_THROUGH",
    "absoluteBoundingBox": {
        "x": -232,
        "y": -208,
        "width": 201,
        "height": 109
    },
    "constraints": {
        "vertical": "TOP",
        "horizontal": "LEFT"
    },
    "clipsContent": false,
    "background": [
        {
            "blendMode": "NORMAL",
            "visible": false,
            "type": "SOLID",
            "color": {
                "r": 1,
                "g": 1,
                "b": 1,
                "a": 1
            }
        }
    ],
    "backgroundColor": {
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 0
    },
    "effects": [],
    "children": [...],
    "shortcuts": {...}
}
```

Not only we have the complete node definition but we also have its child nodes and shortcuts so we can easily navigate through the component tree if needed.

### Improved type safety

The Figma API doesn't have official type definitions, but fortunately we can provide a better developer experience by extending the TypeScript type definitions provided by the awesome [figma-js](https://github.com/jongold/figma-js) library.

This means that you can continue to use your preferred way of fetching the data from the Figma API and `figma-transformer` will provide the types for you.

## Examples

Let's see more specific examples where the benefits of the library really stand out.

**Getting all text used in a document**

```js
const text = file.shortcuts.texts.map(node => node.characters);
```

**Finding the styles applied to a specific component**

```js
const styles = file.shortcuts.components
    .filter(component => component.name === "Test")
    .map(component => component.shortcuts.styles);
```

**Getting the fill colours for all the rectangles in the first page**

```js
const fills = file.shortcuts.pages
    .filter(page => page.name === "Page 1")
    .map(page => page.shortcuts.rectangles.fills);
```

## Projects using `figma-transformer`

-   [figma-graphql](https://github.com/braposo/figma-graphql)
-   [theme.figma](https://github.com/ds-tools/theme.figma)

---

## Local Development

Below is a list of commands you will probably find useful.

#### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

Your library will be rebuilt if you make edits.

#### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

#### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

_This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx)._

[npm]: https://www.npmjs.com/package/figma-transformer
[license]: https://github.com/braposo/figma-transformer/blob/master/LICENSE
[prs]: http://makeapullrequest.com
[size]: https://unpkg.com/figma-transformer/dist/figma-transformer.cjs.production.min.js
[version-badge]: https://img.shields.io/npm/v/figma-transformer.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/figma-transformer.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/figma-transformer.svg?style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/figma-transformer/dist/figma-transformer.cjs.production.min.js?compression=gzip&style=flat-square
[modules-badge]: https://img.shields.io/badge/module%20formats-cjs%2C%20esm-green.svg?style=flat-square
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
