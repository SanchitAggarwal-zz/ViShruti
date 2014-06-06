var ExperimentMode,SelectedMode,InterStimulusInterval='',InterTrialInterval = '500',StartTime,StopTime,TotalTime,BestISI = '';
var NoOfWMMaps = 3,NoOfDemoMaps = 2,NoOfTrainingMaps = 40, NoOfTestingMaps = 3;
var WM_PathLength = 35, Training_PathLength = 10, Testing_PathLength = 50;
var AccuracyThreshold = 90, ConsecutiveMap = 2;
var Staircase, Staircase_PathLength = 210,NoOfStaircaseMaps = 1, StaircaseCueLength = 3,StaircaseAccuracy = 80;
var StaircaseDistance = 100,Collision_PathLength = 30, CollisionMap = 1, Collision = false;
var	ExperimentDetails = [],ISID = [],ExperimentData = [];
var BreakTime = 2; //2 minutes break between each switch
var ISID_Head = "USERID,InterStimulusInterval,TimeStamp",
	  ExperimentDetails_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,#_of_Maps,Trial_per_Map,Total_Trials,ISI,ITI," +
															"StartTime,StopTime,TotalTime,BreakTime",
		ExperimentData_Head = "USERID,GROUPID,PHASENO,EXPERIMENT_MODE,TRIAL_NO,MAP_NO,TRIAL_LENGTH,S1,S2,S3,S4,S5," +
													"S6,S7,S8,R1,R2,R3,R4,R5,R6,R7,R8,T1,T2,T3,T4,T5,T6,T7,T8,TotalResponseTime,HIT,MISS,RECALL",
		ParticipantDetails_Head = "USER_ID,GROUP_ID,FIRST_NAME,LAST_NAME, AGE,EDUCATION,MODE_OF_COMMUNICATION,GENDER," +
			"PARTICIPANT_TYPE,MUSICAL_TRAINING,MUSIC_KIND,HEARING_PROBLEM,USER_CONTROL,PHASE NUMBER,Given Consent,TimeStamp";
var ISID_Filename = 'ISI_Details.csv',ExperimentDetails_Filename = 'ExperimentDetails.csv';
var ExperimentData_Filename,User_DataFolder;

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
	if(PHASENO != 'Phase_2'){
		elvalue = "Working_Memory";
		eltext = "Working Memory";
	}
	else{
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
	$.get(url+read,{ Name: ISID_Filename }, function(ISI_Result) {
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
		if(BestISI == '' && PHASENO == 'Phase_3' && !Staircase)
		{alert("Please check ISI Staircase for selection of Inter Stimulus Interval");}
		else if(ExperimentMode=="" || isNaN(NoOfWMMaps) || isNaN(NoOfDemoMaps) || isNaN(NoOfTrainingMaps)|| isNaN(AccuracyThreshold) || NoOfWMMaps <3 || AccuracyThreshold <60 || NoOfDemoMaps <2 || NoOfTrainingMaps <20){
			alert("Please Enter Valid Experiment Parameters");
		}
		else {
			StartTime = new Date().getTime();
			if(BestISI == ''){BestISI = InterTrialInterval;console.log("BEST ISI value: "+BestISI);}
			initialize(PD_FileName,ParticipantDetails_Head,url+createfile);
			initialize(ExperimentDetails_Filename,ExperimentDetails_Head,url+createfile);
			initialize(ISID_Filename,ISID_Head,url+createfile);
			ExperimentData_Filename = GROUPID + '_' + PHASENO + '.csv';
			User_DataFolder = GROUPID + '/' + USERID + '/';
			initialize(ExperimentData_Filename,ExperimentData_Head,url+createfile);
			save(PD_FileName,ParticipantDetails);
			initialize(User_DataFolder,'',url+createuser);
			startExperiment();
		}
	}
}

// to create file and folder for the user
function initialize(filename,header,url){
	$.ajax({
		type: 'POST',
		data: {'Name': filename,
					 'Header': header},
		url: url,
		success: function(data) {
			console.log(data);
		}
	});
}