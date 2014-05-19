var FORM_PD,PHASENO,USERID,PARTICIPANT_TYPE;
var AGE,EDUCATION,MODEOFCOMM,GENDER,MUSICAL_TRAINING,MUSIC_KIND,HEARING_PROBLEM,KEYBOARD_FAMILIARITY;

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

        document.getElementById("ExperimentMode").value = 'Visual_Error_FeedBack_Training';
        document.getElementById("NoOfMaps").value = '10';
        document.getElementById("AccuracyThreshold").value = '90';
        document.getElementById("TestingPathLength").value = '50';
        document.getElementById("InterStimulusInterval").disabled = true;
        document.getElementById("Familirization").disabled = true;
        document.getElementById("InterStimulusInterval").value = '';
        document.getElementById("Familirization").checked = false;
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
        FORM_PD.USERID.value = 'sanchit';
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
    }
}