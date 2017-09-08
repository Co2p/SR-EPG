const dayWidth = 864; // in em
const p1colors = ['#32CDD7', '#7CDED5', '#6EB4CD'];
const p2colors = ['#FF5A00', '#E70F47', '#F4AF00'];
const p3colors = ['#00C88C', '#C4E4A5', '#70D551'];
const p4colors = ['#C31EAA', '#C2AFE6', '#1C29A7'];
const othercolors = ['#0065bd'];

function getJSON(url) {
  url = makeSSL(url);
  return new Promise((success, error) => {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        success(data);
      } else {
        error();
      }
    };
    request.onerror = function() {
      error();
    };
    request.send();
  })
}

function channelSwitch(id, p1, p2, p3, p4, otherwise) {
  if (id == 132) {
    return p1();
  } else if (id == 163 || id == 2562) {
    return p2();
  } else if (id == 164) {
    return p3();
  } else if (id == 701) {
    return p4();
  } else {
    return otherwise();
  }
}

function getChannelColor(id, defaultColor) {
  return channelSwitch(id, ()=>{
    return p1colors[0];
  }, () =>{
    return p2colors[0];
  }, ()=>{
    return p3colors[0];
  }, ()=>{
    return p4colors[0];
  },()=>{
    return defaultColor;
  });
}

function getVector(url) {
  let id = url.split('/')[5];
  return channelSwitch(id, ()=>{
    return 'img/p1.svg';
  }, () =>{
    return 'img/p2.svg';
  }, ()=>{
    return 'img/p3.svg';
  }, ()=>{
    return 'img/p4.svg';
  },()=>{
    return makeSSL(url);
  });
}

function standardizeTime(NETtime) {
  return new Date(parseInt(NETtime.split('(')[1].split(')')[0]));
}

function readableTime(time) {
  return new Intl.DateTimeFormat(navigator.language, {hour: 'numeric', minute: 'numeric'}).format(time);
}

function makeSSL(link) {
  if(link) {
    return link.replace('http://', 'https://');
  }
  return;
}

function scrollToNow() {
  $('body, html').animate({ scrollLeft: parseFloat($('.timeindicator').css('width'))}, 100).animate({scrollLeft: parseFloat($('.timeindicator').css('width')) + parseFloat($(window).width())/500 + 'px'}, 500);
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

function timeToEM(time) {
  return time / 100000;
}
