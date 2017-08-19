const programTemplatePics = Handlebars.compile('<program style="width: {{duration}}em;"><div title="{{program.name}}" style="{{#if imageurl}}background: url({{imageurl}});{{/if}}{{#unless imageurl}}background: {{channelcolor}};{{/unless}}background-size: cover;">{{title}}</div></program>');
const programTemplate = Handlebars.compile('<program eid="{{episodeid}}" pid="{{program.id}}" style="width:{{duration}}em;left:{{absolutePos}}em;" {{#if fade}}class="fadedprogram"{{/if}}><div href="#{{episodeid}}" onclick="programInfo(this);return false;" title="{{program.name}}" style="background: {{programcolor}};"><p>{{title}}</p><timetext class="starttime text-light">{{starttime}}</timetext><timetext class="endtime text-light"> - {{endtime}}</timetext></div></program>');
const programDetailTemplate = Handlebars.compile('<detail>{{#if imageurl}}<img alt="{{title}}" src="{{imageurl}}"/>{{/if}}{{#each broadcast.broadcastfiles}}Originallängd: <audio src="{{this.url}}" controls="true"/>{{/each}}{{#if listenpodfile.url}}Podd:<audio src="{{listenpodfile.url}}" controls="true"/>{{/if}}<p>{{title}}</p><description>{{description}}</description><text>{{text}}</text></detail>')
const channelTemplate = Handlebars.compile('<kanal id="{{id}}" style="margin-top: {{topOffset}}em;"></kanal>');
const channelIconTemplate = Handlebars.compile('<kanalicon title="{{name}}" id="{{id}}" class="text-light" style="margin-top: {{topOffset}}em;"><p>{{name}}</p><div class="liveradio"><img class="playing" src="img/play.svg"/><img class="icon" href="#" style="background-color:{{color}}"src="{{image}}"/></div></kanalicon>')

const channelsURL = 'https://api.sr.se/api/v2/channels?format=json&pagination=false';
const liveAudioURL = Handlebars.compile('https://sverigesradio.se/topsy/direkt/{{id}}.mp3');
const episodeURL = Handlebars.compile('https://api.sr.se/api/v2/episodes/get?id={{id}}&format=json');
const programURL = Handlebars.compile('http://api.sr.se/api/v2/programs/{{id}}?format=json')

const ekotAlbumart = '"https://static-cdn.sr.se/sida/images/4540/3634468_2048_1152.jpg?preset=api-default-square"'
