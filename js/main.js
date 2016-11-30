addEventListener('DOMContentLoaded', function () {
	'use strict';

	var Fuchsia = Cordial();

	var w = window,
		d = document;

	var span = d.createElement('span');

	var toElement = function (str) {
		var el;

		span.innerHTML = str;

		el = span.getElementsByTagName('*')[0];

		return el;
	};

	var makeConversation = function (speaker, content, type) {
		type = type || 'p';

		return toElement('<' + type + ' class="conversation-piece ' + speaker + '">' + content + '</' + type + '>');
	};

	// https://mathiasbynens.be/notes/xhr-responsetype-json
	var getJSON = function (url, successHandler, errorHandler) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function () {
			var status = xhr.status;
			if (status === 200) {
				if (successHandler) {
					successHandler(xhr.response);
				}
			} else {
				if (errorHandler) {
					errorHandler(status);
				}
			}
		};
		xhr.send();
	};

	var fadeOut = function (el, delay, callback, cbdelay) {
		setTimeout(function () {
			el.style['opacity'] = 0;
			setTimeout(callback || function () {}, cbdelay || 0);
		}, delay || 0);

		return fadeOut;
	};

	Fuchsia.utilities.makeConversation = makeConversation;
	Fuchsia.utilities.toElement = toElement;
	Fuchsia.utilities.getJSON = getJSON;
	Fuchsia.utilities.capitalize = function (str) {
		return str.replace(/\b\w/g, function (sel) {
			return sel.charAt(0).toUpperCase();
		});
	};
	Fuchsia.utilities.fadeOut = fadeOut;

	var memory = Fuchsia.memory = Cookies.get('memory') || {};

	Fuchsia.elements = {
		$input: d.getElementsByTagName('input')[0],
		$conversation: d.getElementsByClassName('conversation')[0]
	};

	var openPage = function (url, delay, callback, cbdelay) {
		if (!memory.blank) {
			return;
		}

		setTimeout(function () {
			w.open(url, '_blank');
		}, delay);
	};

	Fuchsia.modules.core.install([
		{
			text: /clear( conversation|log(s)?)?/,
			response: function () {
				var $conversation = Fuchsia.elements.$conversation;
				fadeOut($conversation, 1500, function () {
					$conversation.innerHTML = '';
					$conversation.style['opacity'] = 1;
				}, 300);

				return 'Clearing conversation &hellip;';
			},
			type: 'equalTo'
		},

		{
			text: /^hi|hello|hey|greetings ?/,
			response: function () {
				return [
					'Hi',
					'Hello',
					'Hey',
					'Greetings'
				];
			},
			type: 'equalTo',
			post: '.!'
		},

		{
			text: [
				'how are you',
				'how are you doing',
				'how do you do'
			],
			response: [
				'I\'m fine.',
				'I\'m okay, thanks for asking.',
				'I\'m great; thanks for asking!',
				'I could be doing better.'
			],
			type: 'equalTo'
		},

		{
			text: [
				'who are you',
				'who made you',
				'who created you',
				'what are you',
				'what do you do',

				'what is your name',
				'what can i call you',
				'what should i cal you',
				'what do i call you',
				'what do you call yourself',
				'how do you call yourself'
			],
			response: toElement(
				'<div class="conversation-piece fuchsia intro">' +
				'<p>I\'m Fuchsia: an open-source virtual personal assistant for the web by <a href="https://github.com/Loquacious" target="_blank">Ryan Nguyen</a>.<p>' +
				'<p>You can view my source <a href="https://github.com/Loquacious/fuchsia" target="_blank">here</a>. Talk to me!</p>' +
				'</div>'
			),
			type: 'equalTo'
		},

		{
			text: [
				'what is the time',
				'what time is it',
				'give me the time',
				'tell me the time'
			],
			response: function () {
				return 'The time is <b>' + moment().format('h:mm a').toUpperCase() + '</b>.';
			},
			type: 'equalTo'
		},

		{
			text: [
				'what is the date',
				'what date is it',
				'give me the date',
				'tell me the date',

				'what is the day',
				'what day is it',
				'give me the day',
				'tell me the day'
			],
			response: function () {
				return 'The date is <b>' + moment().format('dddd MMMM Do YYYY') + '</b>.';
			},
			type: 'equalTo'
		},

		{
			text: 'when am i',
			response: function () {
				return 'It is currently <b>' + moment().format('dddd MMMM Do YYYY') + ', ' + moment().format('h:mm a').toUpperCase() + '</b>.';
			},
			type: 'equalTo'
		},

		{
			text: 'sorry',
			response: [
				'It\'s fine.',
				'You\'ve been forgiven.',
				'&hellip;',
				'What did you even do?'],
			type: 'startsWith'
		},

		{
			text: [
				'you ',
				'your'
			],
			response: [
				'Thank you',
				'That\'s what I thought',
				'We should be talking more about you'
			],
			type: 'startsWith',
			post: '.!'
		},

		{
			text: 'the cake',
			response: '&hellip; is a lie',
			type: 'equalTo',
			post: '.!'
		},

		{
			text: [
				'call me ',
				'my name is '
			],
			response: function (parsed) {
				parsed = Fuchsia.utilities.capitalize(parsed.replace(/(call me)|(my name is) /, ''));

				Fuchsia.memory.name = parsed;

				return 'Got it. From now on, your name is ' + parsed;
			},
			type: 'startsWith',
			post: '.!'
		}
	]);

	Fuchsia.createModule('random').install([
		{
			text: 'flip a coin',
			response: [
				'Heads',
				'Tails'
			],
			type: 'equalTo',
			post: '.!'
		},

		{
			text: /^(roll a d-?)/,
			response: function (parsed) {
				var sides = parseInt(parsed.replace(/^(roll a d-?)/, ''));

				if (isNaN(sides)) {
					sides = 6;
				}

				return (Math.floor(Math.random() * sides) + 1).toString(10);
			}
		},

		{
			text: [
				'give me a password',
				'give me a random password',
				'give me a string',
				'give me a random string',

				'generate a password',
				'generate a random password',
				'generate a string',
				'generate a random string'
			],
			response: function () {
				var pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
					output = '',
					length,
					i;

				// Making sure it meets the requirements of one uppercase, one lowercase, and on number
				while (!(output.match(/[A-Z]/) && output.match(/[a-z]/) && output.match(/[0-9]/))) {
					output = '';
					length = Math.floor(Math.random() * 9) + 8;

					for (i = 0; i < length; i++) {
						output += pool[Math.floor(Math.random() * pool.length)];
					}
				}

				return makeConversation(
				'fuchsia',
					'<code>' + output + '</code>',
				'div'
				);
			},
			type: 'equalTo'
		}
	]);

	Fuchsia.createModule('web').install([
		{
			text: [
				'go to ',
				'open '
			],
			response: function (parsed) {
				parsed = parsed.replace(/^(go to|open) | /, '');

				// Really long RegExp from https://gist.github.com/gruber/8891611
				if (!parsed.match(/\.(com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/)) {
					parsed += '.com';
				}

				openPage('https://' + parsed , 1000);

				return 'Click <a href="https://' + parsed + '" target="_blank">here</a> if your page did not automatically open.';
			},
			type: 'startsWith'
		},

		{
			text: 'should i watch ',
			response: function (parsed) {
				parsed = parsed.replace(/^should i watch /, '');

				// Creation of element to be filled in later
				var information = makeConversation(
					'fuchsia',
						'Retrieving data&hellip;',
					'div'
					),
					reviews = '',
					total = 0,
					count = 0;

				getJSON('https://www.omdbapi.com/?tomatoes=true&plot=short&r=json&t=' + encodeURIComponent(parsed), function (data) {
					if (data.Error) {
						information.innerHTML = 'I could not find what you were looking for.';
					} else {
						if (data.imdbRating !== 'N/A') {
							reviews += '<p class="film rating"><b>IMDb: </b>' + data.imdbRating + '/10</p>';
							total += parseFloat(data.imdbRating) / 10;
							count++;
						}
						if (data.tomatoRating !== 'N/A') {
							reviews += '<p class="film rating"><b>Rotten Tomatoes: </b>' + data.tomatoRating + '/10</p>';
							total += parseFloat(data.tomatoRating) / 10;
							count++;
						}
						if (data.Metascore !== 'N/A') {
							reviews += '<p class="film rating"><b>Metacritic: </b>' + data.Metascore + '/100</p>';
							total += parseFloat(data.Metascore) / 100;
							count++;
						}

						if (count > 1) {
							reviews += '<p class="film rating average"><b>Average: </b>' + Math.round(total / count * 10000) / 100 + '%</p>';
						}

						information.innerHTML =
							'<h1 class="film title">' + data.Title + '</h1>' +
							'<p class="film year">' + data.Year + ' ' + ((data.Type === 'series') ? 'TV Series' : 'Film') + '</p>' +
							'<p class="film plot">' + data.Plot + '</p>' + reviews;
					}
				});

				return information;
			},
			type: 'startsWith'
		},

		{
			text: 'should i listen to ',
			response: function (parsed) {
				parsed = parsed.replace(/^should i listen to /, '');

				var information = makeConversation(
					'fuchsia',
						'Retrieving data&hellip;',
					'div'
					),
					genres = '';

				getJSON('https://api.spotify.com/v1/search?type=artist&limit=1&q=' + encodeURIComponent(parsed), function (data) {
					if (data.artists.total) {
						if (data.artists.items[0].genres) {
							genres += '<p class="artist genres"><b>Genres:</b> ' +
								Fuchsia.utilities.capitalize(data.artists.items[0].genres.join(', '))
								'</p>';
						}
						information.innerHTML =
							'<h1 class="artist title">' + data.artists.items[0].name + '</h1>' + genres +
							'<p class="artist popularity"><b>Popularity on Spotify:</b> ' + data.artists.items[0].popularity + '</p>' +
							'<p class="artist follows"><b>Followers on Spotify:</b> ' + data.artists.items[0].followers.total + '</p>' +
							'<div class="sources">' +
								'<a href="https://www.spotify.com" target="_blank" class="fa fa-spotify" aria-hidden="true"></a>' +
							'</div>';
					} else {
						information.innerHTML = 'I could not find what you were looking for.';
					}
				});

				return information;
			}
		},

		/*
		{
			text: 'define ',
			response: function (parsed) {
				parsed = parsed.replace(/^define /, '');

				var information = makeConversation(
				'fuchsia',
					'Retrieving data&hellip;',
				'div'
				);

				getJSON('https://api.pearson.com/v2/dictionaries/entries?headword=' + encodeURIComponent(parsed), function (data) {
					if (data.results.length && data.results[0].senses.length && data.results[0].senses[0].definition) {
						information.innerHTML =
							'<h1 class="word title">' + data.results[0].headword + '</h1>' +
							'<p class="word definition">' + data.results[0].senses[0].definition + '</p>';
					} else {
						information.innerHTML = 'I could not find what you were looking for.';
					}
				});

				return information;
			}
		},

		{
			text: /^(what is|whats|how is|hows) the weather( like)?( today)?$/,
			response: function () {
				var information = makeConversation(
				'fuchsia',
					'Retrieving data&hellip;',
				'p'
				);

				getJSON('https://freegeoip.net/json/', function (data) {
					getJSON('https://api.openweathermap.org/data/2.5/weather?units=metric&appid=54c09e3b86f7c45f6629c50b2257c22f&lat=' + data.latitude + '&lon=' + data.longitude, function (nData) {
						information.innerHTML =
							'The weather in <b>' + data.city + '</b> appears to be <b>' + nData.weather[0].description + '</b>.';
					});
				});

				return information;
			}
		},

		{
			text: /^(((what is|whats) the temperature)|(how (hot|cold) is it))( today)?$/,
			response: function () {
				var information = makeConversation(
				'fuchsia',
					'Retrieving data&hellip;',
				'p'
				);

				getJSON('https://freegeoip.net/json/', function (data) {
					getJSON('https://api.openweathermap.org/data/2.5/weather?units=metric&appid=54c09e3b86f7c45f6629c50b2257c22f&lat=' + data.latitude + '&lon=' + data.longitude, function (nData) {
						information.innerHTML =
							'The temperature in <b>' + data.city + '</b> appears to be <b>' + Math.round(nData.main.temp) + '&deg;C</b>.';
					});
				});

				return information;
			},
			type: 'equalTo'
		},
		*/

		{
			text: [
				'whats up',
				'sup'
			],
			response: function () {
				return Fuchsia('should i watch up');
			},
			type: 'equalTo'
		},

		{
			text: [
				'what is ',
				'whats',
				'what are ',
				'whatre'
			],
			response: function (parsed) {
				parsed = parsed.replace(/^(what( i)?s( a(n)?| the)?)|(what( a)?re( the)) /, '');
				var url = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(parsed);

				openPage(url, 1000);

				return makeConversation(
				'fuchsia',
					'<p>Click <a href="' + url + '" target="_blank">here</a> to open the Wikipedia article.</p>' +
					'<div class="sources">' +
						'<a href="https://www.wikipedia.org" target="_blank" class="fa fa-wikipedia-w" aria-hidden="true"></a>' +
					'</div>',
				'div'
				);
			},
			type: 'startsWith'
		}
	]);

	Fuchsia.fallback = function (parsed) {
		var url = 'https://www.google.ca/?q=' + encodeURIComponent(parsed);

		openPage(url, 1000);

		return makeConversation(
		'fuchsia',
			'<p>I\'m not sure what you meant. Click <a href="' + url + '" target="_blank">here</a> to perform a Google search.</p>' +
			'<div class="sources">' +
				'<a href="https://www.google.com" target="_blank" class="fa fa-google" aria-hidden="true"></a>' +
			'</div>',
		'div'
		);
	};

	// Leak Fuchsia into global scope
	w.Fuchsia = Fuchsia;
});
