$(function () {
	var y, r;
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
		}
	}
	function say (r) {
		$('<div class="conversation fuchsia">' + r + '</div>').appendTo('#conversation-box').hide().fadeIn('slow');
	}
});