const content = $('content');
const sidebar = $('.sidebar');
let channels = [];
let programs = {};
let lokalaKanaler = [];
const lokalKanal = "P4 Stockholm";
getJSON(channelsURL).then((data) => {
  for (var i in data.channels) {
    let channel = data.channels[i];
    if (channel.scheduleurl != undefined) {
      //setup a searchable JSON
      if (channel.name.match("(!?P4).")) {
        lokalaKanaler.push(channel.name);
      }
      if (!channel.name.match("(?:P4).+") || channel.name.match(lokalKanal)) {
        channel.name = channel.name;
        channel.id = channel.id;
        channel.channeltype = channel.channeltype;
        channel.scheduleurl = makeSSL(channel.scheduleurl);
        channel.liveaudio.url = makeSSL(channel.liveaudio.url);
        channel.color = "#" + channel.color;
        channel.image = makeSSL(channel.image);
        channels.push(channel);

        if (channel.scheduleurl != undefined && channel.name != 'Ekot sänder direkt') {
          console.log('added: ' + channel.name);
          build(channel);
        }
      }
    }
  }
});

function build(channel) {
  getJSON(channel.scheduleurl + "&format=json&pagination=false").then((data) => {
    api = data;
    content.append(channelTemplate(channel));
    const guide = $('.' + channel.id);
    let timeNow = new Date();
    sidebar.append(channelIconTemplate(channel));

    let color = "#0065bd";
    color = channel.color;

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
      program.endtime = readableTime(programEnd);
      if (program.title == "Ekonyheter" || program.title == "Dagens Eko ") {
        program.title = "Ekot";
        program.channelcolor = "#0065bd";
        program.imageurl = ekotAlbumart;
      }
      programs[program.program.id] = program;
      guide.append(programTemplate(program));
    }
  });
}

function programInfo(e) {
  let program = $(e);
  let programDetail = program.find('detail');
  let programParent = program.parent();
  if ($('.program-info').length > 0) {
    enableScroll();
    let previous = $('.program-info');
    $('.fadedprogram').animate({opacity: '0.5'}, 500);
    programDetail.hide();
    previous.removeClass('program-info').css('position', '').css('z-index', 'inherit').fadeIn();
  } else {
    disableScroll();
    let offset = $(e).offset();
    $(e).css({
      position: 'fixed',
      top: offset.top,
      left: offset.left
    });
    program.css('z-index', '1000');
    program.toggleClass('program-info', 100);
    program.animate({top: 0, left: 0}, 500).promise().done(() => {
      programDetail.fadeIn();
      animationDone = true;
    });
    if (programParent.hasClass('fadedprogram')) {
      programParent.animate({opacity: 1}, 500);
    }
    let animationDone = false;
    if (programDetail.length == 0) {
      getJSON(episodeURL({'id': $(e.parentElement).attr('eid')})).then(function (data) {
        data.episode.imageurl = makeSSL(data.episode.imageurl);
        program.append(programDetailTemplate(data.episode));
        programDetail.hide();
        if (animationDone) {
          programDetail.fadeIn();
        }
      }).catch((err) => {
        getJSON(programURL({'id': $(e.parentElement).attr('pid')})).then(function (data) {
          data.imageurl = makeSSL(data.programimage);
          data.title = data.name;
          data.description = data.program.description;
          program.append(programDetailTemplate(data));
          programDetail.hide();
          if (animationDone) {
            programDetail.fadeIn();
          }
        }).catch((err)=> {
          console.log('404');
          program.append(programDetailTemplate({'description': 'Ingen information tillgänglig'}));
        });
      });
    }
  }
}

var d = new Date(), e = new Date(d);
var msSinceMidnight = e - d.setHours(0,0,0,0);
content.append('<div class="timeindicator" style=";width:' + msSinceMidnight / 100000 + 'em;"></div>');
scrollToNow();

setInterval(function() {
  var d = new Date(), e = new Date(d);
  var msSinceMidnight = e - d.setHours(0,0,0,0);
  $('.timeindicator').css('width', msSinceMidnight / 100000 + 'em');

  $('.fadedprogram').promise().done(function (faded) {
    const currTime = readableTime(new Date());
    for (var i = 0; faded.length > i; i++) {
      if (currTime >= $(faded[i]).find('.starttime').text()) {
        console.log($(faded[i]).find('.starttime').text());
        $(faded[i]).css('opacity', 0.5);
        $(faded[i]).removeClass('fadedprogram');
        $(faded[i]).animate({opacity: 1}, 500)
        console.log('de-faded');
      }
    }
  });
}, 10000);

window.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise.
  // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});
