from flask import Flask, render_template, request, flash
from forms import InformationForm,TestForm,TrainingForm
import datetime
import csv
import synthesis
#import xlwt

app = Flask(__name__)
app.secret_key = 'experiment@20137'
CSRF_ENABLED = True
Information = False
row=[]

def save(row):
    csvfile=open("Experiment.xls","a")
    writer = csv.writer(csvfile)
    writer.writerow(row)

    '''workbook = xlwt.Workbook()
    worksheet = workbook.add_sheet('UserInfo')
    for i in range(0,len(row)):
        worksheet.write(0,i,row[i])
    workbook.save('Experiment2.xls')'''

@app.route('/',methods=['GET','POST'])
def home():
    global Information
    Information=False
    form=InformationForm()
    if request.method == 'POST':
        if form.validate():
            row.append(form.firstname.data)
            row.append(form.lastname.data)
            row.append(form.age.data)
            row.append(form.gender.data)
            row.append(form.blindtype.data)
            row.append(form.email.data)
            row.append(form.contact.data)
            row.append(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            save(row)
            del row[:]
            #.gender.choices[form.gender.data])
            Information= True
            trainingform=TrainingForm()
            #synthesis.Experiment(1,1,1,0,1)
            return render_template('training.html',form=trainingform)
        else:
            print form.errors
            flash('All fields are required.')
            return render_template('home.html', form=form)
    elif request.method == 'GET':
        return render_template('home.html',form=form)

@app.route('/training',methods=['GET','POST'])
def training():
    #synthesis.Experiment(-5,1,1,0,1)
    #return render_template('training.html')
    global Information
    if Information:
        trainingform=TrainingForm()
        if request.method == 'POST':
            testform=TestForm()
            return render_template('testing.html',form=testform)
        else:
            return render_template('training.html',form=trainingform)
    else:
        form=InformationForm()
        return render_template('home.html',form=form)

@app.route('/testing',methods=['GET','POST'])
def testing():
    testform=TestForm()
    global Information
    if not Information:
        form=InformationForm()
        return render_template('home.html',form=form)
    else:
        if request.method == 'POST':
            if 'check' in request.form:
                print "checking"
                actual = request.form['actual']
                predicted = request.form['predicted']
                error = request.form['error']
                row.append("actual")
                row.append(actual)
                row.append("predicted")
                row.append(predicted)
                row.append("error")
                row.append(error)
                save(row)
                print "finish checking"
                del row[:]
                return render_template('testing.html',form=testform)
            else:
                print "saving"
                played = request.form['sample']
                correct = request.form['correct']
                wrong = request.form['wrong']
                print played,wrong,correct
                row.append("Scenario_Played")
                row.append(played)
                row.append("Correct_Identification")
                row.append(correct)
                row.append("Wrong_Identification")
                row.append(wrong)
                save(row)
                print "finish saving"
                del row[:]
                return render_template('testing.html',form=testform)
        else:
            return render_template('testing.html',form=testform)


'''played = request.form.get('sample')
            correct = request.form.get('correct')
            wrong = request.form.get('wrong')#request.form['wrong']
            '''
if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host="0.0.0.0")
