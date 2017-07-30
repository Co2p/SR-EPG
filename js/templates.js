const programTemplatePics = Handlebars.compile('<program style="width: {{duration}}em;"><div title="{{program.name}}" style="{{#if imageurl}}background: url({{imageurl}});{{/if}}{{#unless imageurl}}background: {{channelcolor}};{{/unless}}background-size: cover;">{{title}}</div></program>');
const programTemplate = Handlebars.compile('<program style="width: {{duration}}em;" {{#if fade}}class="fadedprogram"{{/if}}><div title="{{program.name}}" style="background: {{channelcolor}};"><p>{{title}}</p><starttime class="text-light">{{starttime}}</starttime></div></program>');
const channelTemplate = Handlebars.compile('<kanal class="{{id}}"></kanal>');
const channelIconTemplate = Handlebars.compile('<kanalicon title="{{name}}" id="{{id}}" class="text-light"><p>{{name}}</p><img href="#" onclick="liveaudio(this);return false;" src="{{image}}"></img></kanalicon>')

const liveAudioURL = Handlebars.compile('https://sverigesradio.se/topsy/direkt/{{id}}.mp3')
