addEventListener('DOMContentLoaded', function (d) {
	d = document;

	var input = d.getElementsByTagName('input')[0],
		conversation = d.getElementsByClassName('conversation')[0];

	input.addEventListener('keypress', function (e) {
		e = e || window.event;

		var response;

		if (e.which === 13 && this.value.replace(/\s+/g, '') !== '') {
			conversation.appendChild(toElement('<p class="conversation-piece self">' + (this.value.charAt(0).toUpperCase() + this.value.slice(1)) + '</p>'));

			response = Fuchsia(this.value);

			if (response === null) {
				response = 'Sorry, I\'m unsure of what you mean.';
			}

			conversation.appendChild(toElement('<p class="conversation-piece fuchsia">' + response + '</p>'));

			this.value = '';
		}
	});
});
