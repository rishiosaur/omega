function Module() {
	this.triggers = [];
	this.enabled = true;
}

Module.prototype.install = function (triggers) {
	var i;

	if (!Array.isArray(triggers)) {
		throw new TypeError('(Cordial) The triggers variable must be an array.');
	}

	if (this.triggers === []) {
		this.triggers = triggers;
	} else {
		for (i = 0; i < triggers.length; i++) {
			this.triggers.push(triggers[i]);
		}
	}

	// Run through each trigger within the module
	for (i = 0; i < this.triggers.length; i++) {
		this.triggers[i].text =
			(Array.isArray(this.triggers[i].text)) ?
				this.triggers[i].text :
				[this.triggers[i].text];

		this.triggers[i].type =
			this.triggers[i].type || 'startsWith';

		this.triggers[i].post =
			(typeof this.triggers[i].post !== 'string') ?
				'' :
				this.triggers[i].post;
	}

	return this;
};

Module.prototype.toggle = function () {
	this.enabled = !this.enabled;

	return this;
};

// const w = window


const Cordial = function () {
	function Cordial(raw) {
		if (!raw) {
			return null;
		}

		var parsed = Cordial.utilities.parse(raw),
			key,
			mod,
			i,
			j,
			match,
			response;

		// Run through each module
		for (key in Cordial.modules) {
			if (Cordial.modules.hasOwnProperty(key)) {
				mod = Cordial.modules[key];
				// Test if module is enabled before going through triggers
				if (mod.enabled) {
					// Run through each trigger within the module
					for (i = 0; i < mod.triggers.length; i++) {
						// Run through all values in the 'text' array
						for (j = 0; j < mod.triggers[i].text.length; j++) {
							if (typeof mod.triggers[i].text[j] === 'string') {
								if (mod.triggers[i].type === 'startsWith') {
									match = (parsed).startsWith(mod.triggers[i].text[j]);
								} else {
									match = parsed === mod.triggers[i].text[j];
								}
							} else {
								// In the case that the value is a regular expression
								match = !!parsed.match(mod.triggers[i].text[j]);
							}

							if (match) { break; }
						}

						if (match) { break; }
					}

					if (match) { break; }
				}
			}
		}

		if (match) {
			response = mod.triggers[i].response;

			while (Array.isArray(response) || typeof response === 'function') {
				if (Array.isArray(response)) {
					response = response[Math.floor(Math.random() * response.length)];
				} else if (typeof response === 'function') {
					response = response(parsed);
				}
			}

			if (typeof response === 'string') {
				response += mod.triggers[i].post.charAt(Math.floor(Math.random() * mod.triggers[i].post.length));
			} else if (!Cordial.utilities.isElement(response)) {
				throw new TypeError('(Cordial) Responses must always return a string or HTMLElement.');
			}

			return response;
		} else {
			return Cordial.fallback(parsed);
		}
	}

	Cordial.utilities = {
		parse: function (raw) {
			return raw
				.toLowerCase()
				.replace(/(\?|!|,|"|')+/g, '')
				.replace(/^\s+|(\.|\s)+$/g, '')
				.replace(/\s+/g, ' ');
		},
		// http://stackoverflow.com/a/384380
		isElement: function (obj) {
			return (
				typeof HTMLElement === 'object' ? obj instanceof HTMLElement :
					obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
			);
		}
	};

	Cordial.modules = {
		core: new Module()
	};

	Cordial.createModule = function (name) {
		this.modules[name] = new Module();
		return this.modules[name];
	};

	Cordial.install = function (triggers) {
		this.modules.core.install(triggers);
	};

	Cordial.fallback = function () {
		return null;
	};

	return Cordial;
};

