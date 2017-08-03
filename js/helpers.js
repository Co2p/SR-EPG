const dayWidth = 864; // in em

function getJSON(url) {
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
