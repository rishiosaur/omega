$(function () {
	var y, r, newtab;
	$('input').keydown(function (e) {
		if (e.which === 13 && $(this).val() !== "") {
			y = $(this).val().charAt(0).toUpperCase() + $(this).val().slice(1);
			$(this).val('').blur();
			$('<div class="conversation you">' + y + '</div>').appendTo('#conversation-box').hide().fadeIn('slow', function () {
				if ($('#conversation-box > .conversation').length > 2) {
					$('html, body').animate({ scrollTop: $(document).height() }, 'slow');
				}
				app(y);
			});
		}
	});
	function app (y) {
		y = y.toLowerCase();
		y = y.split('?').join('');
		if (y === 'clear log' || y === 'clear logs') {
			say('Clearing log...');
			setTimeout(function () {
				$('#conversation-box').fadeOut('slow', function () {
					$('#conversation-box').empty().show();
				});
			}, 1000);
		} else if (y === 'hi' || y === 'hello' || y === 'hey' || y === 'greetings') {
			say(['Hi', 'Hello', 'Hey', 'Greetings'][Math.floor(Math.random() * 4)]);
		} else if (y.startsWith('go to ')) {
			newtab = y.slice(6);
			if (newtab.indexOf('.') === -1) {
				say('Opening ' + newtab + '.com');
				setTimeout(function () {
					window.open('http://' + newtab + '.com', '_blank');
				}, 1000);
			} else {
				say('Opening ' + newtab);
				setTimeout(function () {
					window.open('http://' + newtab, '_blank');
				}, 1000);
			}
		}
	}
	function say (r) {
		$('<div class="conversation fuchsia">' + r + '</div>').appendTo('#conversation-box').hide().fadeIn('slow');
	}
});