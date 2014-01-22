// Create my function to be wrapped
var sayStuff = function(str1,str2) {
  alert(str1);
  alert(str2);
}
var wrapFunction = function(fn, context, params) {
  return function() {
    fn.apply(context, params);
  };
}
// Wrap the function.  Make sure that the params are an array.
/*var fun1 = sayStuff.apply(this,"Hi","sanchit");
var fun2 = sayStuff.apply(this,"how","are you?")*/;
var fun2 = wrapFunction(sayStuff, this, new Array('Hi', 'Sanchit'));
var fun1 = wrapFunction(sayStuff, this, new Array('BByyee', 'Dear'));

// Create an array and append your functions to them
var funqueue = [];
funqueue.push(fun1);
funqueue.push(fun2);


var myVar = setInterval(function(){myTimer()},3000);
var flag = 1,index = 10; counter = funqueue.length;
function myTimer()
{
  // Remove and execute all items in the array
  if(flag){
    flag = 0;
    index = 10;
    counter--;
    if(funqueue.length){
    (funqueue.shift())();}
  }
  if(counter<0){
    alert("stop");clearInterval(myVar);
  }
}

function myStopFunction()
{
  if(index==0)
  { // alert("stop");clearInterval(myVar);
  flag = 1;}
  else {alert(event.keyCode);index--;}
}
document.onkeyup = myStopFunction;



/*
var queue = [];

//actions as functions
function attack(params){...}
function block(params){...}
function walk(params){...}

//our animation timer
var animationTimer = setInterval(function(){
  //remove the action from the queue and execute
  var nextAction = queue.shift();
  //if we shifted something, execute
  if(nextAction){
    nextAction.call();
  }
},1000);

//to insert into the queue, push the reference of the function instead.
queue.push(attack);*/
