import { io } from "socket.io-client";

let socket = undefined;

/**
 * Gets the socket address based on the config provided.
 * @returns The socket connection URL.
 */
function getSocketAddress() {
  return `${CONFIG.server.protocol}://${CONFIG.server.address}:${CONFIG.server.port}/${CONFIG.namespace}`;
}

/**
 * Initializes multiframe with the given config.
 * @param {typeof CONFIG} config
 */
export function initializeMultiFrame(config = CONFIG) {
  CONFIG = { ...CONFIG, ...config };
  socket = io(getSocketAddress());

  socket.on("entity-updated", (data) => {
    // If the action is performed by self.
    if (data.clientId === CONFIG.client.id) {
      return;
    }

    document
      .querySelector(`[mfId=${data.mfId}]`)[0]
      .dispatchEvent(new CustomEvent("multiUpdateReceived", data));
  });
}

/**
 * Sends the update event to the server socket,
 * @param {*} data Event data.
 */
export function sendProp(data) {
  socket.volatile.emit("update-entity", data);
}
