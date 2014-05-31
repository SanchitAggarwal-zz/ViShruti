var inputDirection_a = [36,38,33,37,12,39,35,40,34,32];   //added 32 for spacebar
var inputDirection_b = [103,104,105,100,101,102,97,98,99,32]; //added 32 for spacebar
var expectedDirection = [13,23,33,12,22,32,11,21,31];
var DirectionLabels = ['NW',' N','NE',' W',' C',' E','SW',' S','SE','Space'];

document.onkeyup = onUserInput;

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

function onUserInput() {
	var waitTime = new Date().getTime();
	if(!Sounds[counter] && counter>0){
		StartExp = true;
	}
	if(StartExp && !ExperimentEnd){
		//var key_press = String.fromCharCode(event.keyCode);
		var key_code = event.keyCode;
		var key_index_a = findIndex(inputDirection_a,key_code);
		var key_index_b = findIndex(inputDirection_b,key_code);
		if(key_index_a == -1 && key_index_b == -1){
			console.log('Invalid Input');
		}
		else{
			if(key_index_a == 9 ||key_index_b==9){
				console.log('Spacebar: next '+next+' CurrentCuePos '+CurrentCuePos+" TotalStimuli:"+TotalStimuli);
				while(next<CurrentCuePos){
					var x =  Path[next][0];
					var y = Path[next][1];
					var cue_x = Cue[next][0];
					var cue_y = Cue[next][1]*-1;
					var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
					var cue_index = findIndex(expectedDirection,cue_code);
					CueLabels.push(DirectionLabels[cue_index]);
					InputLabels.push('NoInput');
					if(VisualError){Maze[x][y] = 4 * (CueNo % 2) + 4;}
					Miss++;
					count--;
					next++;
				}
				// Add marker in input and cue labels
				CueLabels.push(DirectionLabels[key_index_a]);
				InputLabels.push(DirectionLabels[key_index_a]);
				if(count==TrialLength){Recall++;}
				InputTime.push(IntervalTime);
				ResponseTime = ResponseTime + IntervalTime;
				IntervalTime = 0;
				count=0;
				next = CurrentCuePos;
				if(CurrentCuePos==TotalStimuli && PopNextFunction == 0){ // pop next function for new Maps
					if(Staircase){
						FamiliarRecall = Recall;
						FamiliarISI = FamiliarRecall>=maxRecall?ISIList[ISICounter-1]:FamiliarISI;
						maxRecall =  FamiliarRecall>=maxRecall?FamiliarRecall:maxRecall;
					}
					drawMaze(Maze,MazeLength);
					drawMetrics();
					if(CurrentMode == 'InCorrectVisualCue'){
						drawCorrectMaze(MazeLength,Path);
					}
					var canvas = document.getElementById('Maze_Canvas');
					var savecanvas = document.createElement('a');
					savecanvas.href = canvas.toDataURL('image/png').replace('image/png');
					savecanvas.download= USERID + "_" + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo +"_PL_" + TotalStimuli + "_FI_" + FileIndex + ".png";
					document.body.appendChild(savecanvas);
					savecanvas.click();

					if(WM){
						TrialLength = WM_CueLength.toString();
					}
					if(Staircase){
						TrialLength = StaircaseCueLength.toString();
					}
					var currentAccuracy = 100*Hit/(TotalStimuli);
					AvgAccuracy = ((CurrentMapNo - 1)*AvgAccuracy + currentAccuracy)/CurrentMapNo;
					console.log(AvgAccuracy);
					ExperimentResults.push([FileIndex,Direction,TrialLength,CurrentMode,AccuracyThreshold,TotalStimuli,Hit,Miss,100*Hit/(TotalStimuli),Recall,ResponseTime,ResponseTime/TotalStimuli,NoOfMaps,InputTime.toString(),CueLabels.toString(),InputLabels.toString(),InterStimulusInterval,AvgAccuracy]);
					var KeyExp = ExperimentList[CurrentMode];
					console.log('Accuracy Flag :'+AccuracyFlag);
					if(CurrentMapNo>5 && KeyExp < 5){
						if(currentAccuracy >= AccuracyThreshold){
							AccuracyFlag = AccuracyFlag -1;
						}
						else{
							AccuracyFlag = 3;
						}
					}
					else{
						AccuracyFlag = 3;
					}
					if(AccuracyFlag <= 0){
						console.log("Accuracy for three consecutive map is greater than threshold ,switching to another mode");
						var i = CurrentMapNo;
						while(i<NMaps){
							FQCounter--;
							FileIndex++;
							FunctionQueue.shift();
							console.log("Spliced the function call");
							i++;
						}
					}
					else{
						if(CurrentMapNo==NoOfMaps && KeyExp < 5){
							ExperimentEnd = 1;
							// clear the polling variable
							alert('Avg Accuracy of three consecutive Maps less than Accuracy Threshold '+ AccuracyThreshold +' After '+NMaps + ' Maps.\nTerminating Experiment');
							while(i<NMaps){
								FQCounter--;
								FileIndex++;
								FunctionQueue.shift();
								console.log("Spliced the function call");
								i++;
							}
							clearInterval(checkFunctionQueue);
							stopExperiment();
						}
					}

					next = 0;
					Hit = 0;
					Miss = 0;
					ResponseTime = 0;
					CurrentCuePos = 0;
					count=0;Recall=0;
					CueNo = 0;
					PopNextFunction = 1;
				}
				else{ //play next cues
					// inter-trial time between two sound patterns in working memory experiment
					startexp = false;
					var str1 = "./Silence/silence";
					silencefile = str1.concat(InterTrialInterval,'.wav');
					AddSilence();
					// play next audio sequence
					NextCue();
					playSounds();
					CueTime =  new Date().getTime();
				}
				drawMaze(Maze,MazeLength);
				drawMetrics();
				drawControls(key_index_a);
			}
			else{
				var x, y,cue_x,cue_y,cue_index;
				var noextra = true;
				if(next < CurrentCuePos){
					x =  Path[next][0];
					y = Path[next][1];
					cue_x = Cue[next][0];
					cue_y = Cue[next][1]*-1;
					cue_code = 10 * (cue_x + 2) + (cue_y + 2);
					cue_index = findIndex(expectedDirection,cue_code);
					CueLabels.push(DirectionLabels[cue_index]);
				}
				else{
					noextra = false;
					cue_index = -2;
					CueLabels.push('NoCues');
				}
				var input_index = key_index_a > key_index_b ? key_index_a:key_index_b;
				InputLabels.push(DirectionLabels[input_index]);
				if(key_index_a == cue_index || key_index_b == cue_index){
					IntervalTime = IntervalTime + (waitTime - CueTime )/1000;
					CueTime = new Date().getTime();
					count++;
					Hit++;
					if(VisualError && noextra){Maze[x][y] = 4 * (CueNo % 2) + 3;}
				}
				else{
					IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
					CueTime = new Date().getTime();
					if(AudioError){playError();}
					Miss++;
					count--;
					if(VisualError && noextra){Maze[x][y] = 4 * (CueNo % 2) + 4;}
				}
				drawMaze(Maze,MazeLength);
				drawMetrics();
				drawControls(key_index_a>key_index_b?key_index_a:key_index_b);
				next++;
			}
		}
	}
}