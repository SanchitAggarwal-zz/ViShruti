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

    //Reload the page
    //location.reload();
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
    var Key = WorkingMemoryList[WorkingMemory];
    setDisplayAndError(Key);
    workingMemoryTest(4);
    workingMemoryTest(8);
    ExperimentModeTest();
  }
  else{
    //Run training,testing and then working memory at last
    ExperimentModeTest();
    var Key = WorkingMemoryList[WorkingMemory];
    setDisplayAndError(Key);
    workingMemoryTest(4);
    workingMemoryTest(8);
  }
  ExperimentTime = (new Date().getTime() - ExperimentTime)/1000;
  alert("Experiment Finished !! \nThank You For Participating\nYou Took : " + (ExperimentTime/60).toFixed(3) + " Minutes");
  stopExperiment();
}

function runMode(CueLength,PathLength,Direction,Trial,Threshold,Mode){
  var i = 1;
  while( i <= Trial && AvgAccuracy < Threshold) {
    var metrics = run_trial(i,CueLength,PathLength,Direction,DisplayGrid,AudioError,VisualError,VisualCue,Mode);
    i++;
  }
}

function workingMemoryTest(Direction){
  alert("Working Memory Test : "+ Direction +" Direction are Used");
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
