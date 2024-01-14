/* global AFRAME */
import { sendProp, initializeMultiFrame } from "./sock";

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

let CONFIG = {
  server: {
    protocol: "http",
    address: "0.0.0.0",
    port: 3000
  },
  client: {
    id: crypto.randomUUID()
  },
  namespace: 'multi-frame',
};

/**
 * Multi Frame component for A-Frame.
 */
AFRAME.registerComponent("multi-frame", {
  schema: {
    mfId: { type: "string", default: "" },
    dirty: { type: "boolean", default: false }
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
      throw new Error(`No mfId provided to the multi frame network object. You must add one.
      This is the value that is used to synchronize the objects and must match with the same objects in the network.`);
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
      const propName = evt.detail.name;

      // Repeated change or no change.
      // TODO: It would still make one round to the server for each connected client.
      // Find a better way to do this.
      if (this.data.dirty
        // TODO: Maybe use lodash?
        || JSON.stringify(evt.srcElement.components[propName].previousOldData) === JSON.stringify(evt.srcElement.components[propName].attrValue)) {
        this.data.dirty = false;
        return;
      }

      const changedDetail = {
        clientId: CONFIG.client.id,
        propName,
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
      // Mark the element dirty to avoid a loop
      this.data.dirty = true;
      this.el.setAttribute(evt.attrName, evt.attrValue);
      this.data.dirty = false;
    }
  },
});
