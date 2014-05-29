var FunctionQueue = [],checkFunctionQueue,FQCounter,PopNextFunction = 1,FileIndex = 0;
var DisplayGrid = 0,VisualError = 0,AudioError = 0;  // Flag for Visual or Error Feedback and DisplayGrid
var ExperimentEnd = 0,StartExp = false;
var RandomOrder = 0,WM_CueLength = [1,2,3,4,5,6,7,8],Cue_index = 0;
var NoOfMaps,TrialLength,Direction,TotalStimuli,CurrentMapNo,CurrentMode;
var ExperimentList = {'Visual_Error_FeedBack_Training':1,
											'Audio_Error_FeedBack_Training':2,
											'UnSupervised_Training':3,
											'No_Training':4,
											'Testing':5,
											'Working_Memory':6,
											'Staircase':7,
											'Demo':8
										 };
var InstructionFlag = false; AccuracyFlag = ConsecutiveMap;
var InstructionFolder = "/Audio/instructions/", AlertMessage = '';
var InstructionFile = '', Instructions = [], InsCounter = 0;
var ISIList = ['25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500'];
var ISICounter = 0;
var CueLabels = [],InputLabels = [],InputTime = [];
var Maze,Path,Cue,Level,MazeLength;

function startExperiment(){
	document.getElementById("StopExp").disabled = false;
	document.getElementById("StartExp").disabled = true;
	document.getElementById("ExperimentMode").disabled = true;
	document.getElementById("NoOfWMMaps").disabled = true;
	document.getElementById("NoOfDemoMaps").disabled = true;
	document.getElementById("NoOfTrainingMaps").disabled = true;
	document.getElementById("AccuracyThreshold").disabled = true;
	document.getElementById("Staircase").disabled = true;
	$('#StartExp').removeClass('btn-primary');
	$('#StartExp').addClass('btn-default');
	$('#StopExp').removeClass('btn-default');
	$('#StopExp').addClass('btn-primary');
	addExperimentMode();
	checkFunctionQueue = setInterval(function(){callNextFunction()},3000);  //Check function queue after every 3 seconds
	FQCounter = FunctionQueue.length;
}

function addExperimentMode(){
	var EM = ExperimentList[ExperimentMode];
	setDisplayAndError(EM);
	if(EM <=3){
		runMode(1,Training_PathLength,4,NoOfDemoMaps,"Demo");
		runMode(1,Training_PathLength,4,NoOfTrainingMaps,ExperimentMode);
		runMode(1,Training_PathLength,8,NoOfDemoMaps,"Demo");
		runMode(1,Training_PathLength,8,NoOfTrainingMaps,ExperimentMode);
		runMode(1,Testing_PathLength,4,NoOfTestingMaps,"Testing");
		runMode(1,Testing_PathLength,8,NoOfTestingMaps,"Testing");
	}
	else if(EM == 4 || EM == 5){
		runMode(1,Testing_PathLength,4,NoOfTestingMaps,ExperimentMode);
		runMode(1,Testing_PathLength,8,NoOfTestingMaps,ExperimentMode);
	}
	else if(EM == 6){
		if(Staircase){
			runMode(StaircaseCueLength,Staircase_PathLength,4,NoOfStaircaseMaps,"Staircase");
		}
		runMode(0,WM_PathLength,4,NoOfDemoMaps,"Demo");
		runMode(0,WM_PathLength,4,NoOfWMMaps,ExperimentMode);
		runMode(0,WM_PathLength,8,NoOfDemoMaps,"Demo");
		runMode(0,WM_PathLength,8,NoOfWMMaps,ExperimentMode);
		runMode(0,WM_PathLength,4,NoOfDemoMaps,"Demo");
		runMode(0,WM_PathLength,4,NoOfWMMaps,ExperimentMode);
		runMode(0,WM_PathLength,8,NoOfDemoMaps,"Demo");
		runMode(0,WM_PathLength,8,NoOfWMMaps,ExperimentMode);
	}
}

// To Set Display and Error
function setDisplayAndError(Key){
	switch(Key){
		case 1 : DisplayGrid = 1; VisualError = 1; AudioError = 0; break;
		case 2 :
		case 3 :
		case 4 :
		case 5 :
		case 6 :
		case 7 : DisplayGrid = 0; VisualError = 1; AudioError = 1; break;
		case 8 : if(SelectedMode == 'Visual_Error_FeedBack_Training'){
							DisplayGrid = 1;VisualError = 1; AudioError = 0; break;
						}
						else{DisplayGrid = 0;VisualError = 1; AudioError = 1; break;}
	}
}

function runMode(CueLength,PathLength,Direction,NoOfMap,Mode){
	var i = 1;
	while( i <= NoOfMap) {
		var fun = addToFunctionQueue(run_Map, this, new Array(i,CueLength,PathLength,Direction,Mode,NoOfMap));
		FunctionQueue.push(fun);
		i++;
	}
}

var addToFunctionQueue =  function(fn, context, params) {
	return function() {
		fn.apply(context, params);
	};
}

function callNextFunction() {
	if(FQCounter<0){
		ExperimentEnd = 1;
		// clear the polling variable
		clearInterval(checkFunctionQueue);
		stopExperiment();
	}
	// Remove and execute all items in the array
	if(PopNextFunction){
		PopNextFunction = 0;
		FQCounter--;
		FileIndex++;
		Cue_index = 0;
		WM_CueLength = shuffle(WM_CueLength);
		ISIList = shuffle(ISIList);
		if(FunctionQueue.length){
			(FunctionQueue.shift())();}
	}
}

function run_Map(MapNo,CueLength,PathLength,Dir,Mode,Map){
	if(Dir != Direction || Mode != CurrentMode){
		InstructionFlag = true;
		AccuracyFlag = ConsecutiveMap;
		SetInstruction(ExperimentList[Mode],Dir);
	}
	else{
		SetInstruction(0,0);
		StartExp = false;
	}
	console.log('MapNo '+MapNo+' CueLength '+CueLength+ ' PathLength ' + PathLength+ ' Direction ' + Dir +' Mode '+Mode+' Map '+Map);
	NoOfMaps = Map;
	TrialLength = CueLength;
	Direction =   Dir;
	TotalStimuli = PathLength;
	CurrentMapNo = MapNo;
	CurrentMode = Mode;
}

function shuffle(o){ //v1.0
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function SetInstruction(IKey,Dir){
	InstructionFolder = InstructionFolder.concat(MODEOFCOMM,'/');
	AlertMessage = '';
	InstructionFile = '';
	console.log(IKey);
	switch(IKey){
		case 1: InstructionFile = InstructionFolder.concat(Dir,'training.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Video Error Feedback experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Video Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
			AlertMessage = AlertMessage.concat('You will see a Red or Green Color as a Hint for Wrong/Right Response.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 2: InstructionFile = InstructionFolder.concat(Dir,'training.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Audio Error Feedback Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Audio Error Feedback Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
			AlertMessage = AlertMessage.concat('You will hear a Buzzing Sound as a Hint for Wrong Response.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 3: InstructionFile = InstructionFolder.concat(Dir,'training.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Unsupervised Audio Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Unsupervised Audio Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 4: InstructionFile = InstructionFolder.concat(Dir,'testing.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction No-Training experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction No Training experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;
		case 5: InstructionFile = InstructionFolder.concat(Dir,'testing.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Testing experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Testing experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('Listen to Audio and Press corresponding Arrow Key. Press Spacebar for Next Audio.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 6: InstructionFile = InstructionFolder.concat(Dir,'WM_1.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Working Memory experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Working Memory experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('You will hear 1-8 sounds, Remember the sounds and press the corresponding Keys\n');
			AlertMessage = AlertMessage.concat('Press Spacebar for Next set of sounds.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 7: InstructionFile = InstructionFolder.concat('4Familiar.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Staircase experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Staircase experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('You will hear 3 sounds, Remember the sounds and press the corresponding Keys\n');
			AlertMessage = AlertMessage.concat('Press Spacebar for Next set of sounds.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;

		case 8: InstructionFile = InstructionFolder.concat('4Familiar.wav');
			if(Dir == 4){
				AlertMessage = AlertMessage.concat('This is 4 direction Demo experiment.\nIn this audio for North,South, East and West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Press Up-Arrow key for North, Down Arrow key for South, Right Arrow key for East and Left Arrow Key for West.\n');
			}
			else{
				AlertMessage = AlertMessage.concat('This is 8 direction Demo experiment.\nIn this audio for North,South, East, West, North-East, North-West, South East and South-West Directions will be given.\n');
				AlertMessage = AlertMessage.concat('Use Number pad for Controls.\n');
				AlertMessage = AlertMessage.concat('Press 7 Key for North-West, 8 Key for North, 9 key for North-East, 4 for West, 6 for east, 1 for south-west, 2 for south, 3 for south east.\n');
			}
			AlertMessage = AlertMessage.concat('You will hear 1-8 sounds, Remember the sounds and press the corresponding Keys\n');
			AlertMessage = AlertMessage.concat('Press Spacebar for Next set of sounds.\n');
			AlertMessage = AlertMessage.concat('Get ready with Controls, Press Enter Key to start the Experiment.');
			break;
		case 0: InstructionFile = InstructionFolder.concat('NextMapEnter.wav');
			AlertMessage = AlertMessage.concat('Current Map is Finished.Press Enter for Next Map.');
			InsFlag = true;
			break;
		case -1: InstructionFile = InstructionFolder.concat('ExpFinishThanks.wav');
			AlertMessage = AlertMessage.concat('Experiment Finished !! \nThank You For Participating ',USERID,'\nYou Took : ',(ExperimentTime/60).toFixed(3),' Minutes\n Have a Nice Day.');
			InsFlag = true;
			break;
	}
	Instructions.push(InstructionFile);
	console.log(AlertMessage);
	playInstruction();
}

function playInstruction(){
	var instructionEL = document.getElementById('instructionEL');
	instructionEL.load();
	if(Instructions[InsCounter]){
		instructionEL.src = Instructions[InsCounter];
		instructionEL.addEventListener('ended', playMap);
		instructionEL.play();
		InstructionFile = '';
		InsCounter++;
	}
}

function playMap(){
	alert(AlertMessage);
	StartExp = true;
	var EM = ExperimentList[CurrentMode];
	setDisplayAndError(EM);
	console.log('TrialLength '+TrialLength+'Staircase '+Staircase);
	var MazeDiv = document.getElementById('MazeDiv');
	if(DisplayGrid==0){ MazeDiv.style.visibility = 'hidden';} // hide, but let the element keep its size
	else{ MazeDiv.style.visibility = 'visible';}
	CueLabels = [];
	InputLabels = [];
	InputTime = [];
	generateMaze();
	drawMaze(Maze,MazeLength);
	drawMetrics();
	drawControls(-1);
	NextCue();
	playSounds();

	CueTime =  new Date().getTime();
}