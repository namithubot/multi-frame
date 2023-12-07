/* global AFRAME */
import { io } from "socket.io-client";

if (typeof AFRAME === "undefined") {
  throw new Error(
    "Component attempted to register before AFRAME was available."
  );
}

if (typeof io === "undefined") {
  throw new Error(
    'We depend on socketjs client. Consider using that.'
  );
}

let socket = undefined;

let CONFIG = {
  server: {
    address: "0.0.0.0",
    port: 3000
  },
  client: {
    id: crypto.randomUUID()
  },
  namespace: 'multi-frame',
};

/**
 * Initializes multiframe with the given config.
 * @param {typeof CONFIG} config 
 */
export function initializeMultiFrame(config) {
  CONFIG = { ...CONFIG, ...config };
  socket = io(getSocketAddress());

  socket.on('entity-updated', (data) => {
    // If the action is performed by self.
    if (data.clientId === CONFIG.client.id) {
      return;
    }

    document.querySelector(`[mfId=${data.mfId}]`)?.[0]?.dispatchEvent(
      new CustomEvent('multiUpdateReceived', data)
    );
  });
}

/**
 * Gets the socket address based on the config provided.
 * @returns The socket connection URL.
 */
function getSocketAddress () {
  return `wss://${CONFIG.server.address}:${CONFIG.server.port}/${CONFIG.namespace}`;
}

/**
 * Sends the update event to the server socket,
 * @param {*} data Event data.
 */
function sendProp(data) {
  socket.volatile.emit('update-entity', data);
}

/**
 * Multi Frame component for A-Frame.
 */
AFRAME.registerComponent("multi-frame", {
  schema: {
    mfId: { type: "string", default: "" },
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    if (!this.data.mfId) {
      console.info(`No mfId provided to the multi frame network object. It is avisable to add one.
			For now attaching a random number to it.`);
      const mfId = crypto.randomUUID();
      this.el.setAttribute("mfId", mfId);
      this.data.mfId = mfId;
    }

    console.log(`Adding multi-frame-network-obj with mfId ${this.data.mfId}`);
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {},

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {},

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () {},

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () {},

  /**
   * Event handlers that automatically get attached or detached based on scene state.
   */
  events: {
    /**
     * Fired whenever a component change is done.
     * eg. move or rotate.
     * @param {any} evt Event data
     */
    componentchanged: function (evt) {
      const changedProp = evt.detail.name;

      // Repeated change or no change.
      // TODO: It would still make one round to the server for each connected client.
      // Find a better way to do this.
      if (evt.target.components[propName].attrValue === evt.srcElement.components[propName].attrValue) {
        return;
      }

      const changedDetail = {
        clientId: CONFIG.client.id,
        propName: changedProp,
        mfId: evt.srcElement.components["multi-frame"].data.mfId,
        attrName: evt.target.components[propName].attrName,
        attrValue: evt.target.components[propName].attrValue,
        timeStamp: new Date().getTime()
      };

      // Let's send it to socket
      sendProp(changedDetail);
    },

    /**
     * Fired when a change is received from the server on the component.
     * @param {*} evt Change event data.
     */
    multiUpdateReceived: function (evt) {
      this.el.setAttribute(evt.attrName, evt.attrValue);
    }
  },
});
