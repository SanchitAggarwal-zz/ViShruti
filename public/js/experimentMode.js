// Experiment Parameters
var ExperimentModeList = {'Audio_Error_FeedBack':1,
                          'Visual_Error_FeedBack':2,
                          'User_Directed':3,
                          'UnSupervised':4,
                          'No_Training':5,
                          'Testing':6,
                          'InCorrectVisualCue':7};

var WorkingMemoryList = {'WM_Order_Ascending':8,
                         'WM_Order_Descending':9,
                         'WM_Order_Random':10};

var ExperimentMode,WorkingMemory,NoOfTrial,AccuracyThreshold,Reverse;
var DisplayGrid = 0,VisualError = 0,AudioError = 0;  // Flag for Visual or Error Feedback and DisplayGrid
var ExperimentResults = []; //To Store the Experiment Results and Export it to CSV or Spreadsheet
var ExperimentEnd = 0;
var WM_StepsInEachCue = [2,4,6,8,10];
var initialNoofSteps = 10;
var VisualCue = 0;  //if 0 no visual cue, 1 - correct visual cue, 2 - incorrect visual cue
// Participant Details
var Form_pd,NAME,AGE,PGENDER,PTYPE,PMUSIC;
var ExperimentTime = 0;
var AvgAccuracy = 0;
var ExperimentSeq = [];
var TrialSeq = [];

// To Validate Experiment Parameters
function validateExperimentParams(){
    ExperimentMode = document.getElementById("ExperimentMode").value;
    WorkingMemory = document.getElementById("WorkingMemory").value;
    NoOfTrial = parseInt(document.getElementById("NoOfTrial").value);
    AccuracyThreshold = parseInt(document.getElementById("AccuracyThreshold").value);
    Reverse = document.getElementById("Reverse").checked;
    if(ExperimentMode=="" || WorkingMemory=="" || isNaN(NoOfTrial) || isNaN(AccuracyThreshold) || NoOfTrial <1 || AccuracyThreshold <60){
        alert("Please Enter Valid Experiment Parameters");
    }
    else{
        //call start experiment
        startExperiment();
    }
}
// To Set Display and Error
function setDisplayAndError(Key){
    switch(Key){
        case 1:DisplayGrid = 1; VisualError = 0; AudioError = 1; VisualCue = 0; break;
        case 2:DisplayGrid = 1; VisualError = 1; AudioError = 0; VisualCue = 0; break;
        case 3:DisplayGrid = 1; VisualError = 0; AudioError = 0; VisualCue = 1; break;
        case 4:DisplayGrid = 1; VisualError = 0; AudioError = 0; VisualCue = 0; break;
        case 5:DisplayGrid = 1; VisualError = 0; AudioError = 0; VisualCue = 0; break;
        case 6:DisplayGrid = 1; VisualError = 0; AudioError = 0; VisualCue = 0; break;
        case 7:DisplayGrid = 1; VisualError = 0; AudioError = 0;VisualCue = 2;break;
        case 8:DisplayGrid = 1; VisualError = 0; AudioError = 0; VisualCue = 0; break;
        case 9:DisplayGrid = 1; VisualError = 0; AudioError = 0; WM_StepsInEachCue.reverse(); VisualCue = 0; break;
        case 10:DisplayGrid = 0; VisualError = 0; AudioError = 0;VisualCue = 0; break;
    }
}
// To validate Participant Details
function participantDetails(){
    Form_pd = document.ParticipantDetail;
    NAME = Form_pd.PNAME.value;
    AGE = Form_pd.PAGE.value;
    PGENDER = Form_pd.PGENDER.value;
    PTYPE = Form_pd.PTYPE.value;
    PMUSIC = Form_pd.PMUSIC.value;
    if(isNaN(AGE) || NAME == "" || PGENDER == "" || PTYPE == "" || PMUSIC == "" || AGE<1 || !isNaN(NAME)){
        alert("Please Enter Valid Participant Details");
    }
    else{
        ExperimentResults.push(['NAME','AGE','GENDER','PARTICIPANT TYPE','ACCUSTOM TO MUSIC']);
        ExperimentResults.push([NAME,AGE,PGENDER,PTYPE,PMUSIC]);
        ExperimentResults.push(['Experiment#','Direction','#Level','Experiment Mode','#Samples','Total Steps','#Hit','#Miss','Accuracy','Recall','ResponseTime(in Sec)','Average Response Time (in Sec)','FreqDiff(initial 440)']);
        $('#contactModal').modal('hide');
        if ($(".fa-user").hasClass('detailsAdded') == false) {
            $(".fa-user").addClass('detailsAdded');
        }
        enableExperimentParams();
    }
}
// To Enable Experiment Parameters Control
function enableExperimentParams(){
    document.getElementById("ExperimentMode").disabled = false;
    document.getElementById("WorkingMemory").disabled = false;
    document.getElementById("NoOfTrial").disabled = false;
    document.getElementById("AccuracyThreshold").disabled = false;
    document.getElementById("StartExp").disabled = false;
    document.getElementById("SavePD").disabled = true;
}
// To Stop Experiment In Between
function stopExperiment(){
    if(ExperimentEnd){
        document.getElementById("StopExp").disabled = true;
        document.getElementById("StartExp").disabled = false;
        $('#StopExp').removeClass('btn-primary');
        $('#StopExp').addClass('btn-default');
        $('#StartExp').removeClass('btn-default');
        $('#StartExp').addClass('btn-primary');
        //saveExperimentResults
        ExperimentTime = (new Date().getTime() - ExperimentTime)/1000;
        alert("Experiment Finished !! \nThank You For Participating\nYou Took : " + ExperimentTime/60 + " Minutes");
        stopExperiment();
        //Reload the page
        location.reload();
    }
    else{
        var r=confirm("Experiment Not Yet Finished !!\nConfirm To Stop Experiment In Between !!");
        if (r==true){
            ExperimentEnd = 1;
            stopExperiment();  // call stop experiment again
        }
    }
}

function startExperiment(){
    document.getElementById("StopExp").disabled = false;
    document.getElementById("StartExp").disabled = true;
    $('#StartExp').removeClass('btn-primary');
    $('#StartExp').addClass('btn-default');
    $('#StopExp').removeClass('btn-default');
    $('#StopExp').addClass('btn-primary');
    alert("Experiment Is Going to start, Get Ready with Controls");
    ExperimentTime = new Date().getTime();
   if(Reverse){
        //Run working memory first  and then testing only
        ExperimentSeq = [WorkingMemory,ExperimentMode,'Testing'];
        TrialSeq = [1,NoOfTrial,1];
    }
    else{
        //Run training,testing and then working memory at last
        ExperimentSeq = [ExperimentMode,'Testing',WorkingMemory];
        TrialSeq = [NoOfTrial,1,1];
    }
    if(ExperimentMode == 'Testing' || ExperimentMode == 'No_Training'){
        ExperimentSeq.splice(1, 1);
        TrialSeq.splice(1, 1);
    }
}

function runMode(CueLength,PathLength,Direction,Trial,Threshold,Mode){
  var i = 1;
  while( i <= Trial && AvgAccuracy < Threshold) {
    var metrics = run_trial(i,CueLength,PathLength,Direction,Mode);
    i++;
  }
}

function workingMemoryTest(Direction){
  //alert("Working Memory Test : "+ Direction +" Direction are Used");
  for(var i = 0;i<WM_StepsInEachCue.length;i++){
    var CueLength =  WM_StepsInEachCue[i];
    var PathLength = CueLength * initialNoofSteps;
    runMode(CueLength,PathLength,Direction,1,100,WorkingMemory);
  }
}

function ExperimentModeTest(){
  do{
    var Key = ExperimentModeList[ExperimentMode];
    setDisplayAndError(Key);
    if(Key == 5 || Key == 6){
      ExperimentEnd = 1;
      for(var dir = 4;dir<=8;dir=dir+4){
        alert(ExperimentMode + " : " + dir +" Direction are Used");
        runMode(1,initialNoofSteps,dir,1,AccuracyThreshold,ExperimentMode);
        runMode(1,initialNoofSteps+70,dir,1,AccuracyThreshold,ExperimentMode);
        runMode(1,initialNoofSteps+150,dir,1,AccuracyThreshold,ExperimentMode);
      }
    }
    else {
      for(var dir = 4;dir<=8;dir=dir+4){
        alert(ExperimentMode + " : " + dir + " Direction are Used");
        runMode(1,initialNoofSteps,dir,NoOfTrial,AccuracyThreshold,ExperimentMode);
      }
      ExperimentMode = "Testing";
    }
  }while(!ExperimentEnd); alert("Experiment Mode Ended");
}

function saveExperimentResults(){

}


var Maze,Path,Cue,Direction,Level,TotalSteps,MazeLength;
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
var Experiment;
var Metrics =[];
var Sounds = [];
var CurrentCuePos = 0;
var counter = 0;
var start_x,start_y,inc_sx,inc_sy;
var PrintMode;

function run_trial(Trial,CueLength,PathLength,Dir,Mode){
  Level = CueLength;
  Direction =   Dir;
  TotalSteps = PathLength;
  Experiment = Trial;
  PrintMode = Mode;
  var MazeDiv = document.getElementById('MazeDiv');
  console.log(DisplayGrid);
  if(DisplayGrid==0){
    MazeDiv.style.visibility = 'hidden'; // hide, but let the element keep its size

  }
  else{
    MazeDiv.style.visibility = 'visible';
  }
  generateMaze();
  drawMaze(Maze,MazeLength);
  drawMetrics();
  drawControls(-1);
  do{
    drawMaze(Maze,MazeLength);
    drawMetrics();
    drawControls(-1);
  }while(next<=TotalSteps);
  Metrics = [Hit,Miss,100*Hit/(Hit+Miss),Recall,ResponseTime,ResponseTime/TotalSteps];
  next = 0;
  Hit = 0;
  Miss = 0;
  ResponseTime = 0;
  CurrentCuePos = 0;
  count=0;Recall=0;
//  if(VisualCue == 2){
//    drawCorrectMaze(MazeLength,Path);
//  }
  return Metrics;
}
function generateMaze(){
  var Blocks = 4 * TotalSteps;
  MazeLength = Math.ceil(Math.sqrt(Blocks));
  var Neighbour = getNeighbours(Direction/4);
  var NoOfNbr = Neighbour.length;
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
  drawMetrics();
  next = 0;
  Hit = 0;
  Miss = 0;
  ResponseTime = 0;
  CurrentCuePos = 0;
  count = 0;
  Recall = 0;
  counter = 0;
  Sounds = [];
  //alert("Maze Generated");
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
  context.clearRect ( width , 0 , canvas.width - width , height );
  context.fillStyle = "blue";
  context.font = "bold 16px Arial";
  var text_width = width;

  var text = "Mode: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 25);
  text_width = text_width + metrics.width + 2;

  text = PrintMode.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 25);
  text_width = text_width + metrics.width + 10;

  var text_width = width;

  var text = "Trial: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  text = Experiment.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 10;

  var text = "Hit: ";
  var metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  text = Hit.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 10;

  text = "Miss: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  text = Miss.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  text = "Recall: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 2;

  text = Recall.toString();
  metrics = context.measureText(text);
  context.fillText(text, text_width, 45);
  text_width = text_width + metrics.width + 25;

  text_width = width;
  text = "Response Time: ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);
  text_width = text_width + metrics.width + 2;

  text = ResponseTime.toFixed(3);
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);
  text_width = text_width + metrics.width + 2;

  text = " sec ";
  metrics = context.measureText(text);
  context.fillText(text, text_width, 65);
}
function NextCue(){
  // alert('Experiment started' + TotalSteps+'Level'+Level);
  for(var i=0;i<Level;i++){
    if(VisualCue==2){
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
      if(VisualCue==1){ Maze[x][y] = 2;}
    }
    var cue_x = Cue[next+i][0];
    var cue_y = Cue[next+i][1]*-1;
    //alert('x' + cue_x +'y'+ cue_y);
    if(i<Level){
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
function drawCorrectMaze(MazeLength,Path){
  var CrrMaze = new Array(MazeLength);
  for(var i = 0; i<MazeLength;i++){
    CrrMaze[i] = new Array(MazeLength);
    for(var j = 0; j<MazeLength;j++){
      CrrMaze[i][j] = 6;
    }
  }
  var canvas = document.getElementById('Maze_Canvas');
  var width = canvas.height;
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



document.onkeyup = function(event){
  var waitTime = new Date().getTime();
  var key_press = String.fromCharCode(event.keyCode);
  var key_code = event.keyCode;
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
      if(VisualError){Maze[x][y] = 3;}
    }
    else{
      IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
      CueTime = new Date().getTime();
      if(AudioError){playError();}
      Miss++;
      count--;
      if(VisualError){Maze[x][y] = 4;}
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
}

