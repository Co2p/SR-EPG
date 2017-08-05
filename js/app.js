const content = $('content');
const sidebar = $('.sidebar');
const blockheight = 4.5; //the height of the graphical emisode representations in em
let contentHeight;
let channels = [];
let programs = {};
let lokalaKanaler = [];
const lokalKanal = "P4 Stockholm";
function init() {
  sidebar.empty();
  content.empty();
  channels = [];
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
          channel.topOffset = channels.length * blockheight;
          channel.channeltype = channel.channeltype;
          channel.scheduleurl = makeSSL(channel.scheduleurl);
          channel.liveaudio.url = makeSSL(channel.liveaudio.url);
          channel.color = "#" + channel.color;
          channel.image = makeSSL(channel.image);
          contentHeight = channels.length * blockheight;
          sidebar.css('height', contentHeight + 'em');
          $('.timeindicator').css('height', contentHeight + 'em');
          channels.push(channel);
          if (channel.scheduleurl != undefined && channel.name != 'Ekot sänder direkt') {
            build(channel);
          }
        }
      }
    }
  });
}

function build(channel) {
  getJSON(channel.scheduleurl + "&format=json&pagination=false").then((data) => {
    api = data;
    content.append(channelTemplate(channel));
    const guide = $('#' + channel.id);
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

      program.duration = timeToEM(programEnd - programStart);
      program.channelcolor = color;
      program.absolutePos = timeToEM(programStart - new Date().setHours(0,0,0,0));
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

let animationPos = {top: 0, left: 0};

function programInfo(e) {
  let program = $(e);
  let programDetail = program.find('detail');
  let programParent = program.parent();
  if ($('.program-info').length > 0) {
    enableScroll();
    let previous = $('.program-info');
    $('.fadedprogram').animate({opacity: '0.5'}, 500);
    programDetail.hide();
    previous.animate({top: animationPos.top, left: animationPos.left}, 0).promise().done(() => {
      previous.removeClass('program-info').css('position', '').css('z-index', '').fadeIn();
    });
  } else {
    disableScroll();
    animationPos.left = $(e).parent().css('left');
    animationPos.top = $(e).parent().css('top');
    $(e).css({
      position: 'fixed',
      'z-index': 1000,
      top: animationPos.top,
      left: animationPos.left
    });
    let animationDone = false;
    if (programParent.hasClass('fadedprogram')) {
      programParent.animate({opacity: 1}, 100);
    }
    program.addClass('program-info');
    program.animate({top: 0, left: 0}, 500).promise().done(() => {
      programDetail.fadeIn();
      animationDone = true;
    });
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

init();
var d = new Date(), e = new Date(d);
var msSinceMidnight = e - d.setHours(0,0,0,0);
content.append('<div class="timeindicator" style=";width:' + msSinceMidnight / 100000 + 'em;"></div>');
scrollToNow();

let lastmsSM;

setInterval(function() {
  var d = new Date(), e = new Date(d);
  var msSinceMidnight = e - d.setHours(0,0,0,0);
  if (msSinceMidnight < lastmsSM) {
    init();
  }
  lastmsSM = msSinceMidnight;
  $('.timeindicator').css('width', msSinceMidnight / 100000 + 'em');

  $('.fadedprogram').promise().done(function (faded) {
    const currTime = readableTime(new Date());
    for (var i = 0; faded.length > i; i++) {
      if (currTime >= $(faded[i]).find('.starttime').text()) {
        $(faded[i]).css('opacity', 0.5);
        $(faded[i]).removeClass('fadedprogram');
        $(faded[i]).animate({opacity: 1}, 500)
      }
    }
  });
}, 10000);

window.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt Event fired
  e.preventDefault();
});
