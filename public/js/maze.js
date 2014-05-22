var Maze,Path,Cue,Direction,Level,Samples,TotalSteps,MazeLength;
var pitch = [440,523,622];   //predefined notes in hz
var rate = 44100; //sample per sec
var volume = 50; //amplitude of sine wave
var next = 0;  // For Next move
var ResponseTime = 0, CueTime = 0,IntervalTime = 0;
var Hit = 0,Miss = 0,Recall = 0,count=0;
var inputDirection_a = [36,38,33,37,12,39,35,40,34];
var inputDirection_b = [103,104,105,100,101,102,97,98,99];
var expectedDirection = [13,23,33,12,22,32,11,21,31];
var DirectionLabels = ['NW',' N','NE',' W',' C',' E','SW',' S','SE'];
var Experiment = 1;
var A;
var TrainingMode = 0;
var Sounds = [];
var CurrentCuePos = 0;
var counter = 0;
var start_x,start_y,inc_sx,inc_sy;
var FreqDiff;
var Mode;
/*function updateVolume(a){
  volume=50+parseInt(a);
}*/
function generateMaze(){
  document.getElementById("StartExp").disabled = false;
  Direction = parseInt(document.getElementById("Direction").value);
  Level = parseInt(document.getElementById("Level").value);
  Samples = parseInt(document.getElementById("Samples").value);
  TotalSteps = Level * Samples;
  var Blocks = 2 * Direction * TotalSteps;
  MazeLength = Math.ceil(Math.sqrt(Blocks));
  var Neighbour = getNeighbours(Direction);
  var NoOfNbr = Neighbour.length;
  //alert('Number '+NoOfNbr);
  var flag = 0;

  do{
    flag = 0;
    Maze = new Array(MazeLength);
    for(var i = 0; i<MazeLength;i++){
      Maze[i] = new Array(MazeLength);
      for(var j = 0; j<MazeLength;j++){
        Maze[i][j] = 6;
      }
    }
    Path =  new Array(TotalSteps);
    Cue = new Array(TotalSteps);
    for(var i = 0; i<TotalSteps;i++){
      Path[i] = new Array(2);
      Cue[i] = new Array(2);
    }
    //alert('Draw Maze');
    //drawMaze(Maze,MazeLength);
    var Steps = 0;
    var prev_pos_x = Math.floor(Math.random()*MazeLength);
    var prev_pos_y = Math.floor(Math.random()*MazeLength);
    //alert('prev_pos_x ' + prev_pos_x + ' prev_pos_y ' + prev_pos_y );
    var new_pos_x,new_pos_y;
    Maze[prev_pos_x][prev_pos_y] = 5;     //Starting Cell
    start_x = prev_pos_x;
    start_y = prev_pos_y;
    inc_sx = prev_pos_x;
    inc_sy = prev_pos_y;
    var NextNbr = 0,pos_x,pos_y;
    while(Steps < TotalSteps && flag == 0){
      flag = 1;
      for(var nbr=0;nbr<NoOfNbr;nbr++){
        pos_x = prev_pos_x + Neighbour[nbr][0];
        pos_y = prev_pos_y + Neighbour[nbr][1];
        if(pos_x >= 0 && pos_x < MazeLength){
          if(pos_y >= 0 && pos_y < MazeLength){
            if(Maze[pos_x][pos_y] == 6){
              flag = 0;
            }
          }
        }
      }
      if(flag == 0){
        NextNbr =  Math.floor(Math.random()*NoOfNbr);
        //alert('Next Neighbour ' + NextNbr);
        new_pos_x = prev_pos_x + Neighbour[NextNbr][0];
        new_pos_y = prev_pos_y + Neighbour[NextNbr][1];
        //alert('new_pos_x ' + new_pos_x + ' new_pos_y ' + new_pos_y );
        if(new_pos_x >= 0 && new_pos_x < MazeLength){
          if(new_pos_y >= 0 && new_pos_y < MazeLength){
            if(Maze[new_pos_x][new_pos_y] == 6){
              Maze[new_pos_x][new_pos_y] = 0;
              for(var nbr=0;nbr<NoOfNbr;nbr++){
                pos_x = prev_pos_x + Neighbour[nbr][0];
                pos_y = prev_pos_y + Neighbour[nbr][1];
                if(pos_x >= 0 && pos_x < MazeLength){
                  if(pos_y >= 0 && pos_y < MazeLength){
                    if(Maze[pos_x][pos_y] == 6){
                      Maze[pos_x][pos_y] = 1;
                    }
                  }
                }
              }
              prev_pos_x = new_pos_x;
              prev_pos_y = new_pos_y;
              Path[Steps][0] = prev_pos_x;
              Path[Steps][1] = prev_pos_y;
              Cue[Steps][0] = Neighbour[NextNbr][0];
              Cue[Steps][1] = Neighbour[NextNbr][1];
              Steps = Steps+1;
      //        alert('Draw Maze');
              //drawMaze(Maze,MazeLength);
              //alert('Steps Left '+StepsLeft);
            }
          }
        }
      }
    }
  }while(flag);

  for (var i = 0; i < MazeLength; i++){
    for (var j = 0; j < MazeLength; j++){
      if(Maze[i][j] == 6){
        Maze[i][j] = 1;
      }
    }
  }
  Maze[prev_pos_x][prev_pos_y] = 6;
  //alert('Draw Maze');
  drawMaze(Maze,MazeLength);
  next = 0;
  Hit = 0;
  Miss = 0;
  ResponseTime = 0;
  CurrentCuePos = 0;
  count = 0;
  Recall = 0;
  counter = 0;
  Sounds = [];
  if(TrainingMode == 2){
    for (var i = 0; i < MazeLength; i++){
      for (var j = 0; j < MazeLength; j++){
        Maze[i][j] = 6;
      }
    }
    Maze[start_x][start_y]=5;
    drawMaze(Maze,MazeLength);
  }
}
function drawMaze(Maze,MazeLength){
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 50 - 3 * MazeLength)/MazeLength);
  var BlockHeight = Math.ceil((height - 50 - 3 * MazeLength)/MazeLength);
  var BlockColor = ['Yellow','Black','Orange','Green','Red','Blue','White'];
  canvas.style.border = "black 5px solid";
  context.beginPath();
  context.clearRect(0, 0, width, height);
  //alert(MazeLength);
  var y = 25;
  for (var j = 0; j < MazeLength; j++){
    var x = 25;
    for (var i = 0; i < MazeLength; i++){
      context.fillStyle = BlockColor[Maze[i][j]];
      context.lineWidth = 1;
      context.strokeStyle = 'Black';
      context.fillRect(x, y , BlockWidth, BlockHeight);
      context.strokeRect(x, y , BlockWidth, BlockHeight);
      x = x + BlockWidth + 3;
    }
    y = y + BlockHeight + 3;
  }
  var MazeDiv = document.getElementById('MazeDiv');
  if(TrainingMode==0){
      MazeDiv.style.visibility = 'hidden'; // hide, but let the element keep its size

  }
  else{
      MazeDiv.style.visibility = 'visible';
  }
}
function drawControls(key){
  var canvas = document.getElementById('Controls_Canvas');
  var width = canvas.width;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 50 - 3 * 3)/3);
  var BlockHeight = Math.ceil((height - 50 - 3 * 3)/3);
  var BlockColor = ['Blue','White'];
  context.beginPath();
  context.clearRect(0, 0, width, height);
  //alert(MazeLength);
  if(Direction == 1){
    var y = 25;
    for (var j = 0; j < 3; j++){
      var x = 25;
      for (var i = 0; i < 3; i++){
        //alert("Key" + key + "val" +(i+3*j));
        switch ((i+3*j)){
          case 0: case 1: case 2: case 3: case 5:
                    context.clearRect(x, y , BlockWidth, BlockHeight);
                    break;
          default : context.lineWidth = 1;
                    context.strokeStyle = 'Black';
                    context.fillStyle = BlockColor[((key==7&&(i+3*j)==7)||key-(i+3*j)==-3)?0:1];
                    context.fillRect(x, y , BlockWidth, BlockHeight);
                    context.strokeRect(x, y , BlockWidth, BlockHeight);
                    context.fillStyle = "Black";
                    context.font = "bold 14px Arial";
                    var text = DirectionLabels[i+3*j - 3];
                    if(text == ' C') {text = ' S'}
                    context.fillText(text, x+BlockWidth/4, y+BlockHeight/2);

        }
        x = x + BlockWidth + 3;
      }
      y = y + BlockHeight + 3;
    }
  }
  else{
    var y = 25;
    for (var j = 0; j < 3; j++){
      var x = 25;
      for (var i = 0; i < 3; i++){
        //alert("Key" + key + "val" +(i+3*j));
        context.fillStyle = BlockColor[(key==(i+3*j))?0:1];
        context.lineWidth = 1;
        context.strokeStyle = 'Black';
        context.fillRect(x, y , BlockWidth, BlockHeight);
        context.strokeRect(x, y , BlockWidth, BlockHeight);
        context.fillStyle = "Black";
        context.font = "bold 14px Arial";
        context.fillText(DirectionLabels[i+3*j], x+BlockWidth/4, y+BlockHeight/2);
        x = x + BlockWidth + 3;
      }
      y = y + BlockHeight + 3;
    }
  }
}
function drawMetrics(){
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height + 20;;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  context.clearRect ( 0 , 0 , width , height );
  context.fillStyle = "blue";
  context.font = "bold 16px Arial";
  var text_width = 20;

  var text = "Trial: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 2;

  text = Experiment.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 10;

  var text = "Hit: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 2;

  text = Hit.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 10;

  text = "Miss: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 2;

  text = Miss.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 25;

  text = "Recall: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 2;

  text = Recall.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 20);
  text_width = text_width + metrics.width + 25;

  text_width = 20;
  text = "Response Time: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 40);
  text_width = text_width + metrics.width + 2;

  text = ResponseTime.toFixed(3);
  metrics = context.measureText(text);
  context.fillText(text, text_width, 40);
  text_width = text_width + metrics.width + 2;

  text = " sec ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 40);
}
function getNeighbours(Direction){
  var Neighbour;
  switch(Direction){
    case 1://4 Neighbours
      Neighbour = [
        [1,0],
        [0,1],
        [-1,0],
        [0,-1]
      ];
      break;
    case 2://8 Neighbours
      Neighbour = [
        [1,0],
        [1,1],
        [0,1],
        [-1,1],
        [-1,0],
        [-1,-1],
        [0,-1],
        [1,-1]
      ];
      break;
  }
  return Neighbour;
}
function startExperiment(){
    document.getElementById("Volume").disabled = true;
    document.getElementById("Direction").disabled = true;
    document.getElementById("Level").disabled = true;
    document.getElementById("Samples").disabled = true;
    document.getElementById("Mode").disabled = true;
    document.getElementById("GenerateMaze").disabled = true;
    document.getElementById("StartExp").disabled = true;
    document.getElementById("Frequency_Difference").disabled = true;
    document.getElementById("ExportToCSV").disabled = true;
    NextCue();
    playSounds();
    CueTime =  new Date().getTime();
    next++;
    drawMetrics();
    drawControls(-1);
}
function findIndex(search_array,key){
    var index = -1;
    for(var i =0;i<search_array.length;i++){
        if(search_array[i] == key){
            index = i;
            break;
        }
    }
    return index;
}
function validateGenerate(){
    Direction = parseInt(document.getElementById("Direction").value);
    Level = parseInt(document.getElementById("Level").value);
    Samples = parseInt(document.getElementById("Samples").value);
    Mode = document.getElementById("Mode").value;
    FreqDiff = document.getElementById("Frequency_Difference").value;
    if(isNaN(Direction) || isNaN(Level) || isNaN(Samples) || Mode=="" || Level < 1 || Samples < 1 || isNaN(FreqDiff) || FreqDiff<1){
        alert("Please Enter Valid Input");
    }
    else{
        if(Mode == 'Training_CorrectVisualCue'){
            TrainingMode = 1;
            generateMaze();
        }
        if(Mode == 'Training_InCorrectVisualCue'){
            TrainingMode = 2;
            generateMaze();
        }
        if(Mode == 'Training_ComparativeSounds'){
            TrainingMode = 3;
            ComparativeTraining();
        }
        if(Mode == 'Before_Training' || Mode == 'Testing'){
            TrainingMode = 0;
            generateMaze();
        }
    }
}
function ExportToCSV() {
    var form_pd = document.ParticipantDetail;
    var Name = form_pd.PNAME.value;
    var csvRows = [];
    for(var i=0, l=A.length; i<l; ++i){
        csvRows.push(A[i].join(','));
    }
    var csvString = csvRows.join("%0A");
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' + csvString;
    a.target      = '_blank';
    a.download    = Name+'.csv';
    document.body.appendChild(a);
    a.click();

    var canvas = document.getElementById('Maze_Canvas');
    Canvas2Image.saveAsPNG(canvas);
    /*var data = canvas.toDataURL('image/png');
    var b         = document.createElement('b');
    b.href        = data;
    b.target      = '_blank';
    b.download    = Name+'_Maze'+'.png';
    document.body.appendChild(b);
    b.click();
*/
}
function saveResults(){
    document.getElementById("Direction").disabled = false;
    document.getElementById("Level").disabled = false;
    document.getElementById("Samples").disabled = false;
    document.getElementById("Mode").disabled = false;
    document.getElementById("Frequency_Difference").disabled = false;
    document.getElementById("GenerateMaze").disabled = false;
    document.getElementById("StartExp").disabled = true;
    A.push([Experiment,Direction,Level,Mode,Samples,TotalSteps,Hit,Miss,100*Hit/(Hit+Miss),Recall,ResponseTime,ResponseTime/TotalSteps,FreqDiff]);
    SaveInSpreadSheet();
    Experiment++;
    next = 0;
    Hit = 0;
    Miss = 0;
}
function SaveInSpreadSheet(){
    var form_pd = document.ParticipantDetail;
    var Name = form_pd.PNAME.value;
    var AGE = form_pd.PAGE.value;
    var PGENDER = form_pd.PGENDER.value;
    var PType = form_pd.PType.value;
    var PMusic = form_pd.PMusic.value;
    $.ajax({
        type: "POST",
        url: "https://docs.google.com/forms/d/1HYqxuBrAA3idjzjqBLwCEGcnnL_WbOL6oCrBBvMF7sI/formResponse",
        data: {
            'entry.1510859924':Name,
            'entry.778651428':AGE,
            'entry.986303272':PGENDER,
            'entry.1076935975':PType,
            'entry.929436468':PMusic,
            'entry.1891787709':Experiment,
            'entry.737175385':Direction,
            'entry.340027160':Level,
            'entry.683725841':Mode,
            'entry.2045031371':Samples,
            'entry.652331003':TotalSteps,
            'entry.602285332':Hit,
            'entry.1475633329':Miss,
            'entry.576205458':100*Hit/(Hit+Miss),
            'entry.1073508233':Recall,
            'entry.2128413320':ResponseTime,
            'entry.1591415018':ResponseTime/TotalSteps,
            'entry.1242321072':FreqDiff
        }
    });
}
document.onkeyup = function(event){
    var waitTime = new Date().getTime();
    if(next>TotalSteps){
        document.getElementById("ExportToCSV").disabled = false;
        saveResults();
        next = 0;
        Hit = 0;
        Miss = 0;
        ResponseTime = 0;
        CurrentCuePos = 0;
        count=0;Recall=0;
        if(TrainingMode == 2){
          drawCorrectMaze(MazeLength,Path);
        }
        else{
          TrainingMode = -1;
          drawMaze(Maze,MazeLength);
        }
    }
    var key_press = String.fromCharCode(event.keyCode);
    var key_code = event.keyCode;
    //console.log("next:"+next);
    //console.log("currpos:"+CurrentCuePos);
    if(next){
        var x =  Path[next-1][0];
        var y = Path[next-1][1];
        var cue_x = Cue[next-1][0];
        var cue_y = Cue[next-1][1]*-1;
        var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
        var key_index_a = findIndex(inputDirection_a,key_code);
        var key_index_b = findIndex(inputDirection_b,key_code);
        var cue_index = findIndex(expectedDirection,cue_code);
        if(key_index_a == cue_index || key_index_b == cue_index){
            IntervalTime = IntervalTime + (waitTime - CueTime )/1000;
            CueTime = new Date().getTime();
            count++;
            Hit++;
            Maze[x][y] = 3;
        }
        else{
            IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
            CueTime = new Date().getTime();
            playError();
            Miss++;
            count--;
            Maze[x][y] = 4;
        }
        if(count==Level){Recall++;count=0;}
        drawMaze(Maze,MazeLength);
        drawMetrics();
        drawControls(key_index_a>key_index_b?key_index_a:key_index_b);
        if(next==CurrentCuePos && CurrentCuePos<TotalSteps){
            //alert(CurrentCuePos);
            ResponseTime = ResponseTime + IntervalTime;
            IntervalTime = 0;
            count=0;
            NextCue();
            playSounds();
            CueTime =  new Date().getTime();
        }
        next++;
    }
    else{
        if((key_code == 12 || key_code == 101) && !document.getElementById("StartExp").disabled){
            startExperiment();
        }
    }
}
function NextCue(){
    // alert('Experiment started' + TotalSteps+'Level'+Level);
     for(var i=0;i<Level;i++){
        if(TrainingMode == 2){
          var inc = 1;
          do{
            var Neighbour = getNeighbours(Direction);
            var NoOfNbr = Neighbour.length;
            var IncorrectNbr =  Math.floor(Math.random()*NoOfNbr);
            //alert('Next Neighbour ' + NextNbr);
            var incorrect_x = inc_sx + Neighbour[IncorrectNbr][0];
            var incorrect_y = inc_sy + Neighbour[IncorrectNbr][1];
            if(incorrect_x >= 0 && incorrect_x < MazeLength){
              if(incorrect_y >= 0 && incorrect_y < MazeLength){
                Maze[incorrect_x][incorrect_y] = 2;
                inc_sx = Path[next+i][0];
                inc_sy = Path[next+i][1];
                inc = 0;
              }
            }
          }while(inc);
        }
        else{
          var x =  Path[next+i][0];
          var y = Path[next+i][1];
          Maze[x][y] = 2;
        }
        var cue_x = Cue[next+i][0];
        var cue_y = Cue[next+i][1]*-1;
        //alert('x' + cue_x +'y'+ cue_y);
        if(i<Level-1){
            AddSilence();
        }
        AddCueWave(cue_x,cue_y,1);
        drawMaze(Maze,MazeLength);
    }
    CurrentCuePos = CurrentCuePos + Level;
}
function playError(){
    var audio = new Audio("1.wav");
    audio.load();
    audio.play();
}
function AddSilence(){
    Sounds.push("silent.wav");
}
function AddCueWave(x,y,z){
    var data = new Array();
    var seconds = x==0?1:0.5;
    var frequencyHz = pitch[y+1];
    var amplitude = volume*z;
    var wave_sample=0;
    var j=0;
    for (var i = 0; i < rate * seconds;i++) {
        wave_sample = Math.round(128 + 127 * Math.sin(i * 2 * Math.PI * frequencyHz / rate)*amplitude);
        //setting the pan for each channel
        switch(x){
            case -1://left speaker
                data[j++] = wave_sample;//(0.5 - balance);
                data[j++] = 0;//(0.5 + balance);
                break;
            case 0://both
                data[i] = wave_sample;//(0.5 - balance);
                //data[j++] = sample;//(0.5 + balance);
                break;
            case 1://right speaker
                data[j++] = 0;//(0.5 - balance);
                data[j++] = wave_sample;//0;//(0.5 + balance);
                break;

        }
    }
    var wave = new RIFFWAVE();   //riffwave variable
    wave.header.sampleRate = rate;
    wave.header.numChannels = 2;
    wave.header.bitsPerSample = 16;
    wave.Make(data);
    Sounds.push(wave.dataURI);
}
function playSounds(){
    var audioEl = document.getElementById('audio');
    audioEl.load();
    //audioEl.removeEventListener('ended', playSounds);
    //console.log("sound"+Sounds[counter]);
    if(Sounds[counter]){
        audioEl.src = Sounds[counter];
        audioEl.addEventListener('ended', playSounds);
        audioEl.play();
        //console.log("played"+Sounds[counter]);
        counter++;
    }
}
function drawCorrectMaze(MazeLength,Path){
  var CrrMaze = new Array(MazeLength);
  for(var i = 0; i<MazeLength;i++){
    CrrMaze[i] = new Array(MazeLength);
    for(var j = 0; j<MazeLength;j++){
      CrrMaze[i][j] = 6;
    }
  }
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.width;
  var height = canvas.height;
  var context = canvas.getContext('2d');
  var BlockWidth = Math.ceil((width - 50 - 18 * MazeLength)/MazeLength);
  var BlockHeight = Math.ceil((height - 50 - 18 * MazeLength)/MazeLength);
  var BlockColor = ['Yellow','Black','Orange','Green','Red','Blue','White'];
  canvas.style.border = "black 5px solid";
  context.beginPath();
  CrrMaze[start_x][start_y] = 5;
  for(var i=0;i<Path.length;i++){
    var pos_x = Path[i][0];
    var pos_y = Path[i][1];
    CrrMaze[pos_x][pos_y] = 0;
  }
  //alert(MazeLength);
  var y = 40;
  for (var j = 0; j < MazeLength; j++){
    var x = 40;
    for (var i = 0; i < MazeLength; i++){
      if(CrrMaze[i][j] == 0 || CrrMaze[i][j] == 5){
        context.fillStyle = BlockColor[CrrMaze[i][j]];
        context.lineWidth = 1;
        context.strokeStyle = 'Black';
        context.fillRect(x, y , BlockWidth, BlockHeight);
        context.strokeRect(x, y , BlockWidth, BlockHeight);
      }
      x = x + BlockWidth + 18;
    }
    y = y + BlockHeight + 18;
  }
}
function ComparativeTraining(){
    document.getElementById("StartExp").disabled = false;
    Direction = parseInt(document.getElementById("Direction").value);
    Level = 1;
    var Neighbour = getNeighbours(Direction);
    var NoOfNbr = Neighbour.length;
    Samples = NoOfNbr;
    TotalSteps = Level * Samples;
    var Blocks = 1+Direction * TotalSteps;
    MazeLength = Math.ceil(Math.sqrt(Blocks));
    next = 0;
    Hit = 0;
    Miss = 0;
    ResponseTime = 0;
    CurrentCuePos = 0;
    count = 0;
    Recall = 0;
    counter = 0;
    Sounds = [];
    var midx = Math.floor(MazeLength/2);
    var midy = Math.floor(MazeLength/2);
    Maze = new Array(MazeLength);
    for(var i = 0; i<MazeLength;i++){
        Maze[i] = new Array(MazeLength);
        for(var j = 0; j<MazeLength;j++){
            Maze[i][j] = 6;
        }
    }
    Maze[midx][midy]=5;
    Path =  new Array(NoOfNbr);
    Cue = Neighbour;
    for(var i = 0; i<NoOfNbr;i++){
      Path[i] =  new Array(2);
      var x = midx+Cue[i][0];
      var y = midy+Cue[i][1];
      Path[i][0] = x;
      Path[i][1] = y;
      Maze[x][y] = 0;
    }
    drawMaze(Maze,MazeLength);
}
/*
if (sound instanceof Array) {
    audio.src = sound.shift();
    audio.play;
    if (sound.length) {
        audio.addEventListener('ended', function () {
            playSound(sound);
        });
    }
}

 var elems = [], index = 0
 for (var i = 0; i < 4; i++) elems.push(new Audio('x.wav'))

 function playSoundEvent() {
 elems[index].play()
 index = (index + 1) % elems.length
 }

 function playSoundEvent() {
 if (window.chrome) elems[index].load()
 elems[index].play()
 index = (index + 1) % elems.length
 }


 */
/*function nextSong() {
 audioEl.removeEventListener('ended', nextSong);

 if (songs[++counter]) {
 audioEl.src = songs[counter];
 audioEl.addEventListener('ended', nextSong);
 audioEl.play();
 } else {
 alert('All done!');
 }
 }*/