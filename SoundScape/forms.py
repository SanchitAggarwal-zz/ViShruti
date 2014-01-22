#Creating python form for information about the Tester
from flask.ext.wtf import Form, TextField, IntegerField, SelectField, SubmitField, validators, ValidationError


class InformationForm(Form):
    firstname = TextField("First Name", [validators.Required("First Name Required"),
                                         validators.Regexp("^[a-zA-Z]+$", 0, "Valid Name")])
    lastname = TextField("Last Name",
                         [validators.Required("Last Name Required"), validators.Regexp("^[a-zA-Z]+$", 0, "Valid Name")])
    age = IntegerField("Age", [validators.Required("Age Required"), validators.NumberRange(1, 100, "Enter Valid Age")])
    email = TextField("Email", [validators.Required("Email Required"), validators.Email("abc@company.com")])
    contact = IntegerField("Contact", [validators.Required("Contact Required"),
                                       validators.NumberRange(1000000000, 9999999999, "10 digit Number")])
    gender = SelectField(u'Gender', choices=[('Male', 'Male'), ('Female', 'Female')])
    blindtype = SelectField(u'Blind Type', choices=[('Congential', 'Congential'), ('Accidental', 'Accidental'),
                                                    ('Non-Blind', 'Non-Blind')])
    submit = SubmitField("Send")


class TestForm(Form):
    sample = TextField("Sample Played")
    correct = TextField("Correct")
    wrong = TextField("Wrong")
    predicted=TextField("Predicted")
    actual=TextField("Actual")
    error=TextField("Error")
    save = SubmitField("Save")
    check=SubmitField("Check")

class TrainingForm(Form):
    done = SubmitField("Go For Testing")