$(function () {
	'use strict';
	FastClick.attach(document.body);
	Goodnight.css('stylesheets/dark.css');
	var y, newtab;
	setTimeout(function () {
		$('#container').fadeIn('slow');
	}, 1000);
	$('input').keydown(function (e) {
		if (e.which === 13 && $(this).val() !== "") {
			y = $(this).val().charAt(0).toUpperCase() + $(this).val().slice(1);
			$(this).val('').blur();
			$('<div class="conversation you">' + y + '</div>').appendTo('#conversation-box').fadeIn('slow', function () {
				$('html, body').animate({scrollTop: $(document).height()}, 'slow');
				app(y);
			});
		}
	});
	function app (y) {
		y = y.toLowerCase();
		y = y.split('?').join('');
		y = y.split('!').join('');
		y = y.split('what\'s').join('what is');
		y = y.split('you\'re').join('you are');
		if (y.slice(-1) === '.') {
			y = y.slice(0, y.length - 1);
		}
		if (y === 'clear' || y === 'clear log' || y === 'clear logs') {
			say('Clearing log&hellip;');
			setTimeout(function () {
				$('#conversation-box').fadeOut('slow', function () {
					$('#conversation-box').empty().show();
				});
			}, 1000);
		} else if (y === 'hi' || y === 'hello' || y === 'hey' || y === 'greetings') {
			say(['Hi', 'Hello', 'Hey', 'Greetings'][Math.floor(Math.random() * 4)] + ['.', '!'][Math.floor(Math.random() * 2)]);
		} else if (y === 'what are you' || y === 'who are you' || y === 'what do you do') {
			say('I am Fuchsia. An intelligient virtual personal assistant for the web. I\'m based off of <a href="https://github.com/jaredcubilla/jarvis" target="_blank">Jared Cubilla\'s Jarvis</a>, but I\'m, not voice-powered, which means that I can <del>say</del> write anything I want. You can find my documentation at <a href="https://github.com/355over113/fuchsia" target="_blank">https://github.com/355over113/fuchsia</a>.');
		} else if (y === 'how are you' || y === 'how do you do' || y === 'how are you doing') {
			say(['I\'m fine.', 'I\'m okay.', 'I\'m great; thanks for asking!', 'I could be doing better.'][Math.floor(Math.random() * 4)]);
		} else if (y.startsWith('go to ')) {
			newtab = y.slice(6);
			if (newtab.indexOf('.') === -1) {
				say('Opening ' + newtab + '.com&hellip;');
				setTimeout(function () {
					window.open('https://' + newtab + '.com', '_blank');
				}, 1000);
			} else {
				say('Opening ' + newtab + '&hellip;');
				setTimeout(function () {
					window.open('https://' + newtab, '_blank');
				}, 1000);
			}
		} else if (y.startsWith('you')) {
			say(['Thank you', 'That\'s what I thought', 'We should be talking more about you'][Math.floor(Math.random() * 3)] + ['.', '!'][Math.floor(Math.random() * 2)]);
		} else if (y.startsWith('search for ')){
			newtab = y.slice(11);
			say('Searching Google for "' + newtab + '"&hellip;');
			setTimeout(function () {
				window.open('https://www.google.ca/search?q=' + newtab.split(' ').join('+'), '_blank');
			}, 1000);
		} else if (y.startsWith('should i watch ')) {
			$.getJSON('https://www.omdbapi.com/?t=' + y.slice(15) + '&y=&plot=full&r=json&tomatoes=true', function (d) {
				if (d.Reponse !== 'False') {
					var reviews = '', sum = 0, count = 0;
					if (d.Type === 'movie') {
						d.Type = 'Film';
					} else if (d.Type === 'series') {
						d.Type = 'TV Series';
					}
					if (d.imdbRating !== 'N/A') {
						reviews += 'IMDb: ' + d.imdbRating + '/10<br>';
						sum += parseFloat(d.imdbRating) * 10;
						count++;
					}
					if (d.tomatoRating !== 'N/A') {
						reviews += 'Rotten Tomatoes: ' + d.tomatoRating + '/10<br>';
						sum += parseFloat(d.tomatoRating) * 10;
						count++;
					}
					if (d.Metascore !== 'N/A') {
						reviews += 'Metacritic: ' + d.Metascore + '/100<br>';
						sum += parseInt(d.Metascore);
						count++;
					}
					reviews += '<br>Average: ' + Math.round(sum / count) + '%';
					say('Here is what I could find:');
					$('<div class="box"><h1 class="title">' + d.Title + '</h1><p class="actors">Starring ' + d.Actors + '</p><p class="rated">' + d.Rated + '</p><p class="info">' + d.Year + ' ' + d.Type + '</p><p class="plot">' + d.Plot + '</p><p class="reviews">' + reviews + '</p></div>').appendTo('#conversation-box').fadeIn('slow');
				} else {
					say('I couldn\'t find that film.');
				}
			});
		} else if (y === 'what is the time' || y === 'what time is it' || y === 'give me the time' || y === 'what is the date' || y === 'what date is it' || y === 'give me the date' || y === 'what is the time and date' || y === 'what is the date and time' || y === 'what is the time and the date' || y === 'what is the date and the time' || y === 'what time and date is it' || y === 'what date and time is it' || y === 'give me the time and date' || y === 'give me the date and time' || y === 'give me the time and the date' || y === 'give me the date and the time' || y === 'when am i') {
			var now = new Date();
			var date, time, suffix;
			y = (y === 'when am i') ? 'time date' : y;
			if (y.indexOf('time') !== -1) {
				time = [now.getHours(), now.getMinutes(), now.getSeconds()];
				suffix = (time[0] < 12) ? ' AM' : ' PM';
				time[0] = (time[0] <= 12) ? time[0] : time[0] - 12;
				time[1] = (time[1] >= 10) ? time[1] : '0' + time[1];
				time[2] = (time[2] >= 10) ? time[2] : '0' + time[2];
				time = time.join(':');
			}
			if (y.indexOf('date') !== -1) {
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				date = [now.getDay(), now.getMonth(), now.getDate() + ',', now.getFullYear()];
				date[0] = days[date[0]];
				date[1] = months[date[1]];
				date = date.join(' ');
			}
			if (y.indexOf('time') !== -1 && y.indexOf('date') !== -1) {
				say('It is currently <b>' + date + ' ' + time + suffix + '</b>.');
			} else if (y.indexOf('time') !== -1) {
				say('The time is <b>' + time + suffix + '</b>.');
			} else {
				say('The date is <b>' + date + '</b>.');
			}
		} else if (y === 'toggle goodnight') {
			say('Toggling Goodnight&mdash;brace yourself&hellip;');
			setTimeout(function () {
				Goodnight.toggle();
			}, 3000);
		} else {
			say('I apologize, but I wasn\'t sure what you were asking of me. I\'ll perform a Google search instead.');
			setTimeout(function () {
				say('Searching Google for "' + y + '"&hellip;');
				setTimeout(function () {
					window.open('https://www.google.ca/search?q=' + y.split(' ').join('+'), '_blank');
				}, 2000);
			}, 2000);
		}
	}
	function say (r) {
		$('<div class="conversation fuchsia">' + r + '</div>').appendTo('#conversation-box').fadeIn('slow');
	}
});