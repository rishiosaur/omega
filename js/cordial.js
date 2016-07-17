;(function (w) {
	'use strict';

	var packages = {};

	function noConflict(name, triggers) {
		if (name.indexOf('$') > -1) {
			throw new RangeError('(Cordial) Module names cannot contain a "$".');
		}

		var suffix = 0,
			rootName = name;

		while (packages[name]) {
			name = rootName + '$' + suffix.toString(16);
			suffix++;
		}

		packages[name] = triggers;

		return packages[name];
	}

	// http://stackoverflow.com/a/384380
	function isElement(obj) {
		return (
			typeof HTMLElement === 'object' ? obj instanceof HTMLElement :
			obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
		);
	}

	function Module() {
		this.triggers = [];
		this.enabled = true;
	}

	Module.prototype.install = function (triggers) {
		if (typeof triggers === 'string') {
			triggers = packages[triggers];
		}

		if (!Array.isArray(triggers)) {
			throw new TypeError('(Cordial) The triggers variable must be an array.');
		}

		if (this.triggers === []) {
			this.triggers = triggers;
		} else {
			for (var i = 0; i < triggers.length; i++) {
				this.triggers.push(triggers[i]);
			}
		}

		return this;
	};

	Module.prototype.toggle = function () {
		this.enabled = !this.enabled;

		return this;
	};

	w.Cordial = function () {
		function Cordial(raw) {
			if (!raw) {
				return null;
			}

			var parsed = Cordial.parse(raw),
				key,
				mod,
				i,
				j,
				match,
				response;

			for (key in Cordial.modules) {
				if (Cordial.modules.hasOwnProperty(key)) {
					mod = Cordial.modules[key];
					if (mod.enabled) {
						for (i = 0; i < mod.triggers.length; i++) {
							// Post-processing of modules
							mod.triggers[i].text =
								(typeof mod.triggers[i].text === 'string') ?
								[mod.triggers[i].text] :
								mod.triggers[i].text;

							mod.triggers[i].type =
								mod.triggers[i].type || 'startsWith';

							mod.triggers[i].post =
								(typeof mod.triggers[i].post !== 'string') ?
								'' :
								mod.triggers[i].post;

							for (j = 0; j < mod.triggers[i].text.length; j++) {
								if (mod.triggers[i].type === 'startsWith') {
									match = (parsed + ' ').startsWith(mod.triggers[i].text[j]);
								} else {
									match = parsed === mod.triggers[i].text[j];
								}

								if (match) {
									break;
								}
							}

							if (match) {
								break;
							}
						}

						if (match) {
							break;
						}
					}
				}
			}

			if (match) {
				response = mod.triggers[i].response;

				while (Array.isArray(response) || typeof response === 'function') {
					if (Array.isArray(response)) {
						response = response[Math.floor(Math.random() * response.length)];
					} else if (typeof response === 'function') {
						response = response();
					}
				}

				if (typeof response === 'string') {
					response += mod.triggers[i].post.charAt(Math.floor(Math.random() * mod.triggers[i].post.length));
				} else if (!isElement(response)) {
					throw new TypeError('(Cordial) Responses must always return a string or HTMLElement.');
				}

				return response;
			} else {
				return null;
			}
		}

		Cordial.modules = {
			core: new Module()
		};

		Cordial.createModule = function (name) {
			this.modules[name] = new Module();
			return this.modules[name];
		};

		Cordial.parse = function (raw) {
			return raw
				.toLowerCase()
				.replace(/(\?|!|,|"|')+/g, '')
				.replace(/^\s+|(\.|\s)+$/g, '')
				.replace(/\s+/g, ' ');
		};

		Cordial.install = function (triggers) {
			this.modules.core.install(triggers);
		};

		return Cordial;
	};

	w.Cordial.packages = packages;
	w.Cordial.noConflict = noConflict;
	w.Cordial.isElement = isElement;
})(window);
