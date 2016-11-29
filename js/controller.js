addEventListener('DOMContentLoaded', function (d) {
	'use strict';

	d = document;

	var elements = Fuchsia.elements,
		$input = elements.$input,
		$conversation = elements.$conversation,
		$startup = Fuchsia.utilities.toElement('<div class="conversation-piece fuchsia intro true-intro" style="opacity: 1;">' +
			'<p>I\'m Fuchsia: an open-source virtual personal assistant for the web by <a href="https://github.com/Loquacious" target="_blank">Ryan Nguyen</a>.<p>' +
			'<p>You can view my source <a href="https://github.com/Loquacious/fuchsia" target="_blank">here</a>. Talk to me!</p>' +
		'</div>');

	$conversation.appendChild($startup);

	$input.style['display'] = 'block';
	$input.addEventListener('focus', function onFocus() {
		$input.removeEventListener('focus', onFocus);
		Fuchsia.utilities.fadeOut($startup, 0, function () {
			$startup.remove();
		}, 300);
	});
	$input.addEventListener('keypress', function (e) {
		e = e || window.event;

		var value,
			response,
			self,
			fuchsia;

		if (e.which === 13 && this.value.replace(/\s+/g, '') !== '') {
			this.blur();

			value = this.value;

			value = value.replace(/ i /gi, ' I ').replace(/( i)$/i, ' I');
			value = value.charAt(0).toUpperCase() + value.slice(1);

			if (value.match(/[a-z]$/i)) {
				value += '.';
			}

			value = Fuchsia.utilities.makeConversation('self', value, 'p');
			response = Fuchsia(this.value);

			if (typeof response === 'string') {
				response = Fuchsia.utilities.makeConversation('fuchsia', response, 'p');
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
