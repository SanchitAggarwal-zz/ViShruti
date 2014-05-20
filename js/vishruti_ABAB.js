var FORM_PD,PHASENO,USERID,PARTICIPANT_TYPE;
var AGE,EDUCATION,MODEOFCOMM,GENDER,MUSICAL_TRAINING,MUSIC_KIND,HEARING_PROBLEM,KEYBOARD_FAMILIARITY;
var ParticipantDetails = [];


// For inserting dummy data in participant details form
function DummyData(){
	FORM_PD = document.ParticipantDetail;
  if(document.getElementById("Dummy").checked){
    FORM_PD.USERID.value = 'Dummy_User';
    FORM_PD.AGE.value = '25';
    FORM_PD.EDUCATION.value = 'MS';
    FORM_PD.MODEOFCOMM.value = 'English';
    FORM_PD.GENDER.value = 'Male';
    FORM_PD.PARTICIPANT_TYPE.value = 'Normal';
    FORM_PD.MUSICAL_TRAINING.value = 'No';
    MUSIC_KIND = FORM_PD.MUSIC_KIND.value = 'None';
    FORM_PD.HEARING_PROBLEM.value = 'No';
    FORM_PD.KEYBOARD_FAMILIARITY.value = 'Yes';
    FORM_PD.PHASENO.value = 'Phase_1';
	  document.getElementById("Consent").checked = true;
    document.getElementById("ExperimentMode").value = 'Visual_Error_FeedBack_Training';
    document.getElementById("NoOfMaps").value = '10';
    document.getElementById("AccuracyThreshold").value = '90';
    document.getElementById("TestingPathLength").value = '50';
		document.getElementById("InterStimulusInterval").disabled = true;
    document.getElementById("Familirization").disabled = true;
    document.getElementById("InterStimulusInterval").value = '';
    document.getElementById("Familirization").checked = false;
    disablePD();
	}
	else{
    FORM_PD.USERID.value = '';
    FORM_PD.AGE.value = '';
    FORM_PD.EDUCATION.value = '';
    FORM_PD.MODEOFCOMM.value = '';
    FORM_PD.GENDER.value = '';
    FORM_PD.PARTICIPANT_TYPE.value = '';
    FORM_PD.MUSICAL_TRAINING.value = '';
    MUSIC_KIND = FORM_PD.MUSIC_KIND.value = '';
    FORM_PD.HEARING_PROBLEM.value = '';
    FORM_PD.KEYBOARD_FAMILIARITY.value = '';
    FORM_PD.PHASENO.value = '';
	  document.getElementById("Consent").checked = false;
    document.getElementById("ExperimentMode").value = '';
    document.getElementById("NoOfMaps").value = '';
    document.getElementById("AccuracyThreshold").value = '';
    document.getElementById("TestingPathLength").value = '';
    document.getElementById("InterStimulusInterval").disabled = false;
    document.getElementById("Familirization").disabled = false;
    document.getElementById("InterStimulusInterval").value = '';
    document.getElementById("Familirization").checked = false;
	}
}

// If Phase 2 or 3 then no need to capture Participant details again
function disablePD(){
	FORM_PD = document.ParticipantDetail;
	if(FORM_PD.PHASENO.value != 'Phase_1'){
	  document.getElementById("inputAge").disabled = true;
	  document.getElementById("Education").disabled = true;
	  document.getElementById("Modeofcommunication").disabled = true;
	  document.getElementById("inputGender").disabled = true;
	  document.getElementById("inputType").disabled = true;
	  document.getElementById("inputMusic").disabled = true;
	  document.getElementById("inputMusicKind").disabled = true;
	  document.getElementById("HearingProblem").disabled = true;
	  document.getElementById("KeyboardFamiliarity").disabled = true;
	}
	else{
    document.getElementById("inputAge").disabled = false;
    document.getElementById("Education").disabled = false;
    document.getElementById("Modeofcommunication").disabled = false;
    document.getElementById("inputGender").disabled = false;
    document.getElementById("inputType").disabled = false;
    document.getElementById("inputMusic").disabled = false;
    document.getElementById("inputMusicKind").disabled = false;
    document.getElementById("HearingProblem").disabled = false;
    document.getElementById("KeyboardFamiliarity").disabled = false;
	}
}

// To validate and store participant details
function participantDetails(){
  FORM_PD = document.ParticipantDetail;
  USERID = FORM_PD.USERID.value;
  AGE = FORM_PD.AGE.value;
  EDUCATION = FORM_PD.EDUCATION.value;
  MODEOFCOMM = FORM_PD.MODEOFCOMM.value;
  GENDER = FORM_PD.GENDER.value;
  PARTICIPANT_TYPE = FORM_PD.PARTICIPANT_TYPE.value;
  MUSICAL_TRAINING = FORM_PD.MUSICAL_TRAINING.value;
  MUSIC_KIND = FORM_PD.MUSIC_KIND.value;
  HEARING_PROBLEM = FORM_PD.HEARING_PROBLEM.value;
  KEYBOARD_FAMILIARITY = FORM_PD.KEYBOARD_FAMILIARITY.value;
  PHASENO = FORM_PD.PHASENO.value;

	if(document.getElementById("Consent").checked){
	  if(USERID != ""){
	    if(PHASENO == 'Phase_1') {
	      if (!(isNaN(AGE) || AGE < 1 || EDUCATION == "" || MODEOFCOMM == "" || GENDER == "" || PARTICIPANT_TYPE == ""
		              || MUSICAL_TRAINING == "" || MUSIC_KIND == "" || HEARING_PROBLEM == "" || KEYBOARD_FAMILIARITY == "")) {

	        ParticipantDetails.push(['USER_ID', 'AGE', 'EDUCATION', 'MODE_OF_COMMUNICATION', 'GENDER', 'PARTICIPANT_TYPE', 'MUSICAL_TRAINING', 'MUSIC_KIND', 'HEARING_PROBLEM', 'KEYBOARD_FAMILIARITY', 'Consent Given']);
	        ParticipantDetails.push([USERID, AGE, EDUCATION, MODEOFCOMM, GENDER, PARTICIPANT_TYPE, MUSICAL_TRAINING, MUSIC_KIND, HEARING_PROBLEM, KEYBOARD_FAMILIARITY, "Yes"]);
		      $('#contactModal').modal('hide');
		      if ($(".fa-user").hasClass('detailsAdded') == false) {
			      $(".fa-user").addClass('detailsAdded');
		      }
		      //enableExperimentParameters();
	      }
		    else{//if details are not correct
		      alert("Please Enter All and Valid Participant Details");
	      }
	    }
		  else if(PHASENO != ""){//if PHASE NO is other than Phase_1
		    $('#contactModal').modal('hide');
		    if ($(".fa-user").hasClass('detailsAdded') == false) {
			    $(".fa-user").addClass('detailsAdded');
		    }
		    //enableExperimentParameters();
	    }
		  else{
		    alert("Please Select a Valid Phase Number");
	    }
	  }
		else{// if USER ID is empty
		  alert("Please Enter USER ID");
	  }
	}
	else{// if consent is not checked
		alert("Please read the consent form and give your consent");
	}
}