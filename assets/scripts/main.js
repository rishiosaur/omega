$(function () {
	'use strict';
	FastClick.attach(document.body);
	Goodnight.css('assets/stylesheets/dark.css');
	var y, newtab;
	var modules = {
		'random': false,
		'entertainment': false
	};
	if (Cookies.get('modules') !== undefined) {
		modules = eval('(' + Cookies.get('modules') + ')');
	}
	$(document).on('click', '.toggle', function () {
		$(this).parent().children().toggle();
	});
	$('input').keydown(function (e) {
		if (e.which === 13 && $(this).val() !== '') {
			y = $(this).val().replace(/^\s+|\s+$/gm,'');
			y = y[0].toUpperCase() + y.slice(1);
			y = y.split('<').join('&lt;');
			$(this).val('').blur();
			$('<div class="conversation you">' + y + '</div>').appendTo('#conversation-box').fadeIn('slow', function () {
				y = y.split('&lt;').join('<');
				app(y);
			});
		}
	});
	function app (y) {
		y = parse(y);
		if (settings(y)) {
			if (random(y)) {
				if (entertainment(y)) {
					core(y);
				}
			}
		}
		$('html, body').animate({scrollTop: $(document).height()}, 2000);
	}
	function parse (y) {
		y = y.toLowerCase();
		y = y.split('?').join('');
		y = y.split('!').join('');
		y = y.split('what\'s').join('what is');
		y = y.split('you\'re').join('you are');
		y = y.split('i\'m').join('i am');
		if (y.slice(-1) === '.') {
			y = y.slice(0, y.length - 1);
		}
		return y;
	}
	function settings (y) {
		var onoff;
		if (y === 'toggle goodnight' || y === 'goodnight.toggle();' || y === 'goodnight.toggle()') {
			say('Toggling Goodnight&mdash;brace yourself&hellip;');
			setTimeout(function () {
				Goodnight.toggle();
			}, 2000);
		} else if (y.startsWith('toggle ')) {
			y = y.slice(7);
			if (modules[y] !== undefined) {
				if (modules[y]) {
					modules[y] = false;
					onoff = 'off';
				} else {
					modules[y] = true;
					onoff = 'on';
				}
				Cookies.set('modules', modules);
				say('The "' + y + '" module has been turned ' + onoff + '.');
			} else {
				say('That module doesn\'t exist!');
			}
		} else if (y === 'what modules are there' || y === 'what modules are available' || y === 'tell me the modules' || y === 'show me the modules' || y === 'give me the modules' || y === 'list the modules') {
			var keys = [];
			for (var key in modules) {
				keys.push(key);
			}
			say('Available modules: ' + keys.join(', '));
		} else if (y === 'what modules are on' || y === 'what modules are off' || y === 'what are the module settings' || y === 'tell me the module settings' || y === 'show me the module settings' || y === 'give me the module settings' || y === 'list the module settings') {
			var output = '';
			for (var property in modules) {
				output += property[0].toUpperCase() + property.slice(1) + ': ' + modules[property] + '<br>';
			}
			say(output.split('true').join('On').split('false').join('Off'));
		} else {
			return true;
		}
	}
	function random (y) {
		if (modules.random) {
			if (y === 'flip a coin') {
				say(['Heads', 'Tails'][Math.floor(Math.random() * 2)] + '.');
			} else if (y === 'roll a die') {
				say(['One', 'Two', 'Three', 'Four', 'Five', 'Six'][Math.floor(Math.random() * 6)] + '.');
			} else if (y.startsWith('give me a random integer between ') || y.startsWith('give me a random number between ') || y.startsWith('generate a random integer between ') || y.startsWith('generate a random number between ')) {
				if (y.indexOf('give') !== -1) {
					if (y.indexOf('integer') !== -1) {
						y = y.slice(33);
					} else {
						y = y.slice(32);
					}
				} else {
					if (y.indexOf('integer') !== -1) {
						y = y.slice(34);
					} else {
						y = y.slice(33);
					}
				}
				y = y.split(' and ');
				y[0] = parseInt(y[0], 10);
				y[1] = parseInt(y[1], 10);
				if (!isNaN(y[0]) || !isNaN(y[1])) {
					say(Math.floor(Math.random() * (Math.max(y[0], y[1]) - Math.min(y[0], y[1]) + 1) + Math.min(y[0], y[1])));
				} else {
					say('Those aren\'t both integers!');
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	function entertainment (y) {
		if (modules.entertainment) {
			if (y.startsWith('should i watch ')) {
				y = y.slice(15);
				$.getJSON('https://www.omdbapi.com/?t=' + y + '&y=&plot=full&r=json&tomatoes=true', function (d) {
					if (d.Error === undefined) {
						var reviews = '', sum = 0, count = 0;
						if (d.Type === 'movie') {
							d.Type = 'Film';
						} else if (d.Type === 'series') {
							d.Type = 'TV Series';
						}
						if (d.imdbRating !== 'N/A') {
							reviews += 'IMDb: ' + d.imdbRating + '/10<br>';
							sum += parseFloat(d.imdbRating, 10) * 10;
							count++;
						}
						if (d.tomatoRating !== 'N/A') {
							reviews += 'Rotten Tomatoes: ' + d.tomatoRating + '/10<br>';
							sum += parseFloat(d.tomatoRating, 10) * 10;
							count++;
						}
						if (d.Metascore !== 'N/A') {
							reviews += 'Metacritic: ' + d.Metascore + '/100<br>';
							sum += parseInt(d.Metascore, 10);
							count++;
						}
						if (d.Rated !== 'N/A') {
							d.Rated = '<p class="rated">' + d.Rated + '</p>';
						} else {
							d.Rated = '';
						}
						reviews += '<br>Average: ' + Math.round(sum / count) + '%';
						say('Here is what I could find:');
						$('<div class="box"><h1 class="title">' + d.Title + '</h1><p class="actors">Starring ' + d.Actors + '</p>' + d.Rated + '<p class="info">' + d.Year + ' ' + d.Type + '</p><p class="plot">' + d.Plot + '</p><p class="reviews">' + reviews + '</p></div>').appendTo('#conversation-box').fadeIn('slow');
					} else {
						say('I apologize, but I couldn\'t find that film. I\'ll perform a Google search instead.');
						setTimeout(function () {
							say('Searching Google for "' + y + '"&hellip;');
							setTimeout(function () {
								window.open('https://www.google.ca/search?q=' + y.split(' ').join('+'), '_blank');
							}, 2000);
						}, 2000);
					}
				});
			} else if (y.startsWith('should i listen to ')) {
				$.getJSON('https://api.spotify.com/v1/search?q=' + y.slice(19).split(' ').join('+') + '&type=artist&limit=1', function (d) {
					var genres = '';
					var image;
					if (d.artists.total) {
						for (var i = 0;i < d.artists.items[0].genres.length;i++) {
							d.artists.items[0].genres[i] = d.artists.items[0].genres[i].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						}
						if (d.artists.items[0].genres[0] !== undefined) {
							genres = 'Genres: ';
						}
						if (d.artists.items[0].images[0].url !== undefined) {
							image = '<p><a class="toggle">[Show Image]</a><img src="' + d.artists.items[0].images[0].url + '" title="Click to hide" class="toggle"></p>';
						}
						say('Here is what I could find:');
						$('<div class="box"><h1 class="title">' + d.artists.items[0].name + '</h1><p class="musictype">Music Artist</p><p class="rated">' + genres + d.artists.items[0].genres.join(', ') + '</p>' + image + '<p class="reviews">Popularity on Spotify: ' + d.artists.items[0].popularity + '<br>Followers on Spotify: ' + d.artists.items[0].followers.total + '</p></div>').appendTo('#conversation-box').fadeIn('slow');
					} else {
						say('I couldn\'t find that artist. I\'ll perform a Google search for them instead.');
						setTimeout(function () {
							say('Searching Google for "' + y.slice(19) + '"&hellip;');
							setTimeout(function () {
								window.open('https://www.google.ca/search?q=' + y.slice(19).split(' ').join('+'), '_blank');
							}, 2000);
						}, 2000);
					}
				});
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	function core (y) {
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
			say('I am Fuchsia. An intelligient virtual personal assistant for the web. I\'m based off of <a href="https://github.com/jaredcubilla/jarvis" target="_blank">Jared Cubilla\'s Jarvis</a>, but I\'m not voice-powered, which means that I can <del>say</del> write anything I want. You can find my documentation at <a href="https://github.com/355over113/fuchsia" target="_blank">https://github.com/355over113/fuchsia</a>.');
		} else if (y === 'how are you' || y === 'how do you do' || y === 'how are you doing') {
			say(['I\'m fine.', 'I\'m okay.', 'I\'m great; thanks for asking!', 'I could be doing better.'][Math.floor(Math.random() * 4)]);
		} else if (y === 'what is the time' || y === 'what time is it' || y === 'give me the time' || y.split('day').join('date') === 'what is the date' || y.split('day').join('date') === 'what date is it' || y.split('day').join('date') === 'give me the date' || y.split('day').join('date') === 'what is the time and date' || y.split('day').join('date') === 'what is the date and time' || y.split('day').join('date') === 'what is the time and the date' || y.split('day').join('date') === 'what is the date and the time' || y.split('day').join('date') === 'what time and date is it' || y.split('day').join('date') === 'what date and time is it' || y.split('day').join('date') === 'give me the time and date' || y.split('day').join('date') === 'give me the date and time' || y.split('day').join('date') === 'give me the time and the date' || y.split('day').join('date') === 'give me the date and the time' || y.split('day').join('date') === 'when am i') {
			var now = new Date();
			var date, time, suffix;
			y = (y === 'when am i') ? 'tid' : y;
			if (y.indexOf('ti') !== -1) {
				time = [now.getHours(), now.getMinutes(), now.getSeconds()];
				suffix = (time[0] < 12) ? ' AM' : ' PM';
				time[0] = (time[0] <= 12) ? time[0] : time[0] - 12;
				time[1] = (time[1] >= 10) ? time[1] : '0' + time[1];
				time[2] = (time[2] >= 10) ? time[2] : '0' + time[2];
				time = time.join(':');
			}
			if (y.indexOf('d') !== -1) {
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				var chron = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
				var tempdate;
				date = [now.getDay(), now.getMonth(), now.getDate(), now.getFullYear()];
				date[0] = days[date[0]];
				date[1] = months[date[1]];
				tempdate = date[2];
				tempdate = (tempdate >= 10) ? tempdate.toString() : '0' + tempdate;
				console.log(tempdate);
				if (tempdate[0] === '1') {
					date[2] += 'th,';
					console.log(date[2]);
				} else {
					date[2] += chron[parseInt(tempdate[1], 10) - 1] + ',';
				}
				date = date.join(' ');
			}
			if (y.indexOf('ti') !== -1 && y.indexOf('d') !== -1) {
				say('It is currently <b>' + date + ' ' + time + suffix + '</b>.');
			} else if (y.indexOf('time') !== -1) {
				say('The time is <b>' + time + suffix + '</b>.');
			} else {
				say('The date is <b>' + date + '</b>.');
			}
		} else if (y.startsWith('go to ') || y.startsWith('open ')) {
			if (y.startsWith('go to')) {
				newtab = y.slice(6);
			} else {
				newtab = y.slice(5);
			}
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
		} else if (y.startsWith('search for ')){
			newtab = y.slice(11);
			say('Searching Google for "' + newtab + '"&hellip;');
			setTimeout(function () {
				window.open('https://www.google.ca/search?q=' + newtab.split(' ').join('+'), '_blank');
			}, 1000);
		} else if (y === 'what can you do' || y === 'what can i do' || y === 'what are your features') {
			say(['If the random module is on, you can ask me to "flip a coin".', 'If the entertainment module is on, you can ask me "should I watch" followed by a space and a movie/TV show name.', 'Ask me to tell you a joke.', '"Toggle Goodnight"', 'Ask for the date or time.'][Math.floor(Math.random() * 5)]);
		} else if (y === 'ayy') {
			say('lmao');
		} else if (y === 'tell me a joke' || y.indexOf('chuck norris') !== -1 || y === 'be funny' || y === 'make me laugh') {
			$.getJSON('https://api.icndb.com/jokes/random', function (d) {
				say(d.value.joke);
			});
		} else if (y.startsWith('i')) {
			say(['Why you always lyin\'?', 'That\'s nice.'][Math.floor(Math.random() * 2)]);
		} else if (y.startsWith('you')) {
			say(['Thank you', 'That\'s what I thought', 'We should be talking more about you'][Math.floor(Math.random() * 3)] + ['.', '!'][Math.floor(Math.random() * 2)]);
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
		$('<div class="conversation fuchsia">' + r.split('<').join('&lt;') + '</div>').appendTo('#conversation-box').fadeIn('slow');
	}
	setTimeout(function () {
		$('#container').fadeIn('slow');
	}, 1000);
});
