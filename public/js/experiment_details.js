var ExperimentMode,SelectedMode,InterStimulusInterval='',InterTrialInterval,StartTime,StopTime,TotalTime;
var NoOfWMMaps = 3,NoOfDemoMaps = 2,NoOfTrainingMaps = 40, NoOfTestingMaps = 3;
var WM_PathLength = 36, Training_PathLength = 10, Testing_PathLength = 50;
var AccuracyThreshold = 90, ConsecutiveMap = 2;
var Staircase, Staircase_PathLength = 210,NoOfStaircaseMaps = 1, StaircaseCueLength = 3;
var	ExperimentDetails = [];
var ISIDetails = [], ISID = [];
var ExperimentData = [];
var BreakTime = 2; //2 minutes break between each switch

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
	ED = [];
	$.get('http://localhost:3000/readExperimentDetails', function(ED_Result) {
		if(ED_Result.length != 0)
		{
			ED_Result = ED_Result.split('\n');
			for(var i=0; i<ED_Result.length;++i){
				ED.push(ED_Result[i].split(','));
				if(i>0 && ED[i][0]==USERID && ED[i][5] != '' ){// Select Inter Stimulus Interval
					InterStimulusInterval = ED[i][5];
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
	if(InterStimulusInterval == '' && PHASENO != 'Phase_2')
	{alert("Please check ISI Staircase for selection of Inter Stimulus Interval");}
	else if(ExperimentMode=="" || isNaN(NoOfWMMaps) || isNaN(NoOfDemoMaps) || isNaN(NoOfTrainingMaps)|| isNaN(AccuracyThreshold) || NoOfWMMaps <3 || AccuracyThreshold <60 || NoOfDemoMaps <2 || NoOfTrainingMaps <20){
		alert("Please Enter Valid Experiment Parameters");
	}
	else {
		StartTime = new Date().getTime();
		startExperiment();
	}
}

// function to save Experiment Details
function saveED (){
	var csvRows = [];
	for(var i=0, l=ExperimentDetails.length; i<l; ++i){
		csvRows.push(ExperimentDetails[i].join(','));
	}
	var csvString = csvRows.join("\n");
//	var savecsv         = document.createElement('a');
//	savecsv.href        = 'data:attachment/csv,' + csvString;
//	savecsv.target      = '_blank';
//	savecsv.download    = USERID +'.csv';
//	document.body.appendChild(savecsv);
//	savecsv.click();

	$.ajax({
		type: 'POST',
		data: csvString,
		url: 'http://localhost:3000/writeExperimentDetails',
		success: function(data) {
			console.log('success');
			alert(data);
		}
	});
}