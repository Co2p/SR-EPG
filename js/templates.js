const channelsURL = 'https://api.sr.se/api/v2/channels?format=json&pagination=false';
const ekotAlbumart = '"https://static-cdn.sr.se/sida/images/4540/3634468_2048_1152.jpg?preset=api-default-square"'

function channelTemplate(d) {
  return '<kanal id="' + d.id + '" style="margin-top: ' + d.topOffset + 'em;"></kanal>';
}

function programTemplate(d) {
  let faded = d.fade? 'class="fadedprogram"':'';
  let programStyles = 'eid="' + d.episodeid + '" pid="' + d.program.id + '" style="width:' + d.duration + 'em; left:' + d.absolutePos + 'em;" ' + faded;
  let time = '<timetext class="starttime text-light">' + d.starttime + '</timetext><timetext class="endtime text-light"> - ' + d.endtime + '</timetext>';
  return '<program ' + programStyles + ' onclick="expandProgram(this);return false;"><div href="#' + d.episodeid + '" title="' + d.program.name + '" style="background: ' + d.programcolor + '; height:' + d.height + 'em;">' + title(d.title) + time + '</div></program>';
}

function programDetailTemplate(d) {
  let broadcast = d.broadcast? 'Originallängd: <audio src="' + d.broadcast.broadcastfiles[0].url + '" controls="true"/>': '';
  let podd = d.listenpodfile? 'Podd: <audio src="' + d.listenpodfile.url + '" controls="true"/>': '';
  let description = d.description? '<description>' + d.description + '</description>': '';
  let text = d.text? '<text>' + d.text + '</text>': '';
  return '<detail>' + image(d) + broadcast + podd + title(d.title) + description + text + '</detail>';
}

function channelIconTemplate(d) {
  let icon = '<img class="playing" src="img/play.svg"/><img class="icon" href="#" style="background-color:' + d.color + '"src="' + d.image + '"/>';
  let styles = 'title="' + d.name + '" id="' + d.id + '" class="text-light" style="margin-top: ' + d.topOffset + 'em;"';
  return '<kanalicon ' + styles + '>' + title(d.name) + '<div class="liveradio">' + icon +'</div></kanalicon>';
}

function scheduleURL(id, date) {
  return 'http://api.sr.se/api/v2/scheduledepisodes?channelid=' + id + '&format=json&pagination=false&date=' + date.getFullYear() + '-' + (date.getMonth() + 1)  + '-' + date.getDate();
}

function programURL(d) {
  return 'http://api.sr.se/api/v2/programs/' + d.id + '?format=json';
}

function episodeURL(d) {
  return 'https://api.sr.se/api/v2/episodes/get?id=' + d.id + '&format=json';
}

function liveAudioURL(d) {
  return 'https://sverigesradio.se/topsy/direkt/' + d.id + '.mp3';
}

function image(d) {
  return d.imageurl? '<img alt="' + d.title + '" src="' + d.imageurl + '"/>': '';
}

function title(t) {
  return t? '<p>' + t + '</p>':'';
}
