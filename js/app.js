const content = $('content');
const sidebar = $('sidebar');
let channels = [];
let programs = {};
let lokalaKanaler = [];
const lokalKanal = "P4 Stockholm";
$.getJSON(channelsURL, function(data) {
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
          build(channel);
        }
      }
    }
  }
});

function build(channel) {
  $.getJSON(channel.scheduleurl + "&format=json&pagination=false",function(data){
    api = data;
    content.append(channelTemplate(channel));
    const guide = $('.' + channel.id);
    let timeNow = new Date();
    guide.append(channelIconTemplate(channel));

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

function disableScroll() {
  $('body').css({'overflow':'hidden'});
  $(document).bind('scroll',function () {
    window.scrollTo(0,0);
  });
}

function enableScroll() {
  $(document).unbind('scroll');
  $('body').css({'overflow':'visible'});
}

function programInfo(e) {
  if ($('.program-info').length > 0) {
    enableScroll();
    let previous = $('.program-info');
    $('.fadedprogram').animate({opacity: '0.5'}, 500);
    $(e).find('detail').hide();
    previous.removeClass('program-info').css('position', '').css('z-index', 'inherit').fadeIn();
  } else {
    disableScroll();
    if ($(e.parentElement).hasClass('fadedprogram')) {
      $(e.parentElement).animate({opacity: 1}, 500);
    }
    let animationDone = false;
    if ($(e).find('detail').length == 0) {
      $.getJSON(episodeURL({'id': $(e.parentElement).attr('id')})).then(function (data) {
        data.episode.imageurl = makeSSL(data.episode.imageurl);
        $(e).append(programDetailTemplate(data.episode));
        $(e).find('detail').hide();
        if (animationDone) {
          $(e).find('detail').fadeIn();
        }
      }).catch((err) => {
        console.log(e);
      })
    }

    let offset = $(e).offset();
    $(e).css({
      position: 'fixed',
      top: offset.top,
      left: offset.left
    });
    $(e).css('z-index', '1000');
    $(e).toggleClass('program-info', 100);
    $(e).animate({top: 0, left: 0}, 500).promise().done(() => {
      $(e).find('detail').fadeIn();
      animationDone = true;
    });
  }
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
      if (currTime >= $(faded[i]).find('timetext').text()) {
        $(faded[i]).css('opacity', 0.5);
        $(faded[i]).removeClass('fadedprogram');
        $(faded[i]).animate({opacity: 1}, 500)
        console.log('de-faded');
      }
    }
  });
}, 10000);
