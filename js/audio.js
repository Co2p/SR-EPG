var playing = 0;

$('div').on('click', (e) => {
  if (e.target.className == "playing") {
    streamid = $(e.target.parentElement.parentElement).attr('id');
    $('.playing').attr('src','img/play.svg');

    if (playing != streamid) {
      let audio = $('audio');
      if (playing != 0) {
        audio[0].pause();
        audio[0].src = $('audio')[0].src; //stops stream
      }

      let player = e.target;
      let audiourl = liveAudioURL({id: streamid});
      audio[0].src = audio.src; //stops stream

      audio[0].src = audiourl;
      player.src = 'img/loading.svg';

      audio[0].play();
      audio[0].addEventListener('playing', function handler(e) {
        playing = streamid;
        player.src = 'img/pause.svg';
        audio[0].removeEventListener('playing', handler);
      });

    } else {
      let audio = $('audio');
      audio[0].pause();
      audio[0].src = '#'; //stops stream
      playing = 0;
    }
  }
})
