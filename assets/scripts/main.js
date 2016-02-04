
// List of external scripts:
// jquery.min.js
// js.cookie.js
// goodnight.js
// fastclick.js

$(function () {
	'use strict';
	// FastClick
	FastClick.attach(document.body);
	// Goodnight
	Goodnight.css('assets/stylesheets/dark.css');
	var
	// User's input
	y,
	// Newtab contains page to be opened
	newtab,
	// Endpoint contains search page before query
	endpoint,

	// Everything the user says will be
	// stored in an array so pressing the
	// up or down arrow will move to the
	// next bit of text.

	// This currently isn't being used.

	// inputs = [],

	// Page
	page = $('html, body'),
	// Memory
	memory = {
		// Stores full name
		name: [],
		// Module settings
		modules: {
			'random': false,
			'entertainment': false
		}
	};
	// Evaluation of memory cookie
	if (Cookies.get('memory') !== undefined) {
		memory = eval('(' + Cookies.get('memory') + ')');
	}
	// Adds text to conversation
	function say (t, s) {
		switch (s) {
			case 'you':
			case 'y':
				return '<div class="conversation you">' + t + '</div>';
				break;
			default:
				$('<div class="conversation fuchsia">' + t + '</div>').appendTo('#conversation-box').fadeIn('slow');
		}
	}
	// Sets memory cookie to memory variable
	function remember () {
		Cookies.set('memory', memory, {expires: 365});
	}
	// Runs all modules
	function app (y) {
		y = parse(y);
		if (settings(y)) {
			if (random(y)) {
				if (entertainment(y)) {
					core(y);
				}
			}
		}
		// Scrolling will stop if user manually scrolls
		page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function() {
			page.stop();
		});
		page.animate({
			scrollTop: $(document).height()
		}, 'slow', function() {
			page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
		});
	}
	// Parses string to be evaluated
	function parse (y) {
		y = y.toLowerCase();
		// Punctuation
		y = y.split('?').join('');
		y = y.split('!').join('');
		y = y.split(',').join(' ');
		y = y.split('"').join('');
		// Contractions
		y = y.split('what\'s').join('what is');
		y = y.split('you\'re').join('you are');
		y = y.split('i\'m').join('i am');
		// Ending periods
		while (y.slice(-1) === '.') {
			// Deletes end period and trims string
			y = y.slice(0, -1).replace(/^\s+|\s+$/gm,'');
		}
		// Replacement of .trim() using a regular expression
		y = y.replace(/^\s+|\s+$/gm,'');
		// Condenses multiple spaces into single spaces
		y = y.replace(/\s\s+/g, ' ');
		console.log('String has been interpreted as: "' + y + '".');
		return y;
	}
	// [Mandatory] Settings module
	function settings (y) {
		var onoff;
		function styleoff () {
			$('#green').remove();
		}
		if (y === 'toggle goodnight' || y === 'goodnight.toggle();' || y === 'goodnight.toggle()' || y === 'toggle dark' || y === 'toggle dark.css' || y === 'toggle dark theme' || y === 'toggle light' || y === 'toggle light theme') {
			say('Toggling Goodnight&mdash;brace yourself&hellip;');
			setTimeout(function () {
				styleoff();
				Goodnight.toggle();
			}, 2000);
		} else if (y.split('grassy').join('grass') === 'toggle grass' || y.split('grassy').join('grass') === 'toggle grass theme' || y === 'toggle green' || y === 'toggle green.css' || y === 'toggle green theme') {
			say('Toggling the "Grassy" theme&mdash;brace yourself&hellip;');
			setTimeout(function () {
				if ($('#green').length === 0) {
					$('head').append('<link rel="stylesheet" type="text/css" href="assets/stylesheets/green.css" id="green">');
				} else {
					$('#green').remove();
				}
			}, 2000);
		} else if (y.startsWith('toggle ')) {
			y = y.slice(7);
			if (memory.modules[y] !== undefined) {
				memory.modules[y] = memory.modules[y] ? false : true;
				onoff = memory.modules[y] ? 'on' : 'off';
				remember();
				say('The "' + y + '" module has been turned ' + onoff + '.');
			} else {
				say('That module doesn\'t exist!');
			}
		} else if (y === 'what modules are there' || y === 'what modules are available' || y === 'tell me the modules' || y === 'show me the modules' || y === 'give me the modules' || y === 'list the modules') {
			var keys = [];
			for (var key in memory.modules) {
				keys.push(key);
			}
			say('Available modules: ' + keys.join(', '));
		} else if (y === 'what modules are on' || y === 'what modules are off' || y === 'what are the module settings' || y === 'tell me the module settings' || y === 'show me the module settings' || y === 'give me the module settings' || y === 'list the module settings') {
			var output = '';
			for (var property in memory.modules) {
				output += property[0].toUpperCase() + property.slice(1) + ': ' + memory.modules[property] + '<br>';
			}
			say(output.split('true').join('On').split('false').join('Off'));
		} else {
			return true;
		}
	}
	// [Optional] Random module
	function random (y) {
		if (memory.modules.random) {
			if (y === 'flip a coin') {
				say(['Heads', 'Tails'][Math.floor(Math.random() * 2)] + '.');
			} else if (y === 'roll a die') {
				say(['One', 'Two', 'Three', 'Four', 'Five', 'Six'][Math.floor(Math.random() * 6)] + '.');
			} else if (y.startsWith('give me a random integer ') || y.startsWith('give me a random number ') || y.startsWith('generate a random integer ') || y.startsWith('generate a random number ')) {
				if (y.startsWith('give me a random integer between ') || y.startsWith('give me a random number between ') || y.startsWith('generate a random integer between ') || y.startsWith('generate a random number between ')) {
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
				} else if (y.startsWith('give me a random integer from ') || y.startsWith('give me a random number from ') || y.startsWith('generate a random integer from ') || y.startsWith('generate a random number from ')) {
					if (y.indexOf('give') !== -1) {
						if (y.indexOf('integer') !== -1) {
							y = y.slice(30);
						} else {
							y = y.slice(29);
						}
					} else {
						if (y.indexOf('integer') !== -1) {
							y = y.slice(31);
						} else {
							y = y.slice(30);
						}
					}
					y = y.split(' to ');
					y[0] = parseInt(y[0], 10);
					y[1] = parseInt(y[1], 10);
					if (!isNaN(y[0]) || !isNaN(y[1])) {
						say(Math.floor(Math.random() * (Math.max(y[0], y[1]) - Math.min(y[0], y[1]) + 1) + Math.min(y[0], y[1])));
					} else {
						say('Those aren\'t both integers!');
					}
				} else {
					say('Sorry; I\'m not entirely sure what you\'re saying. I\'ll perform');
				}
			} else if (y === 'give me a random string' || y === 'generate a random string') {
				y = y.startsWith('gi') ? y.slice(23) : y.slice(24);
				var temp = [];
				var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
				for (var i = 0;i < 32;i++) {
					temp.push(chars[Math.floor(Math.random() * 62)]);
				}
				say(temp.join(''));
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	// [Optional] Entertainment module
	function entertainment (y) {
		if (memory.modules.entertainment) {
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
	// [Mandatory] Core
	function core (y) {
		if (y === '') {
			say('Sorry, I couldn\'t <s>hear</s> read you. Could you try re-entering your command?');
		} else if (y === 'clear' || y === 'clear log' || y === 'clear logs') {
			say('Clearing log&hellip;');
			setTimeout(function () {
				$('#conversation-box').fadeOut('slow', function () {
					$('#conversation-box').empty().show();
				});
			}, 1000);
		} else if (y.startsWith('hi') || y.startsWith('hello') || y.startsWith('hey') || y.startsWith('greetings')) {
			say(['Hi', 'Hello', 'Hey', 'Greetings'][Math.floor(Math.random() * 4)] + ((memory.name[0] !== undefined && !!Math.floor(Math.random() * 2)) ? ', ' + memory.name[0] : '') + ['.', '!'][Math.floor(Math.random() * 2)]);
		} else if (y === 'what are you' || y === 'who are you' || y === 'what do you do') {
			say('I am Fuchsia. An intelligient virtual personal assistant for the web. I\'m based off of <a href="https://github.com/jaredcubilla/jarvis" target="_blank">Jared Cubilla\'s Jarvis</a>, but I\'m not voice-powered, which means that I can <del>say</del> write anything I want. You can find my documentation at <a href="https://github.com/Loquacious/fuchsia" target="_blank">https://github.com/Loquacious/fuchsia</a>.');
		} else if (y === 'how are you' || y === 'how do you do' || y === 'how are you doing') {
			say(['I\'m fine.', 'I\'m okay.', 'I\'m great; thanks for asking!', 'I could be doing better.'][Math.floor(Math.random() * 4)]);
		} else if (y === 'what is the time' || y === 'what time is it' || y === 'give me the time' || y === 'tell me the time' || y.split('day').join('date') === 'what is the date' || y.split('day').join('date') === 'what date is it' || y.split('day').join('date') === 'give me the date' || y.split('day').join('date') === 'tell me the date' || y.split('day').join('date') === 'what is the time and date' || y.split('day').join('date') === 'what is the date and time' || y.split('day').join('date') === 'what is the time and the date' || y.split('day').join('date') === 'what is the date and the time' || y.split('day').join('date') === 'what time and date is it' || y.split('day').join('date') === 'what date and time is it' || y.split('day').join('date') === 'give me the time and date' || y.split('day').join('date') === 'give me the date and time' || y.split('day').join('date') === 'give me the time and the date' || y.split('day').join('date') === 'give me the date and the time' || y.split('day').join('date') === 'when am i') {
			var now = new Date(), date, time, suffix, theme;
			y = (y === 'when am i') ? 'tid' : y;
			if (y.indexOf('ti') !== -1) {
				time = [now.getHours(), now.getMinutes(), now.getSeconds()];
				suffix = (time[0] < 12) ? ' AM' : ' PM';
				time[0] = (time[0] <= 12) ? time[0] : time[0] - 12;
				time[1] = (time[1] >= 10) ? time[1] : '0' + time[1];
				time[2] = (time[2] >= 10) ? time[2] : '0' + time[2];
				time = time.join(':');
				theme = (Math.random() < 0.25) ? '' : ' Try using the ' + ((now.getHours() <= 18 || now.getHours() >= 6) ? '"Light" or "Grassy"' : '"Dark"') + ' theme if you aren\'t already.';
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
				date[2] += (tempdate[0] === '1') ? 'th,' : chron[parseInt(tempdate[1], 10) - 1];
				date = date.join(' ');
			}
			if (y.indexOf('ti') !== -1 && y.indexOf('d') !== -1) {
				say('It is currently <b>' + date + ' ' + time + suffix + '</b>.' + theme);
			} else if (y.indexOf('ti') !== -1) {
				say('The time is <b>' + time + suffix + '</b>.' + theme);
			} else {
				say('The date is <b>' + date + '</b>.');
			}
		} else if (y.startsWith('go to ') || y.startsWith('open ')) {
			newtab = y.startsWith('go to') ? y.slice(6) : y.slice(5);
			newtab = newtab.split(' ').join('')
			newtab += (newtab.indexOf('.') === -1) ? '.com' : '';
			say('Opening ' + newtab + '&hellip;');
			setTimeout(function () {
				window.open('https://' + newtab, '_blank');
			}, 1000);
		} else if (y.startsWith('search ')){
			y = y.slice(6).split(' for ');
			y[1] = y.slice(1).join(' for ');
			y[1] = (y[1] === '') ? y[0].slice(1) : y[1];
			// More or less -stolen- borrowed from Jarvis
			switch (y[0].split(' ').join('')) {
				case 'bing':
					endpoint = 'https://www.bing.com/search?q=';
					break;
				case 'yahoo':
					endpoint = 'https://search.yahoo.com/search?p=';
					break;
				case 'duckduckgo':
					endpoint = 'https://duckduckgo.com/?q=';
					break;
				case 'wikipedia':
					endpoint = 'https://en.wikipedia.org/wiki/';
					break;
				case 'youtube':
					endpoint = 'https://www.youtube.com/results?search_query=';
					break;
				case 'vimeo':
					endpoint = 'https://vimeo.com/search?q=';
					break;
				case 'reddit':
					endpoint = 'https://www.reddit.com/search?q=';
					break;
				case 'github':
					endpoint = 'https://github.com/search?utf8=✓&q=';
					break;
				case 'stackoverflow':
					endpoint = 'http://stackoverflow.com/search?q=';
					break;
				default:
					endpoint = 'https://www.google.com/search?q=';
			}
			say('Searching for "' + y[1] + '"&hellip;');
			setTimeout(function () {
				window.open(endpoint + y[1].split(' ').join('%20'), '_blank');
			}, 1000);
		} else if (y.startsWith('tell me about ')) {
			y = y.slice(14);
			say('Search Wikipedia for "' + y + '"&hellip;');
			setTimeout(function () {
				window.open('https://en.wikipedia.org/wiki/' + y.split(' ').join('_'), '_blank');
			}, 1000);
		} else if (y.startsWith('sorry')) {
			say(['It\'s fine.', 'You\'ve been forgiven.', '&hellip;', 'What did you even do?'][Math.floor(Math.random() * 4)]);
		} else if (y === 'what can you do' || y === 'what can i do' || y === 'what are your features') {
			say(['If the random module is on, you can ask me to "flip a coin".', 'If the entertainment module is on, you can ask me "should I watch" followed by a space and a movie/TV show name.', 'Ask me to tell you a joke.', '"Toggle Goodnight"', 'Ask for the date or time.'][Math.floor(Math.random() * 5)]);
		} else if (y.startsWith('my name is ') || y.startsWith('call me ')) {
			y = y.startsWith('m') ? y.slice(11) : y.slice(8);
			y = y.toLowerCase().split(' ');
			for (var i = 0;i < y.length;i++) {
				y[i] = y[i].charAt(0).toUpperCase() + y[i].slice(1);
			}
			memory.name = y;
			remember();
			say('From now on, I shall call you "' + memory.name.join(' ') + '".');
		} else if (y === 'who am i' || y === 'what is my name' || y === 'what do you call me' || y === 'what are you calling me') {
			if (memory.name[0] !== undefined) {
				say(['Your name is', 'You\'re', 'I currently know you as'][Math.floor(Math.random() * 3)] + ' "' + memory.name.join(' ') + '".');
			} else {
				say('You haven\'t told me yet!');
			}
		} else if (y.startsWith('i')) {
			say([(memory.name[0] === 'Ryan') ? 'Why you always Ryan?' : ((memory.name[0] === 'Daman' || memory.name[0] === 'Damanjit') ? 'Why you always dumb, man (Daman)?' : 'Why you always lyin\'?'), 'Good for you.'][Math.floor(Math.random() * 2)]);
		} else if (y.startsWith('you')) {
			say(['Thank you', 'That\'s what I thought', 'We should be talking more about you'][Math.floor(Math.random() * 3)] + ((memory.name[0] !== undefined && !!Math.floor(Math.random() * 2)) ? ', ' + memory.name[0] : '') + ['.', '!'][Math.floor(Math.random() * 2)]);
		} else if (y.startsWith('never gonna give you up')) {
			say('Never gonna give you up<br>Never gonna let you down<br>Never gonna run around and desert you<br>Never gonna make you cry<br>Never gonna say goodbye<br>Never gonna tell a lie and hurt you');
		} else if (y === 'ayy') {
			say('&hellip;lmao');
		} else if (y === 'the cake' || y === 'cake') {
			say('&hellip;is a lie.');
		} else if (y === 'call me') {
			say('No.');
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
	// Entertainment image toggle
	$(document).on('click', '.toggle', function () {
		// $(this).parent().children() specifically targets the image in the same paragraph
		$(this).parent().children().toggle();
	});
	// Input for app
	$('input').keydown(function (e) {
		if (e.which === 13) {
			if ($(this).val().replace(/^\s+|\s+$/gm,'') !== '') {
				// Parsing of user input for display
				y = $(this).val();
				// Replacement of .trim() using a regular expression
				y = y.replace(/^\s+|\s+$/gm,'');
				// Condenses multiple spaces into single spaces
				y = y.replace(/\s\s+/g, ' ');
				y = y.charAt(0).toUpperCase() + y.slice(1);
				y = y.split('<').join('&lt;');
				y = y.split(' i ').join(' I ');
				$(this).val('').blur();
				$(say(y, 'you')).appendTo('#conversation-box').fadeIn('slow', function () {
					y = y.split('&lt;').join('<');
					app(y);
				});
			} else {
				$(this).val('');
			}
		}
	});
	// Fade-in at beginning of app's load
	setTimeout(function () {
		$('#container').fadeIn('slow');
	}, 1000);
});
