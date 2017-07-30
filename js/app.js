const content = $('content');
const sidebar = $('sidebar');
let channels = [];
const lokalKanal = "Göteborg";
$.getJSON("https://api.sr.se/api/v2/channels?format=json&pagination=false", function(data) {
  //console.log(data);
  for (var i in data.channels) {
    let channel = data.channels[i];
    if (channel.scheduleurl != undefined) {
      //setup a searchable JSON
      if (!channel.name.match("(?:P4).+") || channel.name.match("(!?P4)." + lokalKanal )) {
        channel.name = channel.name;
        channel.id = channel.id;
        channel.channeltype = channel.channeltype;
        channel.scheduleurl = makeSSL(channel.scheduleurl);
        channel.liveaudio.url = makeSSL(channel.liveaudio.url);
        channel.color = "#" + channel.color;
        channel.image = makeSSL(channel.image);
        channels.push(channel);

        //console.log(channel.name);
        if (channel.scheduleurl != undefined) {
          //console.log(channel.scheduleurl);
          $.getJSON(channel.scheduleurl + "&format=json&pagination=false",function(data){
            api = data;
            content.append(channelTemplate(channel));
            const guide = $('.' + channel.id);
            let timeNow = new Date();
            guide.append(channelIconTemplate(channel));

            let color = "#0065bd";
            //console.log(api);
            try {
              color = channel.color;
            } catch (e) {
              console.log(channel);
            }
            for (let j in api.schedule) {
              let program = api.schedule[j];
              const programStart = standardizeTime(program.starttimeutc);
              const programEnd = standardizeTime(program.endtimeutc);

              if (programStart >= timeNow) {
                program.fade = true;
              }

              program.duration = (programEnd - programStart) / 100000;
              program.channelcolor = color;
              program.starttime = readableTime(programStart);
              if (program.title == "Ekonyheter" || program.title == "Dagens Eko ") {
                program.title = "Ekot";
                program.channelcolor = "#0065bd";
                program.imageurl = "https://static-cdn.sr.se/sida/images/4540/3634468_2048_1152.jpg?preset=api-default-square";
              }
              guide.append(programTemplate(program));
            }
          });
        }
      }
    }
  }
});


function build(guide, api) {

}

function standardizeTime(NETtime) {
  return new Date(parseInt(NETtime.split('(')[1].split(')')[0]));
}

function readableTime(time) {
  return new Intl.DateTimeFormat(navigator.language, {hour: 'numeric', minute: 'numeric'}).format(time);
}

function makeSSL(link) {
  return link.replace('http://', 'https://');
}

function scrollToNow() {
  $('body, html').animate({ scrollLeft: parseFloat($('timeindicator').css('width'))}, 100).animate({scrollLeft: parseFloat($('timeindicator').css('width')) + parseFloat($(window).width())/500 + 'px'}, 1000);
}

var d = new Date(), e = new Date(d);
var msSinceMidnight = e - d.setHours(0,0,0,0);
content.append('<timeindicator style="height:' + $(document).height() +';width:' + msSinceMidnight / 100000 + 'em;"></timeindicator>');
scrollToNow();

setInterval(function() {
  var d = new Date(), e = new Date(d);
  var msSinceMidnight = e - d.setHours(0,0,0,0);
  $('timeindicator').css('width', msSinceMidnight / 100000 + 'em');

  $('.fadedprogram').promise().done(function (faded) {
    const currTime = readableTime(new Date());
    for (var i = 0; faded.length > i; i++) {
      if (currTime >= $(faded[i]).find('starttime').text()) {
        $(faded[i]).removeClass('fadedprogram');
        console.log('de-faded');
      }
    }
  });
}, 10000);

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register("https://co2p.github.io/SR-EPG/sw.js").then(function (reg) {
    console.log('serviceWorker online');
  }).catch(function (err) {

  });
}
