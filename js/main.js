addEventListener('DOMContentLoaded', function (w, d) {
	'use strict';

	w = window,
	d = document;

	// Start of Fuchsia initiation
	var Fuchsia = Cordial();

	Fuchsia.makeConversation = makeConversation;

	Fuchsia.utilities.toElement = toElement;
	Fuchsia.utilities.getJSON = getJSON;

	Fuchsia.elements = {
		$input: d.getElementsByTagName('input')[0],
		$conversation: d.getElementsByClassName('conversation')[0]
	};

	Fuchsia.modules['core'].install([
		{
			'text': [
				'clear',
				'clear conversation'
			],
			'response': function () {
				var $conversation = Fuchsia.elements.$conversation;
				setTimeout(function () {
					$conversation.style['opacity'] = 0;
					setTimeout(function () {
						$conversation.innerHTML = '';
						$conversation.style['opacity'] = 1;
					}, 300);
				}, 1500);

				return 'Clearing conversation &hellip;'
			},
			'type': 'equalTo'
		},

		{
			'text': [
				'hi',
				'hello',
				'hey',
				'greetings'
			],
			'response': [
				'Hi',
				'Hello',
				'Hey',
				'Greetings'
			],
			'type': 'equalTo',
			'post': '.!'
		},

		{
			'text': [
				'hi ',
				'hello ',
				'hey ',
				'greetings '
			],
			'response': function () {
				return Fuchsia('hi');
			},
			'type': 'startsWith'
		},

		{
			'text': [
				'how are you',
				'how are you doing',
				'how do you do'
			],
			'response': [
				'I\'m fine.',
				'I\'m okay, thanks for asking.',
				'I\'m great; thanks for asking!',
				'I could be doing better.'
			],
			'type': 'equalTo'
		},

		{
			'text': [
				'who are you',
				'who made you',
				'what are you',
				'what do you do',

				'what is your name',
				'what can i call you',
				'what do i call you',
				'what do you call yourself'
			],
			'response': 'I\'m Fuchsia: an open-source virtual personal assistant for the web made by <a href="https://github.com/Loquacious" target="_blank">Ryan Nguyen</a>.<br>You can view my source <a href="https://github.com/Loquacious/fuchsia" target="_blank">here</a>.',
			'type': 'equalTo'
		},

		{
			'text': [
				'what is the time',
				'what time is it',
				'give me the time',
				'tell me the time'
			],
			'response': function () {
				return 'The time is <b>' + moment().format('h:mm a').toUpperCase() + '</b>.';
			},
			'type': 'equalTo'
		},

		{
			'text': [
				'what is the date',
				'what date is it',
				'give me the date',
				'tell me the date',

				'what is the day',
				'what day is it',
				'give me the day',
				'tell me the day'
			],
			'response': function () {
				return 'The date is <b>' + moment().format('dddd MMMM Do YYYY') + '</b>.';
			},
			'type': 'equalTo'
		},

		{
			'text': 'when am i',
			'response': function () {
				return 'It is currently <b>' + moment().format('dddd MMMM Do YYYY') + ', ' + moment().format('h:mm a').toUpperCase() + '</b>.';
			},
			'type': 'equalTo'
		},

		{
			'text': [
				'go to ',
				'open '
			],
			'response': function (parsed) {
				parsed = parsed.replace(/^(go to|open) | /, '');

				// Really long RegExp from https://gist.github.com/gruber/8891611
				if (!parsed.match(/\.(com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/)) {
					parsed += '.com';
				}

				setTimeout(function () {
					w.open('https://' + parsed, '_blank');
				}, 1000);

				return 'Click <a href="https://' + parsed + '" target="_blank">here</a> if the page did not automatically open.';
			},
			'type': 'startsWith'
		},

		{
			'text': 'sorry',
			'response': [
				'It\'s fine.',
				'You\'ve been forgiven.',
				'&hellip;',
				'What did you even do?'],
			'type': 'startsWith'
		},

		{
			'text': [
				'you ',
				'your',
				'you\''
			],
			'response': [
				'Thank you',
				'That\'s what I thought',
				'We should be talking more about you'
			],
			'type': 'startsWith',
			'post': '.!'
		},

		{
			'text': 'the cake',
			'response': '&hellip; is a lie',
			'type': 'equalTo',
			'post': '.!'
		}
	]);

	Fuchsia.createModule('random').install([
		{
			'text': 'flip a coin',
			'response': [
				'Heads',
				'Tails'
			],
			'type': 'equalTo',
			'post': '.!'
		},

		{
			'text': 'roll a die',
			'response': function () {
				return (Math.floor(Math.random() * 6) + 1).toString(10);
			},
			'type': 'equalTo'
		},

		{
			'text': [
				'give me a password',
				'give me a random password',
				'give me a string',
				'give me a random string',

				'generate a password',
				'generate a random password',
				'generate a string',
				'generate a random string'
			],
			'response': function () {
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

				return makeConversation('fuchsia', '<code>' + output + '</code>', 'div');
			},
			'type': 'equalTo'
		}
	]);

	Fuchsia.createModule('ajax').install([
		{
			'text': 'should i watch ',
			'response': function (parsed) {
				parsed = parsed.replace(/^(should i watch )/, '');

				// Creation of element to be filled in later
				var information = makeConversation('fuchsia', 'Retrieving information&hellip;', 'div');

				getJSON('http://www.omdbapi.com/?t=' + encodeURIComponent(parsed) + '&y=&plot=full&r=json', function (data) {
					information.innerHTML =
						'<h1 class="film title">' + data.Title + '</h1>' +
						'<p class="film year">' + data.Year + ' ' + ((data.Type === 'series') ? 'TV Series' : 'Film') + '</p>' +
						'<p class="film plot">' + data.Plot + '</p>';
				}, function (status) {
					information.innerHTML = 'Something went wrong.';
				})

				return information;
			},
			'type': 'startsWith'
		}
	]);

	Fuchsia.fallback = function (parsed) {
		var url = 'https://www.google.ca/?q=' + encodeURIComponent(parsed);

		return makeConversation('fuchsia', '<a href="' + url + '" target="_blank">' + url + '</a>', 'div');
	};

	// Functions needed for use earlier
	var span = d.createElement('span');

	function toElement(str) {
		var el,
			body = d.body;

		span.innerHTML = str;

		el = span.getElementsByTagName('*')[0];

		return el;
	};

	function makeConversation(speaker, content, type) {
		type = type || 'p';
		return toElement('<' + type + ' class="conversation-piece ' + speaker + '">' + content + '</' + type + '>');
	};

	// https://mathiasbynens.be/notes/xhr-responsetype-json
	function getJSON(url, successHandler, errorHandler) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function () {
			var status = xhr.status;
			if (status == 200) {
				successHandler && successHandler(xhr.response);
			} else {
				errorHandler && errorHandler(status);
			}
		};
		xhr.send();
	};

	// Leak Fuchsia into global scope
	w.Fuchsia = Fuchsia;
});
