var playing = 0;
let audio = $('audio');

$('div').on('click', (e) => {
  if (e.target.className == "playing") {
    streamid = $(e.target.parentElement.parentElement).attr('id');
    $('.playing').attr('src','img/play.svg');
    $('.playing').css('opacity', '');
    let player = e.target;
    audio[0].addEventListener('loadstart', function handler(e) {
      if (playing != 0) {
        player.src = 'img/loading.svg';
        player.style.opacity = 1;
      }
      audio[0].removeEventListener('loadstart', handler);
    });
    audio[0].addEventListener('playing', function handler(e) {
      player.src = 'img/pause.svg';
      audio[0].removeEventListener('playing', handler);
    });
    audio[0].addEventListener('pause', function handler(e) {
      player.src = 'img/play.svg';
      playPause(streamid)
      audio[0].removeEventListener('pause', handler);
    });
    playPause(streamid)
  }
});

function playPause(streamid) {
  if (playing != streamid) {
    if (playing != 0) {
      audio[0].pause();
      audio[0].src = audio[0].src; //stops stream
    }
    let audiourl = liveAudioURL({id: streamid});
    audio[0].src = audio.src; //stops stream

    audio[0].src = audiourl;
    audio[0].play();
    audio[0].addEventListener('playing', function handler(e) {
      playing = streamid;
      audio[0].removeEventListener('playing', handler);
      try {
        gaSend('Audio', 'play ' + streamid, streamid)
      } catch (e) {

      }
    });

  } else {
    let audio = $('audio');
    audio[0].pause();
    audio[0].src = '#'; //stops stream
    playing = 0;
  }
}
