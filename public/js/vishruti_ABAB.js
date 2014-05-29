var FunctionQueue = [],checkFunctionQueue,FQCounter,PopNextFunction = 1,FileIndex = 0;
var DisplayGrid = 0,VisualError = 0,AudioError = 0,VisualCue = 0;  // Flag for Visual or Error Feedback and DisplayGrid
var ExperimentEnd = 0,StartExp = false;
var WM = false,WM_CueLength = [1,2,3,4,5,6,7,8],Cue_index = 0;
var NoOfMaps,TrialLength,Direction,TotalStimuli,CurrentMapNo,CurrentMode;
var Maze,Path,Cue,MazeLength;
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
var InstructionFile = '', Instructions = [], InsCounter = 0, SilenceFile;
var ISIList = ['25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500',
							'25','50','100','200','300','400','500','25','50','100','200','300','400','500'];
var ISICounter = 0;
var CueLabels = [],InputLabels = [],InputTime = [];
var start_x,start_y,inc_sx,inc_sy;
var pitch = [440,880,1760];   //predefined notes in hz
var rate = 44100; //sample per sec
var volume = 50; //amplitude of sine wave
var ResponseTime = 0, CueTime = 0,IntervalTime = 0;
var Hit = 0,Miss = 0,Recall = 0,count=0;
var Sounds = [];
var CurrentCuePos = 0,CueNo = 0,next = 0;// For Next move
var counter = 0;

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

// To Stop Experiment In Between
function stopExperiment(){
	startexp = false;
	if(ExperimentEnd){
		document.getElementById("StopExp").disabled = true;
		document.getElementById("StartExp").disabled = false;
		$('#StopExp').removeClass('btn-primary');
		$('#StopExp').addClass('btn-default');
		$('#StartExp').removeClass('btn-default');
		$('#StartExp').addClass('btn-primary');
		ExperimentTime = (new Date().getTime() - ExperimentTime)/1000;
		SetInstruction(-1,0);
		//alert("Experiment Finished !! \nThank You For Participating "+ USERID+ "\nYou Took : " + (ExperimentTime/60).toFixed(3) + " Minutes\n Have a Nice Day.");
		//saveExperimentResults
		saveExperimentResults();
		//Reload the page
		//location.reload();
		document.getElementById("StopExp").disabled = true;
		document.getElementById("StartExp").disabled = false;
	}
	else{
		var r=confirm("Experiment Not Yet Finished !!\nConfirm To Stop Experiment In Between !!\n Only Half Results Will be saved !!");
		if (r==true){
			ExperimentEnd = 1;
			// clear the polling variable
			clearInterval(checkFunctionQueue);
			stopExperiment();  // call stop experiment again
		}
	}
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
		WM = false;
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
	if(TrialLength == 0){WM = true;}
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
			InstructionFlag = true;
			break;
		case -1: InstructionFile = InstructionFolder.concat('ExpFinishThanks.wav');
			AlertMessage = AlertMessage.concat('Experiment Finished !! \nThank You For Participating ',USERID,'\nYou Took : ',(ExperimentTime/60).toFixed(3),' Minutes\n Have a Nice Day.');
			InstructionFlag = true;
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
	if(EM != 7){
		InterStimulusInterval = BestISI;
		InterStimulusInterval = InterStimulusInterval.toString();
		Staircase = false;
	}
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

function NextCue(){
	CueNo = CueNo + 1;
	if(Staircase){
		InterStimulusInterval = ISIList[ISICounter];
		ISICounter++;
		InterStimulusInterval = InterStimulusInterval.toString();
		console.log('InterStimulusInterval is ' + InterStimulusInterval);
	}
	if(WM){
		TrialLength = WM_CueLength[Cue_index++];
	}
	var str1 = "audio/silence_wav/silence";
	SilenceFile = str1.concat(InterStimulusInterval,'.wav');
	console.log('TrialLength '+TrialLength);
	for(var i=0;i<TrialLength;i++){
		var cue_x = Cue[next+i][0];
		var cue_y = Cue[next+i][1]*-1;
		//alert('x' + cue_x +'y'+ cue_y);
		if(i<TrialLength){
			AddSilence();
		}
		AddCueWave(cue_x,cue_y,1);
		drawMaze(Maze,MazeLength);
	}
	CurrentCuePos = CurrentCuePos + TrialLength;
}

function playSounds(){
	StartExp = false;
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

function playError(){
	var audio = new Audio("audio/1.wav");
	//var audio = new Audio("error500ms.mp3");
	audio.load();
	audio.play();
}

function AddSilence(){
	Sounds.push(SilenceFile);
	//Sounds.push("silent.wav");
}

function AddCueWave(x,y,z){
	var data = new Array();
	var seconds = 0.5; //x==0?1:0.5;
	var frequencyHz = pitch[y+1];
	var amplitude = volume*z;
	//amplitude = x==0?0.25*amplitude:amplitude;
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
				data[j++] = wave_sample;//(0.5 - balance);
				data[j++] = wave_sample;//(0.5 + balance);
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

//Generate Map Maze
function generateMaze(){
	var Blocks = 4 * TotalStimuli;
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
		Path =  new Array(TotalStimuli);
		Cue = new Array(TotalStimuli);
		for(var i = 0; i<TotalStimuli;i++){
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
		while(Steps < TotalStimuli && flag == 0){
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
	if(VisualCue == 0){
		for (var i = 0; i < MazeLength; i++){
			for (var j = 0; j < MazeLength; j++){
				Maze[i][j] = 6;
			}
		}
		Maze[start_x][start_y]=5;
		drawMaze(Maze,MazeLength);
	}
	//alert("Maze Generated");
}

function drawMaze(Maze,MazeLength){
	var canvas = document.getElementById('Maze_Canvas');
	var width = canvas.height;
	var height = canvas.height;
	var context = canvas.getContext('2d');
	var BlockWidth = Math.ceil((width - 50 - 3 * MazeLength)/MazeLength);
	var BlockHeight = Math.ceil((height - 50 - 3 * MazeLength)/MazeLength);
	var BlockColor = ['Yellow','Black','Orange','DarkGreen','DarkRed','Blue','White','Green','Red'];
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

	text = CurrentMode.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 25);
	text_width = text_width + metrics.width + 10;

	text_width = width;
	text = "CueLength: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 45);
	text_width = text_width + metrics.width + 2;

	if(RandomOrder){ text = "2,3,4,5,6,7 or 8"}
	else if(Familirization){ text = "2 or 3"}
	else{ text = TrialLength.toString()};
	metrics = context.measureText(text);
	context.fillText(text, text_width, 45);

	text_width = width;
	text = "Direction Used: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 65);
	text_width = text_width + metrics.width + 2;

	text = Direction.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 65);

	text_width = text_width + metrics.width + 10;
	text = "Map: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 65);
	text_width = text_width + metrics.width + 2;

	text = FileIndex.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 65);

	text_width = width;
	text = "Hit: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);
	text_width = text_width + metrics.width + 2;

	text = Hit.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);
	text_width = text_width + metrics.width + 10;

	text = "Miss: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);
	text_width = text_width + metrics.width + 2;

	text = Miss.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);
	text_width = text_width + metrics.width + 10;

	text = "Recall: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);
	text_width = text_width + metrics.width + 2;

	text = Recall.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 85);

	text_width = width;
	text = "Response Time: ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 105);
	text_width = text_width + metrics.width + 2;

	text = ResponseTime.toFixed(3);
	metrics = context.measureText(text);
	context.fillText(text, text_width, 105);
	text_width = text_width + metrics.width + 2;

	text = " sec ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 105);

	text_width = width;
	text = "Average Accuracy:";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 125);
	text_width = text_width + metrics.width + 2;

	text = AvgAccuracy.toFixed(3);
	metrics = context.measureText(text);
	context.fillText(text, text_width, 125);

	text_width = width;
	text = "Inter Stimulus Interval:";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 145);
	text_width = text_width + metrics.width + 2;

	text = InterStimulusInterval.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 145);
	text_width = text_width + metrics.width + 2;

	text = " milliseconds ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 145);

	text_width = width;
	text = "Inter Trial Interval:";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 165);
	text_width = text_width + metrics.width + 2;

	text = InterTrialInterval.toString();
	metrics = context.measureText(text);
	context.fillText(text, text_width, 165);
	text_width = text_width + metrics.width + 2;

	text = " milliseconds ";
	metrics = context.measureText(text);
	context.fillText(text, text_width, 165);
}

function drawControls(key){
	var canvas = document.getElementById('Controls_Canvas');
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext('2d');
	var BlockWidth = Math.ceil((width - 150 - 3 * 3)/3);
	var BlockHeight = Math.ceil((height - 150 - 3 * 3)/3);
	var BlockColor = ['Blue','White'];
	context.beginPath();
	context.clearRect(0, 0, width, height);
	//alert(MazeLength);
	if(Direction/4 == 1){
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
	var spacebarwidth = x-3-BlockWidth/2;
	x=25;
	context.lineWidth = 1;
	context.strokeStyle = 'Black';
	context.fillStyle = BlockColor[key==9?0:1];
	context.fillRect(x, y , spacebarwidth, 0.6*BlockHeight);
	context.strokeRect(x, y , spacebarwidth, 0.6*BlockHeight);
	context.fillStyle = "Black";
	context.font = "bold 14px Arial";
	var text = DirectionLabels[9];
	context.fillText(text, x+spacebarwidth/3, y+BlockHeight/3);
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