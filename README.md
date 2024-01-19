# multi-frame
Multiplayer implementation for A-Frame

This contains two parts:
1. A client
2. A server

The client is an A-Frame component and the soul of the implementation. Here's a bit about it.

## Note
This is work in progress and hasn't been tested properly yet.

## Setup

To use simply add a script tag to the file.
```
	<script src="https://cdn.socket.io/4.7.3/socket.io.min.js" integrity="sha384-+miq58Ltmjm+SSP5g8Ok6dpMO/6R4n8xe/x1Yj0Bdb9kiEz25LTnWv/GZQTRQamg" crossorigin="anonymous"></script>
    <script src="https://github.com/namithubot/multi-frame/releases/download/pre-alphav0.0.1/aframe-multi-frame-component.min.js"></script>
```

Notice the socket being a separate tag. That's a requirement.

## Usage
The idea is to keep the usage as minimal and simple as possible using it is simple.
Use `multi-frame` tag on the object you want to sync and provide a unique `mfId` throughout the network.
Example:
```
      <a-box multi-frame="mfId:1" position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
```

For server config:
```
CONFIG = {
  server: {
    protocol: "http",
    address: "localhost",
    port: 3000
  },
  client: {
    id: crypto.randomUUID()
  },
  namespace: 'multi-frame',
};
```
We recommend using namespace as it is.
And example server is available in connectors. The connector is not full fledged and has been designed to work for the demo. You can however write your own websocket server with a namespace given.

To start the multiplayer environment, simple call
```
	startMultiplayer();
```
This would start the environment based on the CONFIG set.

## Reporting
Add any request, suggestion or bug in issues. I'll take it up.