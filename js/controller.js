addEventListener('DOMContentLoaded', function (d) {
	d = document;

	var elements = Fuchsia.elements,
		$input = elements.$input,
		$conversation = elements.$conversation;

	$input.style['display'] = 'block';
	$input.addEventListener('keypress', function (e) {
		e = e || window.event;

		var value,
			response,
			self,
			fuchsia;

		if (e.which === 13 && this.value.replace(/\s+/g, '') !== '') {
			value = this.value;

			value = value.replace(/ i /gi, ' I ').replace(/( i)$/i, ' I');
			value = value.charAt(0).toUpperCase() + value.slice(1);

			if (value.match(/[a-z]$/i)) {
				value += '.';
			}

			value = Fuchsia.makeConversation('self', value, 'p');
			response = Fuchsia(this.value);

			if (typeof response === 'string') {
				response = Fuchsia.makeConversation('fuchsia', response, 'p');
			}

			$conversation.appendChild(value);
			$conversation.appendChild(response);

			setTimeout(function () {
				self = d.getElementsByClassName('self');
				for (var i = 0; i < self.length; i++) {
					self[i].style['opacity'] = 1;
				}
				d.body.scrollTop = value.offsetTop;
				setTimeout(function () {
					fuchsia = d.getElementsByClassName('fuchsia');
					for (var j = 0; j < fuchsia.length; j++) {
						fuchsia[j].style['opacity'] = 1;
					}
				}, 500);
			}, 300);

			this.value = '';
		}
	});
});
