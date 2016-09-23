(function (w, d) {
	'use strict';

	// Functions needed for use later
	var span = d.createElement('span');

	var toElement = function (str) {
		var el,
			body = d.body;

		span.display = 'none';

		span.innerHTML = str + span.innerHTML;

		el = span.getElementsByTagName('*')[0];
		el.remove();

		return el;
	}

	// Start of Fuchsia initiation
	var Fuchsia = Cordial();

	// I would separate into modules but I really
	// think they would work better in core.

	Fuchsia.install([
		{
			'text': [
				'hi ',
				'hello ',
				'hey ',
				'greetings '
			],
			'response': [
				'Hi',
				'Hello',
				'Hey',
				'Greetings'
			],
			'type': 'startsWith',
			'post': '.!'
		},

		{
			'text': [
				'how are you ',
				'how are you doing ',
				'how do you do '
			],
			'response': [
				'I\'m fine.',
				'I\'m okay, thanks for asking.',
				'I\'m great; thanks for asking!',
				'I could be doing better.'
			],
			'type': 'startsWith'
		},

		{
			'text': [
				'what are you',
				'who are you',
				'what do you do'
			],
			'response': 'I am Fuchsia: an intelligent virtual personal assistant for the web. I\'m based off of Jared Cubilla\'s Jarvis.',
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
				return 'The time is ' + moment().format('h:mm a').toUpperCase() + '.';
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
				return 'The date is ' + moment().format('dddd MMMM Do YYYY') + '.';
			},
			'type': 'equalTo'
		},

		{
			'text': 'when am i',
			'response': function () {
				return 'It is currently ' + moment().format('dddd MMMM Do YYYY') + ', ' + moment().format('h:mm a').toUpperCase() + '.';
			},
			'type': 'equalTo'
		},

		{
			'text': [
				'go to ',
				'open '
			],
			'response': function (parsed) {
				parsed = parsed.replace(/^(go to|open)\s|\s/g, '');

				// Really long RegExp from https://gist.github.com/gruber/8891611
				if (!parsed.match(/\.(com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/)) {
					parsed += '.com';
				}

				return parsed;
			},
			'type': 'startsWith'
		},

		{
			'text': 'flip a coin',
			'response': [
				'Heads',
				'Tails'
			],
			'type': 'equalTo',
			'post': '.!'
		}
	]);

	w.Fuchsia = Fuchsia;
	w.toElement = toElement;
})(window, document);
