$(function () {
	var y, r, newtab;
	$('input').keydown(function (e) {
		if (e.which === 13 && $(this).val() !== "") {
			y = $(this).val().charAt(0).toUpperCase() + $(this).val().slice(1);
			$(this).val('').blur();
			$('<div class="conversation you">' + y + '</div>').appendTo('#conversation-box').hide().fadeIn('slow', function () {
				app(y);
			});
		}
	});
	function app (y) {
		y = y.toLowerCase();
		y = y.split('?').join('');
		y = y.split('what\'s').join('what is');
		y = y.split('you\'re').join('you are');
		if (y === 'clear log' || y === 'clear logs') {
			say('Clearing log...');
			setTimeout(function () {
				$('#conversation-box').fadeOut('slow', function () {
					$('#conversation-box').empty().show();
				});
			}, 1000);
		} else if (y === 'hi' || y === 'hello' || y === 'hey' || y === 'greetings') {
			say(['Hi', 'Hello', 'Hey', 'Greetings'][Math.floor(Math.random() * 4)]);
		} else if (y === 'what are you' || y === 'who are you' || y === 'what do you do') {
			say('I am Fuchsia. A virtual personal assistant for the web. I\'m based off of <a href="https://github.com/jaredcubilla/jarvis" target="_blank"><i>Jared Cubilla\'s Jarvis</i></a>.');
		} else if (y === 'how are you' || y === 'how do you do' || y === 'how are you doing') {
			say(['I\'m fine.', 'I\'m okay.', 'I\'m great! Thanks for asking!', 'I could be doing better.'][Math.floor(Math.random() * 4)]);
		} else if (y.startsWith('go to ')) {
			newtab = y.slice(6);
			if (newtab.indexOf('.') === -1) {
				say('Opening ' + newtab + '.com');
				setTimeout(function () {
					window.open('https://' + newtab + '.com.', '_blank');
				}, 1000);
			} else {
				say('Opening ' + newtab);
				setTimeout(function () {
					window.open('https://' + newtab + '.', '_blank');
				}, 1000);
			}
		} else if (y.startsWith('you')) {
			say(['Okay.', 'That\'s what I thought.', 'We should be talking more about you.'][Math.floor(Math.random() * 3)]);
		} else if (y.startsWith('search for ')){
			newtab = y.slice(11);
			say('Searching Google for "' + newtab + '"...');
			setTimeout(function () {
				window.open('https://www.google.ca/search?q=' + newtab.split(' ').join('+'), '_blank');
			}, 1000);
		} else if (y.startsWith('should i watch ')) {
			$.getJSON('https://www.omdbapi.com/?t=' + y.slice(15) + '&y=&plot=full&r=json&tomatoes=true', function (d) {
				if (d.Reponse !== "False") {
					var reviews = "", sum = 0, count = 0;
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
					$('<div class="box"><h1 class="title">' + d.Title + '</h1><p class="actors">Starring ' + d.Actors + '</p><p class="rated">' + d.Rated + '</p><p class="info">' + d.Year + ' ' + d.Type + '</p><p class="plot">' + d.Plot + '</p><p class="reviews">' + reviews + '</p></div>').appendTo('#conversation-box').hide().fadeIn('slow');
				} else {
					say('I couldn\'t find that film.');
				}
			});
		} else {
			say('I apologize, but I wasn\'t sure what you were asking of me.');
			setTimeout(function () {
				say('Searching Google for "' + y + '"...');
				setTimeout(function () {
					window.open('https://www.google.ca/search?q=' + y.split(' ').join('+'), '_blank');
				}, 1000);
			}, 1000);
		}
		$('html, body').animate({ scrollTop: $(document).height() }, 'slow');
	}
	function say (r) {
		$('<div class="conversation fuchsia">' + r + '</div>').appendTo('#conversation-box').hide().fadeIn('slow');
	}
});