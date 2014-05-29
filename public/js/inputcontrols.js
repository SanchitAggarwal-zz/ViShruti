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
		startexp = true;
	}
	if(startexp && !ExperimentEnd){
		//var key_press = String.fromCharCode(event.keyCode);
		var key_code = event.keyCode;
		var key_index_a = findIndex(inputDirection_a,key_code);
		var key_index_b = findIndex(inputDirection_b,key_code);
		if(key_index_a == -1 && key_index_b == -1){
			console.log('Invalid Input');
		}
		else{
			if(key_index_a == 9 ||key_index_b==9){
				console.log('Spacebar: next '+next+' CurrentCuePos '+CurrentCuePos+" TotalSteps:"+TotalSteps);
				while(next<CurrentCuePos){
					var x =  Path[next][0];
					var y = Path[next][1];
					var cue_x = Cue[next][0];
					var cue_y = Cue[next][1]*-1;
					var cue_code = 10 * (cue_x + 2) + (cue_y + 2);
					var cue_index = findIndex(expectedDirection,cue_code);
					CueLabels.push(DirectionLabels[cue_index]);
					InputLabels.push('NoInput');
					if(VisualError){Maze[x][y] = 4 * (cueno % 2) + 4;}
					Miss++;
					count--;
					next++;
				}
				// Add marker in input and cue labels
				CueLabels.push(DirectionLabels[key_index_a]);
				InputLabels.push(DirectionLabels[key_index_a]);
				if(count==Level){Recall++;}
				InputTime.push(IntervalTime);
				ResponseTime = ResponseTime + IntervalTime;
				IntervalTime = 0;
				count=0;
				next = CurrentCuePos;
				if(CurrentCuePos==TotalSteps && PopNextFunction == 0){ // pop next function for new Maps
					if(Familirization){
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
					savecanvas.download= USERID + "_" + CurrentMode + "_Dir_" + Direction + "_Map_" + CurrentMapNo +"_PL_" + TotalSteps + "_FI_" + FileIndex + ".png";
					document.body.appendChild(savecanvas);
					savecanvas.click();

					if(RandomOrder){
						Level = RandomorderCue.toString();
					}
					if(Familirization){
						Level = FamiliarCue.toString();
					}
					var currentAccuracy = 100*Hit/(TotalSteps);
					AvgAccuracy = ((CurrentMapNo - 1)*AvgAccuracy + currentAccuracy)/CurrentMapNo;
					console.log(AvgAccuracy);
					ExperimentResults.push([FileIndex,Direction,Level,CurrentMode,AccuracyThreshold,TotalSteps,Hit,Miss,100*Hit/(TotalSteps),Recall,ResponseTime,ResponseTime/TotalSteps,NoOfMaps,InputTime.toString(),CueLabels.toString(),InputLabels.toString(),InterStimulusInterval,AvgAccuracy]);
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
						if(CurrentMapNo==NMaps && KeyExp < 5){
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
					cueno = 0;
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
					if(VisualError && noextra){Maze[x][y] = 4 * (cueno % 2) + 3;}
				}
				else{
					IntervalTime = IntervalTime + (waitTime - CueTime)/1000;
					CueTime = new Date().getTime();
					if(AudioError){playError();}
					Miss++;
					count--;
					if(VisualError && noextra){Maze[x][y] = 4 * (cueno % 2) + 4;}
				}
				drawMaze(Maze,MazeLength);
				drawMetrics();
				drawControls(key_index_a>key_index_b?key_index_a:key_index_b);
				next++;
			}
		}
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