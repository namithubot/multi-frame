## aframe-multi-frame-component

[![Version](http://img.shields.io/npm/v/aframe-multi-frame-component.svg?style=flat-square)](https://npmjs.org/package/aframe-multi-frame-component)
[![License](http://img.shields.io/npm/l/aframe-multi-frame-component.svg?style=flat-square)](https://npmjs.org/package/aframe-multi-frame-component)

A component to support syncing entities over network

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-multi-frame-component@1.0.0/dist/aframe-multi-frame-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity multi-frame="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-multi-frame-component
```

Then require and use.

```js
require('aframe');
require('aframe-multi-frame-component');
```
