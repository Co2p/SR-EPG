let playing;

function liveaudio(e) {
  return; //safeguard non ready feature
  let audiourl = liveAudioURL({id: $(e.parentElement).attr('id')});
  let myAudio = document.getElementsByTagName('audio')
  if ($('audio').length == 0) {
    myAudio = document.createElement('audio');
    $('audio').data('id', $(e.parentElement).attr('id'));
  }

  if (myAudio.canPlayType('audio/mpeg')) {
    myAudio.setAttribute('src',audiourl);
  } else if (myAudio.canPlayType('audio/ogg')) {
    console.log('oh my ogg');
  }

  myAudio.play();
  myAudio.addEventListener('playing', (e) => {
    playing = $('audio').attr('id');
    console.log($(e.target.id));
  });
}
