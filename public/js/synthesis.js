//Shifting to javascript synthesis as no panning for html5 audio tag, hence to generate the sound with riffwave.js

/*Experiment to generate random location and sound corresponding to those location.
    The following attributes of sound are used to map the 3D location of the  real world:
        Y-Axis or Height (on the scale of 1 10 ) : with increasing Pitch of sound.
        X-Axis or Direction (Left or Right scale of -5 0 5) : Panning of sound on the 2 channel.
        Z-Axis or Depth (on scale of 1 10 ) : with amplitude of sound for each channel difference of 3dB for each step.
    The produce soundScape for location is being used for training.
    A random test is conducted to check the accuracy of these mapping on Blindfolded people.
    Furthermore Color is also represented using different frequency for each sound.
*/

var pitch = [440,466,494,523,554,587,622,659,698,740,784,831,880];   //predefined notes in hz
var rate=44100; //sample per sec
var amplitude=5; //amplitude of sine wave
var testpoint=new Point();
var PntA=new Point();
var PntB=new Point();
var sample=0;
var correct=0;
var wrong=0;
var scenario=0;
var check=0;
var temp=-1;
function updateAmplitude(a){
    amplitude=parseInt(a);
}
//function for 3D point
function Point(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
};

function generateSineWave(point,sampleRate,amp){
    var data = [];
    var seconds = 1;
    var frequencyHz = pitch[point.y];
    var amplitude = amp*point.z;
    var balance = parseInt(point.x);///10;
    //alert("Panning : "+ balance+" Frequency : "+ frequencyHz+" Hz Amplitude : "+ (6*amplitude/2000)+" dB");
    var sample=0;
    //generation of data for tone
    var j=0;
    for (var i = 0; i < sampleRate * seconds;i++) {
        sample = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * frequencyHz / sampleRate)*amplitude);
        //setting the pan for each channel
        switch(balance){
            case -1://left speaker
                data[j++] = sample;//(0.5 - balance);
                data[j++] = 0;//(0.5 + balance);
                break;
            case 0://both
                data[i] = sample;//(0.5 - balance);
                //data[j++] = sample;//(0.5 + balance);
                break;
            case 1://right speaker
                data[j++] = 0;//(0.5 - balance);
                data[j++] = sample;//0;//(0.5 + balance);
                break;

        }
        /*if(balance==-1){//left speaker
                data[j++] = sample;//(0.5 - balance);
                data[j++] = 0;//(0.5 + balance);
            }
            else if(balance==0){
                data[i++] = sample;//(0.5 - balance);
                data[i] = sample;//(0.5 + balance);
            }
            else if(balance==0){
                data[i++] = sample;//(0.5 - balance);
                data[i] = sample;//(0.5 + balance);
            }
            */
    }
    //alert(data);
    return data;
};

function getRadioValue(name){
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var x=radios[i].value;
            break;
        }
    }
    //alert(name+x);
    return x;
}

function training(){
    //alert("in test");
    var point = new Point();
    point.x=getRadioValue("X");
    point.y=getRadioValue("Y");
    point.z=getRadioValue("Z");
    var data=generateSineWave(point,rate,amplitude);
    var wave = new RIFFWAVE();   //riffwave variable
    wave.header.sampleRate = rate;
    wave.header.numChannels = 2;
    wave.header.bitsPerSample = 16;
    wave.Make(data);
    var audio = new Audio(wave.dataURI);
    if (!audio.paused) { // if playing stop and rewind
    audio.pause();
    audio.currentTime = 0;
    //audio.volume=5;
  }
    //audio.volume=0.5+point.z/10;
    audio.play();
};

function playSound(pointa,pointb){
    var dataA=generateSineWave(pointa,rate,amplitude);
    var dataB=generateSineWave(pointb,rate,amplitude);
    var data= dataA.concat(dataB);
    var wave = new RIFFWAVE();   //riffwave variable
    wave.header.sampleRate = rate;
    wave.header.numChannels = 2;
    wave.header.bitsPerSample = 16;
    wave.Make(data);
    var audio = new Audio(wave.dataURI);
    if (!audio.paused) { // if playing stop and rewind
    audio.pause();
    audio.currentTime = 0;
  }
    //audio.volume=0.5+testpoint.z/10;
    audio.play();
}

function RandomTraining(scenario){

    PntA.x=-1+Math.round(Math.random()*2); //generating random point
    PntA.y=1+Math.round(Math.random()*10);
    PntA.z=1+Math.round(Math.random()*10);
    PntB.x=PntA.x;
    PntB.y=PntA.y;
    PntB.z=PntA.z;

    switch(scenario){
        case 1:
            PntA.y=4+Math.round(Math.random()*7); //range 4-11
            PntB.y=1+Math.round(Math.random()*(PntA.y-3));//range 1- PntA
            break;
        case 2:
            PntA.y=1+Math.round(Math.random()*6); //range 1-7
            PntB.y=2+PntA.y+Math.round(Math.random()*(9-PntA.y)); //range PntA to 11
            break;
        case 3:
            PntA.z=2+Math.round(Math.random()*9); //range 2-11
            PntB.z=1+Math.round(Math.random()*(PntA.z-2));//range 1- PntA
            break;
        case 4:
            PntA.z=1+Math.round(Math.random()*9); //range 1-10
            PntB.z=1+PntA.z+Math.round(Math.random()*(10-PntA.z)); //range PntA to 11
            break;
        case 5:
            PntA.x=-1; //left to
            PntB.x=1; //right
            break;
        case 6:
            PntA.x=1; //right to
            PntB.x=-1; //left
            break;
    }
    playSound(PntA,PntB);
}

function generate(){
    check=1;
    testpoint.x=-1+Math.round(Math.random()*2);
    testpoint.y=1+Math.round(Math.random()*10);
    testpoint.z=1+Math.round(Math.random()*10);
    var data=generateSineWave(testpoint,rate,amplitude);
    var wave = new RIFFWAVE();   //riffwave variable
    wave.header.sampleRate = rate;
    wave.header.numChannels = 2;
    wave.header.bitsPerSample = 16;
    wave.Make(data);
    var audio = new Audio(wave.dataURI);
    if (!audio.paused) { // if playing stop and rewind
    audio.pause();
    audio.currentTime = 0;
  }
    //audio.volume=0.5+testpoint.z/10;
    audio.play();
/*    oFormObject = document.forms['testForm'];
    oFormObject.elements["actual"].value = String("");
    oFormObject.elements["predicted"].value =String("");
    oFormObject.elements["error"].value =String("");
*/
}

function replay(){
    if(check==0){
      alert("First Generate the sound for Replay");
    }
    else{
        var data=generateSineWave(testpoint,rate,amplitude);
        var wave = new RIFFWAVE();   //riffwave variable
        wave.header.sampleRate = rate;
        wave.header.numChannels = 2;
        wave.header.bitsPerSample = 16;
        wave.Make(data);
        var audio = new Audio(wave.dataURI);
        if (!audio.paused) { // if playing stop and rewind
            audio.pause();
            audio.currentTime = 0;
        }
        //audio.volume=0.5+testpoint.z/10;
        audio.play();
    }

}

function testing(){
    //alert("in test");
    if (check==0){
        alert("First Generate the sound for X:Y:Z prediction");
    }
    else{
        //sample++;
        var point = new Point();
        point.x=getRadioValue("X");
        point.y=getRadioValue("Y");
        point.z=getRadioValue("Z");
        /*if(point.x==testpoint.x && point.y==testpoint.y && point.z==testpoint.z){
            correct++;
        }
        else {
            wrong++;
        }

        oFormObject.elements["sample"].value = sample;
        oFormObject.elements["correct"].value = correct;
        oFormObject.elements["wrong"].value = wrong;
        */
        oFormObject = document.forms['testForm_check'];
        oFormObject.elements["actual"].value = String(testpoint.x)+":"+String(testpoint.y)+":"+String(testpoint.z);
        oFormObject.elements["predicted"].value =String(point.x)+":"+String(point.y)+":"+String(point.z);
        oFormObject.elements["error"].value =String(testpoint.x-point.x)+":"+String(testpoint.y-point.y)+":"+String(testpoint.z-point.z);
        check=0;
    }
};

function ScenarioTesting(playtype){
    if (parseInt(playtype)==1){
        sample++;
        do{
            temp = parseInt(1+Math.round(Math.random()*5));
        }while(temp==scenario)
        scenario=temp;
        RandomTraining(scenario);
    }
    else if(parseInt(playtype)==2){
        if(scenario==0){
            alert("First play the scenario");
        }
        else{
            playSound(PntA,PntB);
        }
    }
    else{
        var selectedScenario=parseInt(getRadioValue("scenarioTest"));
        if(selectedScenario==scenario){
            correct++;
        }
        else{
            wrong++;
        }
        oFormObject = document.forms['testForm_save'];
        oFormObject.elements["sample"].value = sample;
        oFormObject.elements["correct"].value = correct;
        oFormObject.elements["wrong"].value = wrong;
        scenario=0;
    }
}

/*$(function() {
    $('a#calculate').bind('click', function() {
      $.getJSON($SCRIPT_ROOT + '/_add_numbers', {
        a: $('input[name="a"]').val(),
        b: $('input[name="b"]').val()
      }, function(data) {
        $("#result").text(data.result);
      });
      return false;
    });
  });
*/
/*
function play(audio) {
  if (!audio.paused) { // if playing stop and rewind
    audio.pause();
    audio.currentTime = 0;
  }
  audio.play();
}*/
 /*var data = [],
		sampleRateHz = 44100,

		//Notes sequence, play with it ;)
		notes = [87, 0, 0, 87, 0, 0, 85, 0, 0, 82, 0, 0, 80, 0, 0, 82, 0, 82, 0, 80, 0, 0, 82, 0, 0, 85, 0, 0, 78, 0, 0, 78, 0, 78, 0],

		//Base Frequency based on the notes
		baseFreq = function(index) {
			var r = 2 * Math.PI * 523.0 * Math.pow(2,(notes[index]-69)/12.0) / sampleRateHz;
			return r;
		};

//Fill up the sound data!!
for(var j = 0; j < 2*sampleRateHz; j++) {
	var l = 2*sampleRateHz / notes.length;
	data[j] = 64 + 32 * Math.round(Math.sin(baseFreq(Math.round(j/l)) * j));
}


*/
