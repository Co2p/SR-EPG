const programTemplatePics = Handlebars.compile('<program style="width: {{duration}}em;"><div title="{{program.name}}" style="{{#if imageurl}}background: url({{imageurl}});{{/if}}{{#unless imageurl}}background: {{channelcolor}};{{/unless}}background-size: cover;">{{title}}</div></program>');
const programTemplate = Handlebars.compile('<program id="{{episodeid}}" style="width: {{duration}}em;" {{#if fade}}class="fadedprogram"{{/if}}><div href="#" onclick="programInfo(this);return false;" title="{{program.name}}" style="background: {{channelcolor}};"><p>{{title}}</p><timetext class="starttime text-light">{{starttime}}</timetext><timetext class="endtime text-light"> - {{endtime}}</timetext></div></program>');
const programDetailTemplate = Handlebars.compile('<detail><img src="{{imageurl}}"/><p>{{title}}</p><description>{{description}}</description><text>{{text}}</text></detail>')
const channelTemplate = Handlebars.compile('<kanal class="{{id}}"></kanal>');
const channelIconTemplate = Handlebars.compile('<kanalicon title="{{name}}" id="{{id}}" class="text-light"><p>{{name}}</p><img class="icon" href="#" onclick="liveaudio(this);return false;" src="{{image}}"></img></kanalicon>')

const channelsURL = 'https://api.sr.se/api/v2/channels?format=json&pagination=false';
const liveAudioURL = Handlebars.compile('https://sverigesradio.se/topsy/direkt/{{id}}.mp3');
const episodeURL = Handlebars.compile('https://api.sr.se/api/v2/episodes/get?id={{id}}&format=json');

const ekotAlbumart = '"https://static-cdn.sr.se/sida/images/4540/3634468_2048_1152.jpg?preset=api-default-square"'
