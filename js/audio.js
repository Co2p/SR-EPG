const audioContext = new AudioContext();
let playing = 0;

function liveaudio(e) {
  $('audio').remove();
  if (playing != $(e.parentElement).attr('id')) {
    playing = $(e.parentElement).attr('id');
    let audiourl = liveAudioURL({id: $(e.parentElement).attr('id')});
    console.log(audiourl);
    $('body').append('<audio autoplay src="' + audiourl + '">');
    playing = $(e.parentElement).attr('id');
  } else {
    playing = 0;
  }
}
