addEventListener('DOMContentLoaded', function() {
  'use strict';
  var Omega = Cordial();

  var w = window,
    d = document;
  var span = d.createElement('span');

  var themes = ['jade', 'royal_blue', 'blue', 'red', 'pink', 'yellow', 'green', 'dark', 'light']
  var toElement = function(str) {
    var el;

    span.innerHTML = str;

    el = span.getElementsByTagName('*')[0];

    return el;
  };
  var apidata, apidata2, apidata3;
  var makeConversation = function(speaker, content, type) {
    type = type || 'p';

    return toElement('<' + type + ' class="conversation-piece ' + speaker + '">' + content + '</' + type + '>');
  };

  // https://mathiasbynens.be/notes/xhr-responsetype-json
  var getJSON = function(url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
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

  var fadeOut = function(el, delay, callback, cbdelay) {
    setTimeout(function() {
      el.style['opacity'] = 0;
      setTimeout(callback || function() {}, cbdelay || 0);
    }, delay || 0);

    return fadeOut;
  };

  Omega.utilities.makeConversation = makeConversation;
  Omega.utilities.toElement = toElement;
  Omega.utilities.getJSON = getJSON;
  Omega.utilities.capitalize = function(str) {
    return str.replace(/\b\w/g, function(sel) {
      return sel.charAt(0).toUpperCase();
    });
  };
  Omega.utilities.fadeOut = fadeOut;

  var memory = Omega.memory = Cookies.get('memory') || {};

  Omega.elements = {
    $input: d.getElementsByTagName('input')[0],
    $conversation: d.getElementsByClassName('conversation')[0]
  };

  var openPage = function(url, delay, callback, cbdelay) {
    if (!memory.blank) {
      return;
    }

    setTimeout(function() {
      w.open(url, '_blank');
    }, delay);
  };

//Core Module install
  Omega.modules.core.install([
    {
      text: /clear( conversation|log(s)?)?/,
      response: function() {
        var $conversation = Omega.elements.$conversation;
        fadeOut($conversation, 1500, function() {
          $conversation.innerHTML = '';
          $conversation.style['opacity'] = 1;
        }, 300);

        return 'Clearing conversation &hellip;';
      },
      type: 'equalTo'
    },

    {
      text: /^hi|hello|hey|greetings ?/,
      response: function() {
        return [
          'Hi',
          'Hello',
          'Hey',
          'Greetings',
          'Bonjour! That\'s French for Hello',
          'Hola! That\'s Spanish for Hello'
        ];
      },
      type: 'equalTo',
      post: '.!'
    },
    {
      // Demonstration: JSON TRIO
      // text: Can be an array, or a simple string. This is the thing that the systtem matches the response for, when a certain string is inputted.
      text: [
        'what can you do',
        'what can i do',
        'what can i do with you'
      ],
      // response: Can be a string, array, or function. This is what is executed when the trigger string is put into the input
      response: [
        'I can do a google search!',
        "I can look good",
        "I can tell jokes!",
        "I can give you information!",
        "I can be customized!"
      ],
      type: 'equalTo'
    },
    {
      text: [
        'tell me a joke',
        'joke me'
      ],
      response: [
        'RIP Boiled Water, you will be mist.',
        "The first computer dates back to Adam and Eve. It was an Apple with limited memory, just one byte. And then everything crashed.",
      ],
      type: 'equalTo'
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
        '<p>I\'m Omega: an open-source virtual personal assistant for the web.<p>' +
        '<p>You can view my source <a href="https://github.com/rishiosaur/fuchsia" target="_blank">here</a>. Talk to me!</p>' +
        '</div>'
      ),
      type: 'equalTo'
    },

    {
      text: [
        'what is the time',
        'what time is it',
        'give me the time',
        'tell me the time',
        'whats the time'
      ],
      response: function() {
        return 'The time is <b>' + moment().format('h:mm a').toUpperCase() + '</b>.';
      },
      type: 'equalTo'
    },
    {
      text: [
        'change the theme to ',
        'change theme to ',
        'set the theme to ',
        'set theme to '
      ],
      response: function(parsed) {
        parsed = parsed.replace(/^(change the theme to|change theme to|set the theme to|set theme to) | /, '');
        parsed = parsed.split(" ").join("_")
        if (themes.includes(parsed)) {
          document.getElementById('styles').href = "css/" + parsed + ".css";
          return "Alright, I've changed the theme to " + parsed.split("_").join(" ");
        } else {
          return "Sorry, that's not a theme.<br>Our current theme is blue"
        }
      },
      type: 'startsWith'
    },
    {
      text: 'say ',
      response: function(parsed) {
        parsed = parsed.replace(/^say /, '');
        return parsed
      },
      type: 'startsWith'
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
      response: function() {
        return 'The date is <b>' + moment().format('dddd MMMM Do YYYY') + '</b>.';
      },
      type: 'equalTo'
    },

    {
      text: 'when am i',
      response: function() {
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
        'What did you even do?'
      ],
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
      response: function(parsed) {
        parsed = Omega.utilities.capitalize(parsed.replace(/(call me)|(my name is) /, ''));

        Omega.memory.name = parsed;

        return 'Got it. From now on, your name is ' + parsed;
      },
      type: 'startsWith',
      post: '.!'
    },

    /*{
      text: [
        'weather',
        'forecast'
      ],
      response: function() {
        return makeConversation('fuchsia', '<p>Today, there will be a <em>low</em> of -4, and a <em>high</em> of +6. It is partly cloudy. Not too bad for Canada, eh?</p>' + '<div class="sources">' + '<a href="https://www.spotify.com" target="_blank" class="fa fa-cloud-sun" aria-hidden="true"></a>' + '</div>', 'div')
      },
      type: 'equalTo'
    },*/
    {
      text: [
        'u gae',
        'gae',
        'u fat',
        'suvidhi lol',
        'fuck you',
        "you're a bitch",
        'play despacito',
        'play minecraftcito'

      ],
      response: ['no u', 'visage n\'est pas gentil.', 'that \'s not nice.'],
      type: 'startsWith'
    }
  ]);

  Omega.createModule('random').install([{
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
      response: function(parsed) {
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
      response: function() {
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

  Omega.createModule('web').install([{
      text: [
        'go to ',
        'open '
      ],
      response: function(parsed) {
        parsed = parsed.replace(/^(go to|open) | /, '');

        // Really long RegExp from https://gist.github.com/gruber/8891611
        if (!parsed.match(/\.(com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/)) {
          parsed += '.com';
        }

        openPage('https://' + parsed, 1000);

        return 'Click <a href="https://' + parsed + '" target="_blank">here</a> if your page did not automatically open.';
      },
      type: 'startsWith'
    },
    {
      text: 'how is ',
      response: function(parsed){
        parsed = parsed.replace(/^how is /,'')
        const endpoint = `https://cloud.iexapis.com/beta/stock/${parsed.toLowerCase()}/quote?token=pk_7d791648454a4c9ea1407271f381324c`;
        fetch(endpoint)
          .then(response => response.json())
          .then(data => {
            apidata3=data;
          })
          .catch(() => console.log('An error occurred'));
        console.log(`Here is the stock quote for ${apidata3.symbol}`);
        return makeConversation('fuchsia',
          `<p style="margin: 0px 0px 20px 0px">Here is the stock quote for ${apidata3.symbol} on ${apidata3.latestTime}. Good luck!</p><hr>`+
          `<p>Today's market start price: ${apidata3.open}, which was at ${apidata3.openTime}.</p>`+
          `<p>Today's market close price: ${apidata3.close}, which was at ${apidata3.closeTime}.</p>`+
          `<p>Today's market high for ${apidata3.symbol} is ${apidata3.high}.</p>` +
          `<p>Today's market low for ${apidata3.symbol} is ${apidata3.low}.</p>`
          ,'div')
      },
      type: 'startsWith'
    },
    {
      text: 'should i watch ',
      response: function(parsed) {
        parsed = parsed.replace(/^should i watch /, '');
        parsed = parsed.split(' ').join('+')
        // Creation of element to be filled in later
        /*var information = makeConversation(
            'fuchsia',
            'Retrieving data&hellip;',
            'div'
          ),
          reviews = '',
          total = 0,
          count = 0;

        });*/
        const endpoint = `http://www.omdbapi.com/?apikey=d6eb53cb&t=${parsed}`;
        fetch(endpoint)
          .then(response => response.json())
          .then(data => {
            apidata2=data;
          })
          .catch(() => console.log('An error occurred'));
        console.log(apidata2.Plot);
        if((apidata2.Ratings[1].Value).slice(0,-1)>=80){
          return makeConversation(
            'fuchsia',
            `<p style="margin: 0px 0px 20px 0px">Yeah, I would.<br> Here's a brief synopsis, the ratings, and cover art of <em>${apidata2.Title}.</em><hr></p>` +
            `<p><b>${apidata2.Title}</b></p>` +
            `<p style="margin: 0px 0px 20px 0px"><em>Synopsis</em>: ${apidata2.Plot} </p>` +
            `<img style="margin: 0px 0px 10px 0px;display: block;margin-left: auto;margin-right: auto;width: 50%;" src=${apidata2.Poster}/>` +
            `<p>Rotten Tomatoes: ${apidata2.Ratings[1].Value}</p>` +
            `<p>Internet Movie Database: ${apidata2.Ratings[0].Value}</p>` +
            `<p>Metacritic: ${apidata2.Ratings[2].Value}</p>`
            ,'div'
          );
        } else if ((apidata2.Ratings[1].Value).slice(0,-1)>=60) {
          return makeConversation(
            'fuchsia',
            `<p style="margin: 0px 0px 20px 0px">I mean... it doesn't seem too good, but it isn't bad, either. Here's a brief synopsis, the ratings, and cover art of <em>${apidata2.Title}<em><hr></p>` +
            `<p><b>${apidata2.Title}</b></p>` +
            `<p style="margin: 0px 0px 20px 0px"><em>Synopsis</em>: ${apidata2.Plot} </p>` +
            `<img style="margin: 0px 0px 10px 0px" src=${apidata2.Poster}/>` +
            `<p>Rotten Tomatoes: ${apidata2.Ratings[1].Value}</p>` +
            `<p>Internet Movie Database: ${apidata2.Ratings[0].Value}</p>` +
            `<p>Metacritic: ${apidata2.Ratings[2].Value}</p>`
            ,'div'
          );
        } else {
          return makeConversation(
            'fuchsia',
            `<p style="margin: 0px 0px 20px 0px">Absolutely not. However, if you are intent on watching <em>${apidata2.Title}</em>, here's a brief synopsis, the ratings, and cover art of <em>${apidata2.Title}</em><hr></p>` +
            `<p><b>${apidata2.Title}</b></p>` +
            `<p style="margin: 0px 0px 20px 0px"><em>Synopsis</em>: ${apidata2.Plot} </p>` +
            `<img style="margin: 0px 0px 10px 0px;display: block; margin-left: auto; margin-right: auto; width: 50%;" src=${apidata2.Poster}/>` +
            `<p>Rotten Tomatoes: ${apidata2.Ratings[1].Value}</p>` +
            `<p>Internet Movie Database: ${apidata2.Ratings[0].Value}</p>` +
            `<p>Metacritic: ${apidata2.Ratings[2].Value}</p>`
            ,'div'
          );
        }
      },
      type: 'startsWith'
    },
    /*{
      text: 'define ',
      response: function(parsed){
        return 'stuf'
      },
      type: 'startsWith'
    }*/

    {
      text: 'should i listen to ',
      response: function(parsed) {
        parsed = parsed.replace(/^should i listen to /, '');

        var information = makeConversation(
            'fuchsia',
            'Retrieving data&hellip;',
            'div'
          ),
          genres = '';

        getJSON('https://api.spotify.com/v1/search?type=artist&limit=1&q=' + encodeURIComponent(parsed), function(data) {
          if (data.artists.total) {
            if (data.artists.items[0].genres) {
              genres += '<p class="artist genres"><b>Genres:</b> ' +
                Omega.utilities.capitalize(data.artists.items[0].genres.join(', '))
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
        */
    /*{
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
        },*/


    {
      text: [
        'whats up',
        'sup'
      ],
      response: function() {
        return Omega('should i watch up');
      },
      type: 'equalTo'
    },

    {
      text: [
        'what is ',
        'whats ',
        'what are ',
        'whatre ',
        "what is a ",
        'who is ',
        'who are '
      ],
      response: function(parsed) {
        var psplit = parsed.split(' ')
        //parsed = parsed.replace(/^(what( i)?s( a(n)?| the)?) |(what( a)?re( the)) | /, '');
        parsed = parsed.replace(/^what is |whats |what are |whatre |what is a|/,'')
        console.log(parsed)
        if(!isNaN(parsed.charAt(0))){
          var endpoint = `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(parsed)}&appid=5PWTGW-3V69RYG28U&output=json`
          console.log(endpoint)
          fetch('https://cors-anywhere.herokuapp.com/'+endpoint)
            .then(response => response.json())
            .then(data => {
              apidata = data;
              console.log(apidata)
            })
            .catch(() => console.log('An error occurred'));
          console.log(apidata.queryresult.pods[0].subpods[0].plaintext)
          console.log(apidata.queryresult.pods[1].subpods[0].plaintext)
          return makeConversation('fuchsia',
          `<p>I've interpreted your question as: ${apidata.queryresult.pods[0].subpods[0].plaintext}.</p>`+
          `<p style="margin: 0px 0px 20px 0px">Here's your result: ${apidata.queryresult.pods[1].subpods[0].plaintext}</p><hr>`+
          `<p><b>Here's some extra information:</b></p>` +
          `<p>Number line: <img style="vertical-align: middle;" src=${apidata.queryresult.pods[2].subpods[0].img.src}/></p>`+
          `<p>Illustration: <img style="vertical-align: middle;" src=${apidata.queryresult.pods[4].subpods[0].img.src}/></p>`
          ,'div')
        } else {
          const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(parsed)}`;
          fetch(endpoint)
            .then(response => response.json())
            .then(data => {
              apidata = data;
            })
            .catch(() => console.log('An error occurred'));
          return makeConversation('fuchsia',
            '<p style="margin: 0px 0px 20px 0px">I\'ve found an article for you. Here you go!</p><hr>' +
            `<h3>${apidata.title}</h3>` +
            `<p>${apidata.extract}<br></p>` +
            `<img style="margin:20px 0px 0px 0px;" src="${apidata.thumbnail.source}"/>` +
            '<div class="sources">' +
            '<a href="https://www.google.com" target="_blank" class="fa fa-wikipedia-w" aria-hidden="true"></a>' +
            '</div>',
            'div')
          apidata = "lol sike"
          parsed = ""
        }
      },
      type: 'startsWith'
    },
    {

    },
    {
      text: "search ",
      response: function(parsed) {
        parsed = parsed.split(" ")
        var search = parsed.slice(parsed.indexOf("for") + 1, parsed.length)
        var engine = parsed.slice(1, parsed.indexOf("for")).join(" ")
        switch (engine) {
          case "google":
            var url = "https://www.google.com/search?q=" + search.join("+");
            return makeConversation(
              'fuchsia',
              '<p>Alright, I\'ve searched Google for "' + search.join(" ") + '".' +
              '<p>Click <a href="' + url + '" target="_blank">here</a> to open the Google Search.</p>' +
              '<div class="sources">' +
              '<a href="https://www.google.com" target="_blank" class="fa fa-google" aria-hidden="true"></a>' +
              '</div>',
              'div'
            );

            break;
          case "soundcloud":
            var url = "https://www.soundcloud.com/search?q=" + search.join("%20");
            return makeConversation(
              'fuchsia',
              '<p>Alright, I\'ve searched SoundCloud for "' + search.join(" ") + '".' +
              '<p>Click <a href="' + url + '" target="_blank">here</a> to open the SoundCloud Search.</p>' +
              '<div class="sources">' +
              '<a href="https://www.google.com" target="_blank" class="fa fa-soundcloud" aria-hidden="true"></a>' +
              '</div>',
              'div'
            );
            break;
          case "wolfram alpha":
            var url = "https://www.wolframalpha.com/input/?i=" + search.join("+");
            return makeConversation(
              'fuchsia',
              '<p>Alright, I\'ve searched Wolfram Alpha for "' + search.join(" ") + '".' +
              '<p>Click <a href="' + url + '" target="_blank">here</a> to open the Wolfram Alpha Search.</p>' +
              '<div class="sources">' +
              '<a href="https://www.google.com" target="_blank" class="fa fa-search-plus" aria-hidden="true"></a>' +
              '</div>',
              'div'
            );
            break;
            //https://open.spotify.com/search/results/xxxtentacion%20skins
          case "spotify":
            var url = "https://open.spotify.com/search/results/" + search.join("%20");
            return makeConversation(
              'fuchsia',
              '<p>Alright, I\'ve searched Spotify for "' + search.join(" ") + '".' +
              '<p>Click <a href="' + url + '" target="_blank">here</a> to open the Spotify Search.</p>' +
              '<div class="sources">' +
              '<a href="https://www.google.com" target="_blank" class="fa fa-spotify" aria-hidden="true"></a>' +
              '</div>',
              'div'
            );
            break;

          default:
            return "I'm sorry, I couldn't search the web for that. Please try a different search engine or search term."

        }
      },
      type: "startsWith"
    },
    {//3ce14c83a72b75821d3994a1f70e5ceb
      text: [
        'what will the weather be in',
        'what is the forecast in'
      ],
      response: function(parsed){
        parsed = parsed.replace(/^ /, '');
        parsed = parsed.split(' ').join('+')
        const endpoint = `http://www.omdbapi.com/?apikey=d6eb53cb&t=${parsed}`;
        fetch(endpoint)
          .then(response => response.json())
          .then(data => {
            apidata2=data;
          })
          .catch(() => console.log('An error occurred'));
        console.log(apidata2.Plot);

      },
      type: 'equalTo'
    }
  ]);
  Omega.createModule('selfinformation').install([
    {
      text: 'theres a problem',
      response: 'u fat',
      type:'equalTo'
    },
    {
      text: 'show me some code',
      response: ()=>{

      },
      type:'equalTo'
    }
  ]);
  Omega.createModule('humanity').install([
    {

    }
  ])
  /*Omega.createModule('utilities').install([
        {
            text: [
                'calculator',
                'show me a calculator',
                'give me a calculator'
            ],
            response: function(){
                return makeConversation('fuchsia',
                    /*'<form name="calculator">'+
                        '<table>'
                            '<tr>'+
                               '<td colspan="4">'+
                                  '<input type="text" name="display" id="display" disabled>'+
                               '</td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="button" name="one" value="1" onclick="calculator.display.value += '1'"></td>'+
                               '<td><input type="button" name="two" value="2" onclick="calculator.display.value += '2'"></td>'+
                               '<td><input type="button" name="three" value="3" onclick="calculator.display.value += '3'"></td>'+
                               '<td><input type="button" class="operator" name="plus" value="+" onclick="calculator.display.value += '+'"></td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="button" name="four" value="4" onclick="calculator.display.value += '4'"></td>'+
                               '<td><input type="button" name="five" value="5" onclick="calculator.display.value += '5'"></td>'+
                                '<td><input type="button" name="six" value="6" onclick="calculator.display.value += '6'"></td>'+
                               '<td><input type="button" class="operator" name="minus" value="-" onclick="calculator.display.value += '-'"></td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="button" name="seven" value="7" onclick="calculator.display.value += '7'"></td>'+
                               '<td><input type="button" name="eight" value="8" onclick="calculator.display.value += '8'"></td>'+
                               '<td><input type="button" name="nine" value="9" onclick="calculator.display.value += '9'"></td>'+
                               '<td><input type="button" class="operator" name="times" value="x" onclick="calculator.display.value += '*'"></td>'+
                            '</tr>'+
                            '<tr>'+
                               '<td><input type="button" id="clear" name="clear" value="c" onclick="calculator.display.value = ''"></td>'+
                               '<td><input type="button" name="zero" value="0" onclick="calculator.display.value += '0'"></td>'+
                               '<td><input type="button" name="doit" value="=" onclick="calculator.display.value = eval(calculator.display.value)"></td>'+
                               '<td><input type="button" class="operator" name="div" value="/" onclick="calculator.display.value += '/'"></td>'+
                            '</tr>'+
                         '</table>'+
                      '</form>''<formname="calculator">'+'<table>''<tr>'+'<tdcolspan="4">'+'<inputtype="text"name="display"id="display"disabled>'+'</td>'+'</tr>'+'<tr>'+'<td><inputtype="button"name="one"value="1"onclick="calculator.display.value+='1'"></td>'+'<td><inputtype="button"name="two"value="2"onclick="calculator.display.value+='2'"></td>'+'<td><inputtype="button"name="three"value="3"onclick="calculator.display.value+='3'"></td>'+'<td><inputtype="button"class="operator"name="plus"value="+"onclick="calculator.display.value+='+'"></td>'+'</tr>'+'<tr>'+'<td><inputtype="button"name="four"value="4"onclick="calculator.display.value+='4'"></td>'+'<td><inputtype="button"name="five"value="5"onclick="calculator.display.value+='5'"></td>'+'<td><inputtype="button"name="six"value="6"onclick="calculator.display.value+='6'"></td>'+'<td><inputtype="button"class="operator"name="minus"value="-"onclick="calculator.display.value+='-'"></td>'+'</tr>'+'<tr>'+'<td><inputtype="button"name="seven"value="7"onclick="calculator.display.value+='7'"></td>'+'<td><inputtype="button"name="eight"value="8"onclick="calculator.display.value+='8'"></td>'+'<td><inputtype="button"name="nine"value="9"onclick="calculator.display.value+='9'"></td>'+'<td><inputtype="button"class="operator"name="times"value="x"onclick="calculator.display.value+='*'"></td>'+'</tr>'+'<tr>'+'<td><inputtype="button"id="clear"name="clear"value="c"onclick="calculator.display.value=''"></td>'+'<td><inputtype="button"name="zero"value="0"onclick="calculator.display.value+='0'"></td>'+'<td><inputtype="button"name="doit"value="="onclick="calculator.display.value=eval(calculator.display.value)"></td>'+'<td><inputtype="button"class="operator"name="div"value="/"onclick="calculator.display.value+='/'"></td>'+'</tr>'+'</table>'+'</form>'
                    ,"div")
            },
            type: "startsWith"
        }
]);*/

  Omega.fallback = function(parsed) {
      var url = 'https://www.google.com/?q=' + encodeURIComponent(parsed);
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

  // Leak Omega into global scope
  w.Omega = Omega;
});
