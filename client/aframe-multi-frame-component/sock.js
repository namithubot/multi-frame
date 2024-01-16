import { io } from "socket.io-client";

let socket = undefined;

/**
 * Gets the socket address based on the config provided.
 * @returns The socket connection URL.
 */
function getSocketAddress(config) {
  return `${config.server.protocol}://${config.server.address}:${config.server.port}/${config.namespace}`;
}

/**
 * Initializes multiframe with the given config.
 * @param {typeof CONFIG} config
 */
export function initializeMultiFrame(config) {
  socket = io(getSocketAddress(config));

  socket.on("entity-updated", (data) => {
    // If the action is performed by self.
    if (data.clientId === config.client.id) {
      return;
    }

    document
      .querySelectorAll(`[mfId="${data.mfId}"]`)[0]
      .dispatchEvent(new CustomEvent("multiUpdateReceived", {detail: data}));
  });
}

/**
 * Sends the update event to the server socket,
 * @param {*} data Event data.
 */
export function sendProp(data) {
  socket.volatile.emit("update-entity", data);
}
