if (typeof AFRAME === "undefined") {
	throw(new Error('You do not have A-Frame script. Please load it before using multi-frame.'));
}

function generateMfId() {
	// Setting it to epoch current time.
	return new Date().getTime();
}

AFRAME.registerComponent('multi-frame-network-obj', {
	schema: {
		mfId: { type: 'string', default: '' }
	},

	init: function () {
		if (!this.data.mfId) {
			console.info(`No mfId provided to the multi frame network object. It is avisable to add one.
			For now attaching a random number to it.`);
			this.data.mfId = generateMfId();
		}
		console.log('Adding multi-frame-network-obj');
	},

	update: function (oldData) {
		console.log(oldData);
		console.log(this.data);
	}


        // ...
});
