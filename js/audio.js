
let myAudio = document.createElement('audio');
var playing = 0;

$('div').on('click', (e) => {
  if (e.target.className == "playing") {
    streamid = $(e.target.parentElement.parentElement).attr('id');

    if (playing != streamid) {
      e.target.src = 'img/pause.svg';
      let audiourl = liveAudioURL({id: streamid});
      myAudio.setAttribute('src',audiourl);

      myAudio.play();
      myAudio.addEventListener('playing', (e) => {
        playing = streamid;
      });

    } else {
      e.target.src = 'img/play.svg';
      myAudio.pause();
      playing = 0;
    }
  }
})
