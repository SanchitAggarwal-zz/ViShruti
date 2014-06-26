//function generateTrainingMaze(){
//	//Stimuli of same direction given consecutively two time so to have better association
//	//Total Stimuli should be 8 or 16 only, For 8 Maze is 7X7 and for 16 Maze is 10x10
//	var Blocks = 6 * TotalStimuli;
//	MazeLength = Math.ceil(Math.sqrt(Blocks));
//	var Neighbour = getNeighbours(Direction/4);
//	var DirectionSequence = new Array(TotalStimuli);
//	var DirectionSet = Direction==4?[0,1,2,3]:[0,1,2,3,4,5,6,7];
//
//	Maze = new Array(MazeLength);
//	for(var i = 0; i<MazeLength;i++){
//		Maze[i] = new Array(MazeLength);
//		for(var j = 0; j<MazeLength;j++){
//			Maze[i][j] = 6;
//		}
//	}
//	Path =  new Array(TotalStimuli);
//	Cue = new Array(TotalStimuli);
//	for(var i = 0; i<TotalStimuli;i++){
//		Path[i] = new Array(2);
//		Cue[i] = new Array(2);
//	}
//	var Steps = 0;
//	var prev_pos_x = Math.floor(MazeLength/2);  //start from middle of the maze
//	var prev_pos_y = Math.floor(MazeLength/2);
//	var new_pos_x,new_pos_y,pos_x,pos_y,new_pos_x1,new_pos_y1;
//	Maze[prev_pos_x][prev_pos_y] = 5;     //Starting Cell
//	start_x = prev_pos_x;
//	start_y = prev_pos_y;
//	inc_sx = prev_pos_x;
//	inc_sy = prev_pos_y;
//	var OppositeNbr = 99,NextNbr,NoOfNbr,index;
//	do{
//		index = DirectionSet.indexOf(OppositeNbr);     //removing OppositeNbr from Direction Set, for the firstime none to remove
//		index = index<0?99:index;
//		DirectionSet.splice(index,1);
//		NoOfNbr = DirectionSet.length;
//		NextNbr =  DirectionSet[Math.floor(Math.random()*NoOfNbr)];
//		DirectionSequence[Steps] = NextNbr;
//		DirectionSequence[Steps+1] = NextNbr;
//		new_pos_x = prev_pos_x + Neighbour[NextNbr][0];
//		new_pos_y = prev_pos_y + Neighbour[NextNbr][1];
//		new_pos_x1 = new_pos_x + Neighbour[NextNbr][0];
//		new_pos_y1 = new_pos_y + Neighbour[NextNbr][1];
//		Maze[new_pos_x][new_pos_y] = 0;
//		Maze[new_pos_x1][new_pos_y1] = 0;
//		Path[Steps][0] = new_pos_x;
//		Path[Steps][1] = new_pos_y;
//		Cue[Steps][0] = Neighbour[NextNbr][0];
//		Cue[Steps][1] = Neighbour[NextNbr][1];
//		Path[Steps+1][0] = new_pos_x1;
//		Path[Steps+1][1] = new_pos_y1;
//		Cue[Steps+1][0] = Neighbour[NextNbr][0];
//		Cue[Steps+1][1] = Neighbour[NextNbr][1];
//		for(var nbr=0;nbr<NoOfNbr;nbr++){
//			pos_x = prev_pos_x + Neighbour[nbr][0];
//			pos_y = prev_pos_y + Neighbour[nbr][1];
//			if(pos_x >= 0 && pos_x < MazeLength){
//				if(pos_y >= 0 && pos_y < MazeLength){
//					if(Maze[pos_x][pos_y] == 6){
//						Maze[pos_x][pos_y] = 1;
//					}
//				}
//			}
//		}
//		for(var nbr=0;nbr<NoOfNbr;nbr++){
//			pos_x = new_pos_x + Neighbour[nbr][0];
//			pos_y = new_pos_y + Neighbour[nbr][1];
//			if(pos_x >= 0 && pos_x < MazeLength){
//				if(pos_y >= 0 && pos_y < MazeLength){
//					if(Maze[pos_x][pos_y] == 6){
//						Maze[pos_x][pos_y] = 1;
//					}
//				}
//			}
//		}
//		Steps = Steps + 2;
//		prev_pos_x = new_pos_x1;
//		prev_pos_y = new_pos_y1;
//		if(index<99){DirectionSet.push(OppositeNbr);}
//		OppositeNbr = NextNbr%2==0?NextNbr+1:NextNbr-1;  //see ordering of Neighbours to see how opposite nbrs are arranged, eg E,W (0:1) , N,S (2,3), NE,SW (4,5) NW,SE(6,7)
//		DirectionSet.splice(DirectionSet.indexOf(NextNbr),1); //remove the next nbr from Direction set
//	}while(Steps<TotalStimuli);
//
//	console.log('Generated Direction Sequence is '+DirectionSequence);
//	for (var i = 0; i < MazeLength; i++){
//		for (var j = 0; j < MazeLength; j++){
//			if(Maze[i][j] == 6){
//				Maze[i][j] = 1;
//			}
//		}
//	}
//	Maze[prev_pos_x][prev_pos_y] = 6;
//	//alert('Draw Maze');
//	drawMaze(Maze,MazeLength);
//	drawMetrics();
//	next = 0;
//	Hit = 0;
//	Miss = 0;
//	ResponseTime = [];
//	CurrentCuePos = 0;
//	count = 0;
//	Recall = 0;
//	counter = 0;
//	Sounds = [];
//	if(VisualCue == 0){
//		for (var i = 0; i < MazeLength; i++){
//			for (var j = 0; j < MazeLength; j++){
//				Maze[i][j] = 6;
//			}
//		}
//		Maze[start_x][start_y]=5;
//		drawMaze(Maze,MazeLength);
//	}
//	//alert("Maze Generated");
//}
//
//
//function generateTestingMaze(){
//	var Blocks = 4 * TotalStimuli;
//	MazeLength = Math.ceil(Math.sqrt(Blocks));
//	var flag = 0;
//	do{
//		flag = 0;
//		var Neighbour = getNeighbours(Direction/4);
//		var NoOfNbr = Neighbour.length;
//		Maze = new Array(MazeLength);
//		for(var i = 0; i<MazeLength;i++){
//			Maze[i] = new Array(MazeLength);
//			for(var j = 0; j<MazeLength;j++){
//				Maze[i][j] = 6;
//			}
//		}
//		Path =  new Array(TotalStimuli);
//		Cue = new Array(TotalStimuli);
//		for(var i = 0; i<TotalStimuli;i++){
//			Path[i] = new Array(2);
//			Cue[i] = new Array(2);
//		}
//		//alert('Draw Maze');
//		//drawMaze(Maze,MazeLength);
//		var Steps = 0;
//		var prev_pos_x = Math.floor(Math.random()*MazeLength);
//		var prev_pos_y = Math.floor(Math.random()*MazeLength);
//		//alert('prev_pos_x ' + prev_pos_x + ' prev_pos_y ' + prev_pos_y );
//		var new_pos_x,new_pos_y;
//		Maze[prev_pos_x][prev_pos_y] = 5;     //Starting Cell
//		start_x = prev_pos_x;
//		start_y = prev_pos_y;
//		inc_sx = prev_pos_x;
//		inc_sy = prev_pos_y;
//		var NextNbr = 0,pos_x,pos_y;
//		while(Steps < TotalStimuli && flag == 0){
//			flag = 1;
//			for(var nbr=0;nbr<NoOfNbr;nbr++){
//				pos_x = prev_pos_x + Neighbour[nbr][0];
//				pos_y = prev_pos_y + Neighbour[nbr][1];
//				if(pos_x >= 0 && pos_x < MazeLength){
//					if(pos_y >= 0 && pos_y < MazeLength){
//						if(Maze[pos_x][pos_y] == 6){
//							flag = 0;
//						}
//					}
//				}
//			}
//			if(flag == 0){
//				NextNbr =  Math.floor(Math.random()*NoOfNbr);
//				if(NeighbourCount[NextNbr] < TotalStimuli/Direction){
//					//alert('Next Neighbour ' + NextNbr);
//					new_pos_x = prev_pos_x + Neighbour[NextNbr][0];
//					new_pos_y = prev_pos_y + Neighbour[NextNbr][1];
//					//alert('new_pos_x ' + new_pos_x + ' new_pos_y ' + new_pos_y );
//					if(new_pos_x >= 0 && new_pos_x < MazeLength ){
//						if(new_pos_y >= 0 && new_pos_y < MazeLength ){
//							if(Maze[new_pos_x][new_pos_y] == 6 ){
//								Maze[new_pos_x][new_pos_y] = 0;
//								Path[Steps][0] = new_pos_x;
//								Path[Steps][1] = new_pos_y;
//								Cue[Steps][0] = Neighbour[NextNbr][0];
//								Cue[Steps][1] = Neighbour[NextNbr][1];
//								Steps = Steps+1;
//								NeighbourCount[NextNbr] = NeighbourCount[NextNbr] + 1;
//								for(var nbr=0;nbr<NoOfNbr;nbr++){
//									pos_x = prev_pos_x + Neighbour[nbr][0];
//									pos_y = prev_pos_y + Neighbour[nbr][1];
//									if(pos_x >= 0 && pos_x < MazeLength){
//										if(pos_y >= 0 && pos_y < MazeLength){
//											if(Maze[pos_x][pos_y] == 6){
//												Maze[pos_x][pos_y] = 1;
//											}
//										}
//									}
//								}
//								prev_pos_x = new_pos_x;
//								prev_pos_y = new_pos_y;
//
//								//        alert('Draw Maze');
//								//drawMaze(Maze,MazeLength);
//								//alert('Steps Left '+StepsLeft);
//							}
//						}
//					}
//				}
//			}
//		}
//	}while(flag);
//
//	for (var i = 0; i < MazeLength; i++){
//		for (var j = 0; j < MazeLength; j++){
//			if(Maze[i][j] == 6){
//				Maze[i][j] = 1;
//			}
//		}
//	}
//	Maze[prev_pos_x][prev_pos_y] = 6;
//	//alert('Draw Maze');
//	drawMaze(Maze,MazeLength);
//	drawMetrics();
//	next = 0;
//	Hit = 0;
//	Miss = 0;
//	ResponseTime = [];
//	CurrentCuePos = 0;
//	count = 0;
//	Recall = 0;
//	counter = 0;
//	Sounds = [];
//	if(VisualCue == 0){
//		for (var i = 0; i < MazeLength; i++){
//			for (var j = 0; j < MazeLength; j++){
//				Maze[i][j] = 6;
//			}
//		}
//		Maze[start_x][start_y]=5;
//		drawMaze(Maze,MazeLength);
//	}
//	//alert("Maze Generated");
//}




//function generateTrainingMaze(){
//	//Stimuli of same direction given consecutively two time so to have better association
//	//Total Stimuli should be 8 or 16 only, For 8 Maze is 7X7 and for 16 Maze is 10x10
//	var Blocks = 7 * TotalStimuli;
//	MazeLength = Math.ceil(Math.sqrt(Blocks));
//	MazeLength = MazeLength%2?MazeLength:MazeLength+1;
//	var Neighbour = getNeighbours(Direction/4);
//	var DirectionSequence = new Array(TotalStimuli);
//	var DirectionSet = Direction==4?[0,1,2,3]:[0,1,2,3,4,5,6,7];
//	var RemainingDirectionSet = [];
//	Maze = new Array(MazeLength);
//	for(var i = 0; i<MazeLength;i++){
//		Maze[i] = new Array(MazeLength);
//		for(var j = 0; j<MazeLength;j++){
//			Maze[i][j] = 6;
//		}
//	}
//	Path =  new Array(TotalStimuli);
//	Cue = new Array(TotalStimuli);
//	for(var i = 0; i<TotalStimuli;i++){
//		Path[i] = new Array(2);
//		Cue[i] = new Array(2);
//	}
//	var Steps = 0;
//	var prev_pos_x = Math.floor(MazeLength/2);  //start from middle of the maze
//	var prev_pos_y = Math.floor(MazeLength/2);
//	var new_pos_x,new_pos_y,pos_x,pos_y,new_pos_x1,new_pos_y1,flag;
//	Maze[prev_pos_x][prev_pos_y] = 5;     //Starting Cell
//	start_x = prev_pos_x;
//	start_y = prev_pos_y;
//	inc_sx = prev_pos_x;
//	inc_sy = prev_pos_y;
//	var OppositeNbr = 99,NextNbr,NoOfNbr,index;
//	do{
//		index = DirectionSet.indexOf(OppositeNbr);     //removing OppositeNbr from Direction Set, for the firstime none to remove
//		index = index<0?99:index;
//		DirectionSet.splice(index,1);
//		NoOfNbr = DirectionSet.length;
//		NextNbr =  DirectionSet[Math.floor(Math.random()*NoOfNbr)];
//		console.log("NextNbr:" + NextNbr + " DirectionSet: " + DirectionSet + " Remaining set:" + RemainingDirectionSet);
//		flag = 1;
//		pos_x = prev_pos_x + Neighbour[NextNbr][0];
//		pos_y = prev_pos_y + Neighbour[NextNbr][1];
//		if(pos_x < 0 || pos_x >= MazeLength || pos_y < 0 || pos_y >= MazeLength || Maze[pos_x][pos_y] != 6){
//			flag = 0;
//		}else{
//			pos_x = pos_x + Neighbour[NextNbr][0];
//			pos_y = pos_y + Neighbour[NextNbr][1];
//			if(pos_x < 0 || pos_x >= MazeLength || pos_y < 0 || pos_y >= MazeLength || Maze[pos_x][pos_y] != 6){
//				flag = 0;
//			}
//		}
//		if(flag){
//			DirectionSequence[Steps] = NextNbr;
//			DirectionSequence[Steps+1] = NextNbr;
//			new_pos_x = prev_pos_x + Neighbour[NextNbr][0];
//			new_pos_y = prev_pos_y + Neighbour[NextNbr][1];
//			new_pos_x1 = new_pos_x + Neighbour[NextNbr][0];
//			new_pos_y1 = new_pos_y + Neighbour[NextNbr][1];
//			Maze[new_pos_x][new_pos_y] = 0;
//			Maze[new_pos_x1][new_pos_y1] = 0;
//			Path[Steps][0] = new_pos_x;
//			Path[Steps][1] = new_pos_y;
//			Cue[Steps][0] = Neighbour[NextNbr][0];
//			Cue[Steps][1] = Neighbour[NextNbr][1];
//			Path[Steps+1][0] = new_pos_x1;
//			Path[Steps+1][1] = new_pos_y1;
//			Cue[Steps+1][0] = Neighbour[NextNbr][0];
//			Cue[Steps+1][1] = Neighbour[NextNbr][1];
//			for(var nbr=0;nbr<NoOfNbr;nbr++){
//				pos_x = prev_pos_x + Neighbour[nbr][0];
//				pos_y = prev_pos_y + Neighbour[nbr][1];
//				if(pos_x >= 0 && pos_x < MazeLength){
//					if(pos_y >= 0 && pos_y < MazeLength){
//						if(Maze[pos_x][pos_y] == 6){
//							Maze[pos_x][pos_y] = 1;
//						}
//					}
//				}
//			}
//			for(var nbr=0;nbr<NoOfNbr;nbr++){
//				pos_x = new_pos_x + Neighbour[nbr][0];
//				pos_y = new_pos_y + Neighbour[nbr][1];
//				if(pos_x >= 0 && pos_x < MazeLength){
//					if(pos_y >= 0 && pos_y < MazeLength){
//						if(Maze[pos_x][pos_y] == 6){
//							Maze[pos_x][pos_y] = 1;
//						}
//					}
//				}
//			}
//			Steps = Steps + 2;
//			NeighbourCount[NextNbr] = NeighbourCount[NextNbr] + 2;
//			prev_pos_x = new_pos_x1;
//			prev_pos_y = new_pos_y1;
//			if(index<99){DirectionSet.push(OppositeNbr);}
//			OppositeNbr = NextNbr%2==0?NextNbr+1:NextNbr-1;  //see ordering of Neighbours to see how opposite nbrs are arranged, eg E,W (0:1) , N,S (2,3), NE,SW (4,5) NW,SE(6,7)
//			DirectionSet = DirectionSet.concat(RemainingDirectionSet);
//			RemainingDirectionSet = [];
//		}
//		else{
//			RemainingDirectionSet =  RemainingDirectionSet.concat(DirectionSet.splice(DirectionSet.indexOf(NextNbr),1)); //remove the next nbr from Direction set
//		}
//		if(NeighbourCount[NextNbr]>=TotalStimuli/Direction){
//			index = DirectionSet.indexOf(NextNbr);     //removing NextNbr from Direction Set, for the firstime none to remove
//			index = index<0?99:index;
//			DirectionSet.splice(index,1);
//			index = RemainingDirectionSet.indexOf(NextNbr);     //removing NextNbr from Direction Set, for the firstime none to remove
//			index = index<0?99:index;
//			RemainingDirectionSet.splice(index,1);
//		}
//		console.log('Generated Direction Sequence is '+DirectionSequence);
//	}while(Steps<TotalStimuli);
//
//
//	for (var i = 0; i < MazeLength; i++){
//		for (var j = 0; j < MazeLength; j++){
//			if(Maze[i][j] == 6){
//				Maze[i][j] = 1;
//			}
//		}
//	}
//	Maze[prev_pos_x][prev_pos_y] = 6;
//	//alert('Draw Maze');
//	drawMaze(Maze,MazeLength);
//	drawMetrics();
//	next = 0;
//	Hit = 0;
//	Miss = 0;
//	ResponseTime = [];
//	CurrentCuePos = 0;
//	count = 0;
//	Recall = 0;
//	counter = 0;
//	Sounds = [];
//	if(VisualCue == 0){
//		for (var i = 0; i < MazeLength; i++){
//			for (var j = 0; j < MazeLength; j++){
//				Maze[i][j] = 6;
//			}
//		}
//		Maze[start_x][start_y]=5;
//		drawMaze(Maze,MazeLength);
//	}
//	//alert("Maze Generated");
}