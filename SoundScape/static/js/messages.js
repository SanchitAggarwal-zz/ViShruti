function audioControl(){
    alert('in js');
    var sound=document.getElementById('player');
    sound.balance=-1;
    sound.play();
};