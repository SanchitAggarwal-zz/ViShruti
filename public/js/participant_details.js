var FORM_PD,PHASENO,USERID,PARTICIPANT_TYPE,FIRSTNAME,LASTNAME,GROUPID;
var AGE,EDUCATION,MODEOFCOMM,GENDER,MUSICAL_TRAINING,MUSIC_KIND,HEARING_PROBLEM,USERCONTROL;
var ParticipantDetails = [], PD = [], TimeStamp, PD_FileName = 'ParticipantDetails.csv';
var url = 'http://localhost:3000', read = '/read', write = '/write', createuser = '/createUser', createfile = '/createFile', saveImage = '/saveImage';

// For inserting dummy data in participant details form
function DummyData(){
	FORM_PD = document.ParticipantDetail;
  if(document.getElementById("Dummy").checked){
    FORM_PD.USERID.value = 'NewParticipant';
	  FORM_PD.FIRSTNAME.value = 'Dummy';
	  FORM_PD.LASTNAME.value = 'User';
    FORM_PD.AGE.value = '25';
    FORM_PD.EDUCATION.value = 'MS';
    FORM_PD.MODEOFCOMM.value = 'English';
    FORM_PD.GENDER.value = 'Male';
    FORM_PD.PARTICIPANT_TYPE.value = 'Normal';
    FORM_PD.MUSICAL_TRAINING.value = 'No';
    MUSIC_KIND = FORM_PD.MUSIC_KIND.value = 'None';
    FORM_PD.HEARING_PROBLEM.value = 'No';
    FORM_PD.USERCONTROL.value = 'JoyStick';
    FORM_PD.PHASENO.value = 'Phase_1';
	  FORM_PD.GROUPID.value = 'SVEF';
	  document.getElementById("Consent").checked = true;
    document.getElementById("ExperimentMode").value = 'Working_Memory';
    document.getElementById("NoOfWMMaps").value = '3';
	  document.getElementById("NoOfDemoMaps").value = '2';
	  document.getElementById("NoOfTrainingMaps").value = '40';
    document.getElementById("AccuracyThreshold").value = '90';
    document.getElementById("Staircase").disabled = true;
    document.getElementById("Staircase").checked = true;
	}
	else{
    FORM_PD.USERID.value = '';
	  FORM_PD.FIRSTNAME.value = '';
	  FORM_PD.LASTNAME.value = '';
    FORM_PD.AGE.value = '';
    FORM_PD.EDUCATION.value = '';
    FORM_PD.MODEOFCOMM.value = '';
    FORM_PD.GENDER.value = '';
    FORM_PD.PARTICIPANT_TYPE.value = '';
    FORM_PD.MUSICAL_TRAINING.value = '';
    MUSIC_KIND = FORM_PD.MUSIC_KIND.value = '';
    FORM_PD.HEARING_PROBLEM.value = '';
    FORM_PD.USERCONTROL.value = '';
    FORM_PD.PHASENO.value = '';
	  FORM_PD.GROUPID.value = '';
	  document.getElementById("Consent").checked = false;
	  document.getElementById("ExperimentMode").value = '';
	  document.getElementById("NoOfWMMaps").value = '';
	  document.getElementById("NoOfDemoMaps").value = '';
	  document.getElementById("NoOfTrainingMaps").value = '';
	  document.getElementById("AccuracyThreshold").value = '';
	  document.getElementById("Staircase").disabled = false;
	  document.getElementById("Staircase").checked = false;
	}
}

// If Phase 2 or 3 then no need to capture Participant details again
function disablePD(flag){
	if(flag){
	  document.getElementById("inputAge").disabled = true;
		document.getElementById("firstname").disabled = true;
		document.getElementById("lastname").disabled = true;
	  document.getElementById("Education").disabled = true;
	  document.getElementById("Modeofcommunication").disabled = true;
	  document.getElementById("inputGender").disabled = true;
	  document.getElementById("inputType").disabled = true;
	  document.getElementById("inputMusic").disabled = true;
	  document.getElementById("inputMusicKind").disabled = true;
	  document.getElementById("HearingProblem").disabled = true;
	  document.getElementById("UserControl").disabled = true;
		document.getElementById("GroupId").disabled = true;
	}
	else{
    document.getElementById("inputAge").disabled = false
		document.getElementById("firstname").disabled = false;
		document.getElementById("lastname").disabled = false;
    document.getElementById("Education").disabled = false;
    document.getElementById("Modeofcommunication").disabled = false;
    document.getElementById("inputGender").disabled = false;
    document.getElementById("inputType").disabled = false;
    document.getElementById("inputMusic").disabled = false;
    document.getElementById("inputMusicKind").disabled = false;
    document.getElementById("HearingProblem").disabled = false;
    document.getElementById("UserControl").disabled = false;
		document.getElementById("GroupId").disabled = false;
	}
}

// To validate and store participant details
function participantDetails(){
  FORM_PD = document.ParticipantDetail;
  USERID = FORM_PD.USERID.value;
  AGE = FORM_PD.AGE.value;
	FIRSTNAME = FORM_PD.FIRSTNAME.value;
	LASTNAME = FORM_PD.LASTNAME.value;
  EDUCATION = FORM_PD.EDUCATION.value;
  MODEOFCOMM = FORM_PD.MODEOFCOMM.value;
  GENDER = FORM_PD.GENDER.value;
  PARTICIPANT_TYPE = FORM_PD.PARTICIPANT_TYPE.value;
  MUSICAL_TRAINING = FORM_PD.MUSICAL_TRAINING.value;
  MUSIC_KIND = FORM_PD.MUSIC_KIND.value;
  HEARING_PROBLEM = FORM_PD.HEARING_PROBLEM.value;
  USERCONTROL = FORM_PD.USERCONTROL.value;
  PHASENO = FORM_PD.PHASENO.value;
	GROUPID = FORM_PD.GROUPID.value;
	var select = document.getElementById("userid");
	if(document.getElementById("Consent").checked){
	  if(USERID != ""){
			  if (!(isNaN(AGE) || AGE < 1 || EDUCATION == "" || MODEOFCOMM == "" || GENDER == "" || PARTICIPANT_TYPE == ""
				  || MUSICAL_TRAINING == "" || MUSIC_KIND == "" || HEARING_PROBLEM == "" || USERCONTROL == "" || GROUPID == "" || PHASENO == "") ) {
				  TimeStamp = new Date().toString();

				  if(USERID == "NewParticipant") {
				    USERID = GROUPID + '_' + GENDER[0] + '_' + FIRSTNAME + '_' + (PD.length + 1).toString(16);
					  alert('Please Note Your USER_ID for future reference: ' + USERID);
				  }
				  else{
					  USERID = select.options[select.selectedIndex].text;
					  //alert('Please Note Your USER_ID for future reference: ' + USERID);
				  }
			    ParticipantDetails.push(USERID,GROUPID,FIRSTNAME,LASTNAME, AGE, EDUCATION, MODEOFCOMM, GENDER, PARTICIPANT_TYPE, MUSICAL_TRAINING,
					  MUSIC_KIND, HEARING_PROBLEM, USERCONTROL,PHASENO, "YES",TimeStamp);
				  $('#contactModal').modal('hide');
				  if ($(".fa-user").hasClass('detailsAdded') == false) {
					  $(".fa-user").addClass('detailsAdded');
				  }
				  disableED(false);
				  EMOptions(GROUPID);
			  }
		  else{//if details are not correct
			  alert("Please Enter All and Valid Participant Details");
		  }
		}
		else{// if USER ID is empty
		  alert("Please Select New Participant or Valid USER ID");
	  }
	}
	else{// if consent is not checked
		alert("Please read the consent form and give your consent");
	}
}

// function to save data into file
function save (filename,data){
//	var csvRows = [];
//	for(var i=0, l=data.length; i<l; ++i){
//		console.log(data[i]);
//		csvRows.push(data[i].join(','));
//	}
//	var csvString = csvRows.join("\n");
	var csvString = data.join(',');
	$.ajax({
		type: 'POST',
		data: {'data': csvString,
					 'Name' : filename},
		url: url+write,
		success: function(data) {
			console.log('success: ' + data);
			//alert(data);
		}
	});
}

// function to read Participant Details from file
function readPD (){
	PD = [];
	var select = document.getElementById("userid");
	var options = [];
	$.get(url+read,{ Name: PD_FileName }, function(PD_Result) {
		if(PD_Result.length != 0)
		{
			PD_Result = PD_Result.split('\n');
			for(var i=0; i<PD_Result.length;++i){
				PD.push(PD_Result[i].split(','));
				if(i>0 && PD[i][0]!='' && options.indexOf(PD[i][0])== -1 ){// Select Unique User ID's
					var el = document.createElement("option");
					options.push(PD[i][0]);
					el.text = PD[i][0];
					el.value = i;
					select.appendChild(el);
				}
			}
		}
		console.log('No of Rows in PD:' +PD.length);
	});
}

// function to populate USER Id dropdown
function populatePD(){
	FORM_PD = document.ParticipantDetail;
	if(FORM_PD.USERID.value != 'NewParticipant'){
		var i = FORM_PD.USERID.value;
		FORM_PD.GROUPID.value = PD[i][1];
		FORM_PD.FIRSTNAME.value = PD[i][2];
		FORM_PD.LASTNAME.value = PD[i][3];
		FORM_PD.AGE.value = PD[i][4];
		FORM_PD.EDUCATION.value = PD[i][5];
		FORM_PD.MODEOFCOMM.value = PD[i][6];
		FORM_PD.GENDER.value = PD[i][7];
		FORM_PD.PARTICIPANT_TYPE.value = PD[i][8];
		FORM_PD.MUSICAL_TRAINING.value = PD[i][9];
		MUSIC_KIND = FORM_PD.MUSIC_KIND.value = PD[i][10];
		FORM_PD.HEARING_PROBLEM.value = PD[i][11];
		FORM_PD.USERCONTROL.value = PD[i][12];
		FORM_PD.PHASENO.value = '';
		document.getElementById("PhaseNo").disabled = false;
		disablePD(true);
	}
	else{
		FORM_PD.PHASENO.value = 'Phase_1';
		document.getElementById("PhaseNo").disabled = true;
		disablePD(false);
	}
}

//// function to read Participant Details from file without server
//function readPD (){
//			$.get('ParticipantData/ParticipantDetails.csv', function(PD_Result) {
//				PD_Result = PD_Result.split('\n');
//				ParticipantDetails = [];
//				for(var i= 0; i<PD_Result.length;++i){
//					ParticipantDetails.push([PD_Result[i].split(',')]);
//				}
//				alert(ParticipantDetails);
//			});
//}
