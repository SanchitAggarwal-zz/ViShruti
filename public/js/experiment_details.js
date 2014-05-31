var ExperimentMode,SelectedMode,InterStimulusInterval='',InterTrialInterval = '500',StartTime,StopTime,TotalTime,BestISI = '';
var NoOfWMMaps = 3,NoOfDemoMaps = 2,NoOfTrainingMaps = 40, NoOfTestingMaps = 3;
var WM_PathLength = 35, Training_PathLength = 10, Testing_PathLength = 50;
var AccuracyThreshold = 90, ConsecutiveMap = 2;
var Staircase, Staircase_PathLength = 210,NoOfStaircaseMaps = 1, StaircaseCueLength = 3,StaircaseAccuracy = 80;
var StaircaseDistance = 100,Collision_PathLength = 30, CollisionMap = 1, Collision = false;
var	ExperimentDetails = [],ISID = [],ExperimentData = [], Folder_Name = '', File_Name = '';
var BreakTime = 2; //2 minutes break between each switch
var ISID_Head = "USERID,InterStimulusInterval,TimeStamp",
	  ExperimentDetails_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,#_of_Maps,Trial_per_Map,Total_Trials,ISI,ITI," +
															"StartTime,StopTime,TotalTime,BreakTime",
		ExperimentData_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,TRIAL_NO,MAP_NO,TRIAL_LENGTH,S1,S2,S3,S4,S5," +
													"S6,S7,S8,R1,R2,R3,R4,R5,R6,R7,R8,T1,T2,T3,T4,T5,T6,T7,T8,TotalResponseTime,HIT,MISS,RECALL",
		Folder_Name = GROUPID + '/' + USERID + '/';
		File_Name = GROUPID + '_' + PHASENO + '.csv';

// To disable/enable experiment details
function disableED(flag){
	document.getElementById("ExperimentMode").disabled = flag;
	document.getElementById("NoOfWMMaps").disabled = flag;
	document.getElementById("NoOfDemoMaps").disabled = flag;
	document.getElementById("NoOfTrainingMaps").disabled = flag;
	document.getElementById("AccuracyThreshold").disabled = flag;
	document.getElementById("Staircase").disabled = flag;
	document.getElementById("StartExp").disabled = flag;
	document.getElementById("SavePD").disabled = !flag;
	document.getElementById("Staircase").checked = false;
	document.getElementById("NoOfWMMaps").value = 3;
	document.getElementById("NoOfDemoMaps").value = 2;
	document.getElementById("NoOfTrainingMaps").value = 40;
	document.getElementById("AccuracyThreshold").value = 90;
}

// To Change Experiment Mode Options
function EMOptions(value){
	var selectEM =  document.getElementById("ExperimentMode");
	var elvalue,eltext;
	switch(value){
		case "SVEF":  elvalue = "Visual_Error_FeedBack_Training";
									eltext = "Visual Error FeedBack Training";
									break;
		case "SAEF":
		case "NSAEF": elvalue = "Audio_Error_FeedBack_Training";
								  eltext = "Audio Error FeedBack Training";
									break;

		case "SUS":
		case "NSUS":  elvalue = "UnSupervised_Training";
									eltext = "UnSupervised Training";
									break;
		case "SNT":
		case "NSNT":  elvalue = "No_Training";
									eltext = "No Training";
									break;
	}
	var el = document.createElement("option");
	el.text = eltext;
	el.value = elvalue;
	selectEM.appendChild(el);
}

// On change of Experiment Mode
function EM_change(){
	if(document.getElementById("ExperimentMode").value == "Working_Memory"){
		document.getElementById("NoOfWMMaps").disabled = false;
		document.getElementById("NoOfDemoMaps").disabled = false;
		document.getElementById("NoOfTrainingMaps").disabled = true;
		document.getElementById("AccuracyThreshold").disabled = true;
		document.getElementById("Staircase").disabled = false;
	}
	else if(document.getElementById("ExperimentMode").value == "Testing"){
		document.getElementById("NoOfWMMaps").disabled = true;
		document.getElementById("NoOfDemoMaps").disabled = false;
		document.getElementById("NoOfTrainingMaps").disabled = true;
		document.getElementById("AccuracyThreshold").disabled = true;
		document.getElementById("Staircase").disabled = true;
	}
	else{
		document.getElementById("NoOfWMMaps").disabled = true;
		document.getElementById("NoOfDemoMaps").disabled = false;
		document.getElementById("NoOfTrainingMaps").disabled = false;
		document.getElementById("AccuracyThreshold").disabled = false;
		document.getElementById("Staircase").disabled = true;
	}
}

// For Staircase of Inter Stimulus Interval
function getISI(){
	ISID = [];
	$.get('http://localhost:3000/readISIDetails', function(ISI_Result) {
		if(ISI_Result.length != 0)
		{
			ISI_Result = ISI_Result.split('\n');
			for(var i=0; i<ISI_Result.length;++i){
				ISID.push(ISI_Result[i].split(','));
				if(i>0 && ISID[i][0]==USERID && ISID[i][1] != '' ){// Select Inter Stimulus Interval
					BestISI = ISID[i][1];
					break;
				}
			}
		}
	});
}
// To Validate Experiment Parameters
function validateExperimentDetails(){
	ExperimentMode = document.getElementById("ExperimentMode").value;
	SelectedMode = document.getElementById("ExperimentMode").value;
	Staircase = document.getElementById("Staircase").checked;
	NoOfWMMaps = parseInt(document.getElementById("NoOfWMMaps").value);
	NoOfDemoMaps = parseInt(document.getElementById("NoOfDemoMaps").value);
	NoOfTrainingMaps = parseInt(document.getElementById("NoOfTrainingMaps").value);
	AccuracyThreshold = parseInt(document.getElementById("AccuracyThreshold").value);
	if(PHASENO == 'Phase_1' && !Staircase)
    { alert("Please check ISI Staircase for selection of Inter Stimulus Interval");}
	else{
		getISI();
  }
	if(BestISI == '' && PHASENO == 'Phase_3')
	{alert("Please check ISI Staircase for selection of Inter Stimulus Interval");}
	else if(ExperimentMode=="" || isNaN(NoOfWMMaps) || isNaN(NoOfDemoMaps) || isNaN(NoOfTrainingMaps)|| isNaN(AccuracyThreshold) || NoOfWMMaps <3 || AccuracyThreshold <60 || NoOfDemoMaps <2 || NoOfTrainingMaps <20){
		alert("Please Enter Valid Experiment Parameters");
	}
	else {
		StartTime = new Date().getTime();
		if(BestISI == ''){BestISI = InterTrialInterval;console.log("BEST ISI value: "+BestISI);}
		initialize();
		startExperiment();
	}
}

function saveExperimentResults(){
	for(var i=3;i<ExperimentResults.length;i++){
		$.ajax({
			type: "POST",
			//url: "https://docs.google.com/forms/d/1HYqxuBrAA3idjzjqBLwCEGcnnL_WbOL6oCrBBvMF7sI/formResponse",
			url: "https://docs.google.com/forms/d/1XCgK4jjuhv2BBwQ8Muzmz2zMhmX3C6sf7pyf1Y6UhWE/formResponse",
			data: {
				'entry.452712856' :USERID,
				'entry.1217543975':AGE,
				'entry.1047119998':EDUCATION,
				'entry.1297203076':MODEOFCOMM,
				'entry.1383316539':GENDER,
				'entry.453829439' :PARTICIPANT_TYPE,
				'entry.481881047' :MUSICAL_TRAINING,
				'entry.1963578379':MUSIC_KIND,
				'entry.437891093' :HEARING_PROBLEM,
				'entry.518374845' :KEYBOARD_FAMILIARITY,
				'entry.281696488' :ExperimentResults[i][0], //Index#
				'entry.501651834' :ExperimentResults[i][1], //Direction
				'entry.486615617' :ExperimentResults[i][2], //Cue Length
				'entry.56018046'  :ExperimentResults[i][3], //Experiment Mode
				'entry.1372960057':ExperimentResults[i][4], //Accuracy Threshold
				'entry.561470756' :ExperimentResults[i][5], //Total Steps
				'entry.1450128684':ExperimentResults[i][6], //#Hit
				'entry.631366225' :ExperimentResults[i][7], //#Wrong Response
				'entry.740927359' :ExperimentResults[i][8], //Accuracy
				'entry.481811278' :ExperimentResults[i][9], //Recall
				'entry.1724321037':ExperimentResults[i][10],//ResponseTime(in Sec)
				'entry.1184871699':ExperimentResults[i][11],//Average Response Time (in Sec)
				'entry.1943108855':ExperimentResults[i][12],//No of Training Maps
				'entry.239911530' :ExperimentResults[i][13],//Input Time per response
				'entry.786668683' :ExperimentResults[i][14],//Cue Direction Labels
				'entry.2065638177':ExperimentResults[i][15],//Input Direction Labels
				'entry.1313234140':ExperimentResults[i][16],//InterStimulusInterval
				'entry.263350514':ExperimentResults[i][17],// Average Accuracy after Nth Map
				'entry.1348081382':InterTrialInterval // Inter Trial Interval
			}
		});
	}

	var csvRows = [];
	for(var i=0, l=ExperimentResults.length; i<l; ++i){
		csvRows.push(ExperimentResults[i].join(';'));
	}
	var csvString = csvRows.join("%0A");
	var savecsv         = document.createElement('a');
	savecsv.href        = 'data:attachment/csv,' + csvString;
	savecsv.target      = '_blank';
	savecsv.download    = USERID +'.csv';
	document.body.appendChild(savecsv);
	savecsv.click();
	alert("Your results are saved successfully");
}

function initialize(){
	var ISID_Head,ExperimentDetails_Head,ExperimentData_Head;
	ISID_Head = "USERID,InterStimulusInterval,TimeStamp";
	ExperimentDetails_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,#_of_Maps,Trial_per_Map,Total_Trials,ISI,ITI," +
		"StartTime,StopTime,TotalTime,BreakTime";
	ExperimentData_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,TRIAL_NO,MAP_NO,TRIAL_LENGTH,S1,S2,S3,S4,S5," +
		"S6,S7,S8,R1,R2,R3,R4,R5,R6,R7,R8,T1,T2,T3,T4,T5,T6,T7,T8,TotalResponseTime,HIT,MISS,RECALL";
	Folder_Name = GROUPID + '/' + USERID + '/';
	File_Name = GROUPID + '_' + PHASENO + '.csv';

	$.ajax({
		type: 'POST',
		data: {'ISID': ISID_Head,
					 'ExperimentDetails': ExperimentDetails_Head,
					 'ExperimentData': ExperimentData_Head,
					 'Folder_Name': Folder_Name,
					 'File_Name' : File_Name},
		url: 'http://localhost:3000/initialize',
		success: function(data) {
			console.log('success');
			alert(data);
		}
	});
}