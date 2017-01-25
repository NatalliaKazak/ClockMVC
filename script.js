//Model	
	function Model() {
	  var self = this; 
	  var MyView = null;
	  var tmz = null;
	  self.sizeOfClocks = {h:440, w: 440, cx:220, cy: 220, r:210}
		self.arrows = // стрелки
  		[{name:'sec', x1: 220, y1:240, x2:220, y2:40, r:3},
  		{	name: 'min', x1: 220, y1:240, x2:220, y2:70, r:4},
  		{	name: 'hour',	x1: 220, y1:240, x2:220, y2:100, r:5}];
  	self.circles ={	x: 220, y:220, r:25, rcont:170};//круги зеленые
  	self.num1 ={x: 210, y:225, fsize: 25, rcont:170};//числа по кругу до 10
  	self.num2 ={x: 205, y:225, fsize: 25, rcont:170};// числа по кругупосле 10
  	self.StartCl = function() {
      var date = new Date;
      var TimezoneOffset = tmz;
      var time = date.getTime() + (date.getTimezoneOffset() * 60000) + TimezoneOffset * 3600000; 
      var dif = new Date(time);
  		self.second = dif.getSeconds();
  		self.minute = dif.getMinutes();
  		self.hour = dif.getHours();
  		self.array = //углы
  		  [{name:'#sec',	angle: 6*self.second},
        {	name: '#min', angle: 6*self.minute},
        {	name: '#hour', angle: 30*(self.hour + 1/60*self.minute)}];
        self.UpdateView();
     }
		self.Start = function(View, data) {
	    MyView=View;
		  tmz = data
		  self.StartCl();
		}
		self.UpdateView=function() {
      if ( MyView ){
        MyView.Update();
      }
    };
  }	

//View Canvas	
	function TClockViewCNVS () {
    var self = this;
	  var MyModel = null; 
    var MyField = null;
    var clock = null;
    var clockN = null;
    var arr = null;
    var info = null;
    var Context = null; //canvas only for clocks
    var Ctx = null; //canvas for arrows and running clock
    self.Start=function(Model,Field, Timezone) {
      MyModel=Model;
      MyField=Field;
      clock = MyField.querySelector('#clock');
      Context =  clock.getContext('2d');
      arrowsCNVS = MyField.querySelector('#arrows');
      Ctx =  arrowsCNVS.getContext('2d');
      clockN = MyField.querySelector('#time');
      info= MyField.querySelector('.info');
      info.innerHTML = Timezone;
      self.createNumbers();
    }
    self.Update= function(){
      clear();
      self.moveArrows();
      self.moveClocks();
  	}
  	self.moveArrows = function () {
  	  for (var i = 0; i< MyModel.arrows.length; i++) {
    	  var x =  MyModel.arrows[i].y1-MyModel.arrows[i].y2 +0.5; //длина стрелки
    	  var y = MyModel.arrows[i].r +0.5; //толщина
      	self.createArrows(MyModel.array[i].angle*Math.PI/180,x,y);
    	}
    }
		self.moveClocks = function () {
  		Ctx.fillText(checktime(MyModel.hour) + ':' + checktime(MyModel.minute) + ':' + checktime(MyModel.second), 220, 130);
    	function checktime(time) {
    		if (time < 10) {
    			time ="0" + time;
    		}
    		return time;
    	}
  	}
   	self.createNumbers = function () {
     	Context.globalCompositeOperation = 'source-over';
  		Context.strokeStyle = 'gold';
  		Context.fillStyle = 'gold';
  		Context.arc(MyModel.sizeOfClocks.cx, MyModel.sizeOfClocks.cy, MyModel.sizeOfClocks.r, 0 ,Math.PI*2, false);
  		Context.stroke();
  		Context.fill();  		
  		Context.globalCompositeOperation = 'source-over';
  		for (var n = 1; n <= 12; n++) {
        var array = self.setRounds(n, MyModel.circles.rcont,MyModel.circles.x, MyModel.circles.y);
    		Context.strokeStyle = 'green';
    		Context.fillStyle = 'green';
    		Context.beginPath();
    		Context.arc(array.x+0.5,array.y+0.5,MyModel.circles.r+0.5,0,Math.PI*2, false);
    		Context.stroke();
    		Context.fill();
  	  }
  	  Context.globalCompositeOperation = 'source-over';
  	  Context.font = MyModel.num1.fsize+'px Arial';
  		Context.fillStyle = '#000';
  		Context.textAlign = 'center';
  		Context.textBaseline = 'middle';
  	  for (var n = 1; n <= 12; n++) {
  	   	var array = self.setRounds(n, MyModel.circles.rcont,MyModel.circles.x, MyModel.circles.y);
  	    Context.fillText(n, array.x, array.y);
  	  }
    }	
  	self.setRounds = function(n, rcont, posx, posy) { 
    	var angle = (n - 3) * (Math.PI * 2) / 12;
	    var x = rcont * Math.cos(angle) + posx;
	    var y = rcont * Math.sin(angle) + posy;
	    return {x:x, y:y};
  	}
    self.createArrows = function(pos,r,w){
      Ctx.globalCompositeOperation = 'source-over';
  		Ctx.font = '35px Arial';
  		Ctx.fillStyle = '#000';
  		Ctx.textAlign = "center";
  		Ctx.textBaseline = 'middle';
  		Ctx.globalCompositeOperation = 'source-over';
   		Ctx.lineWidth = w;
  		Ctx.strokeStyle = 'black';
      Ctx.beginPath();
      Ctx.moveTo(MyModel.sizeOfClocks.cx,MyModel.sizeOfClocks.cy);
      Ctx.lineTo(MyModel.sizeOfClocks.cx + r * Math.cos(pos - Math.PI/2),
                MyModel.sizeOfClocks.cy + r * Math.sin(pos - Math.PI/2));
      Ctx.stroke();
      Ctx.closePath();
    }
    function clear() {
    	Ctx.clearRect(0, 0, Context.canvas.width, Context.canvas.height);
    }
  } 

//View DOM
  function TClockViewDOM () {
	  var self = this;
	  var MyModel = null; 
    var MyField = null;
    var clock = null;
    var clockN = null;
    var arr = null;
    var info = null;
    self.Start=function(Model,Field, Timezone) {
      MyModel=Model;
      MyField=Field;
      clock = MyField.querySelector('.clock');
      clockN = MyField.querySelector('#time');
      info= MyField.querySelector('.info');
      info.innerHTML = Timezone;
      self.createNumbers();
      self.createArrows();
    }
    self.Update= function(){
      self.moveClocks();
  		self.moveArrows();
  	}
		self.moveArrows = function () {
		  for (var n =0; n < MyModel.array.length; n++) {
				var arrows=  MyField.querySelectorAll(MyModel.array[n].name);
				for (var i =0; i < arrows.length; i++){
					arrows[i].style.webkitTransform = 'rotateZ('+ MyModel.array[n].angle +'deg)';
					arrows[i].style.transform = 'rotateZ('+ MyModel.array[n].angle +'deg)';
				}
		  }
		}
		self.moveClocks = function () {
			clockN.textContent = checktime(MyModel.hour) + ':' + checktime(MyModel.minute) + ':' + checktime(MyModel.second);
			function checktime(time) {
				if (time < 10) {
					time ="0" + time;
				}
				return time;
			}
		}
  	self.createNumbers = function () {
  		var gContainer = document.createElement('div');
  		gContainer.setAttribute('class', 'gcontainer')
  		for (var i = 1; i <= 12; i++) {
  			var gContent = document.createElement('div');
  			var gSpan = document.createElement('span');
  			gSpan.innerHTML = i;
  			gContent.setAttribute('class', 'rounds-green')
  			gSpan.setAttribute('class', 'num'+i)
  			gContent.appendChild(gSpan);
  			gContainer.appendChild(gContent);
  		}
  		clock.appendChild(gContainer)
  		var array = MyField.querySelectorAll('.rounds-green');
  		self.setRounds(array, MyModel.num1.rcont);
  	}
	
  	self.setRounds = function(array, rcont) {
  		for (var i = 0; i < 12; i++) {
  		  var angle = (i - 2) * (Math.PI * 2) / 12;
  			array[i].style.left =  rcont * Math.cos(angle) + 'px';
  		  array[i].style.top = rcont * Math.sin(angle) + 'px';
  		}
  	}
  
  	self.createArrows = function () {
  	  for (var i = 0; i < MyModel.arrows.length; i++) {
    		var arrow = document.createElement('div');
    		arrow.setAttribute("id",MyModel.arrows[i].name);
    		console.log(arrow );
    		arrow.style.height = MyModel.arrows[i].y1-MyModel.arrows[i].y2+ 'px';
    		arrow.style.width = MyModel.arrows[i].r + 'px';
    		arrow.style.position = 'absolute';
     		arrow.style.backgroundColor = 'black';
    		arrow.style.marginTop = MyModel.arrows[i].y2 +'px';
    		clock.appendChild(arrow)
  	  }
    }
  }

//View SVG	
	function TClockViewSVG () {
	  var svgns = "http://www.w3.org/2000/svg";
	  var self = this;
	  var MyModel = null; 
    var MyField = null;
    var clock = null;
    var clockN = null;
    var arr = null;
    var info = null;
    self.Start=function(Model,Field, Timezone) {
      MyModel=Model;
      MyField=Field;
      clock = MyField.querySelector('#clock');
      clockN = MyField.querySelector('#time');
      info= MyField.querySelector('.info');
      info.innerHTML = Timezone;
      self.createNumbers();
      self.createArrows();
    }
    self.Update= function(){
      self.moveClocks();
  		self.moveArrows();
  	}
		self.moveArrows = function () {
		  for (var n =0; n < MyModel.array.length; n++) {
				var arrows=  MyField.querySelectorAll(MyModel.array[n].name);
				for (var i =0; i < arrows.length; i++){
					arrows[i].setAttributeNS(null, 'transform','translate(0 0) rotate('+ MyModel.array[n].angle+', '+MyModel.sizeOfClocks.cx+','+MyModel.sizeOfClocks.cy+')');
				}
		  }
		}
		self.moveClocks = function () {
			clockN.textContent = checktime(MyModel.hour) + ':' + checktime(MyModel.minute) + ':' + checktime(MyModel.second);
			function checktime(time) {
				if (time < 10) {
					time ="0" + time;
				}
				return time;
			}
		}
   	self.createNumbers = function () {
   	  clock.setAttributeNS(null,"width", MyModel.sizeOfClocks.w);
  		clock.setAttributeNS(null,"height", MyModel.sizeOfClocks.h);
  		for (var i = 1; i <= 12; i++) {
  			var myCircle =  document.createElementNS(svgns,"circle"); 
  			var myText=  document.createElementNS(svgns,"text");
  			myText.setAttributeNS(null,"fill","black");
  			myText.setAttributeNS(null,"font-size", MyModel.num1.fsize);
  			myText.setAttributeNS(null,"id","num");
  			myText.textContent = i;
  		  myCircle.setAttributeNS(null,"id","green-circle");
  		  myCircle.setAttributeNS(null,"r", MyModel.circles.r);
  		  myCircle.setAttributeNS(null,"fill","green");
  		  clock.appendChild(myCircle);
  		  clock.appendChild(myText);
  		}
  		var arrayRounds =  MyField.querySelectorAll("#green-circle");
  		var arrayNum =  MyField.querySelectorAll("#num");
  		self.setRounds(arrayRounds, 'cx', 'cy', MyModel.circles.x, MyModel.circles.y,MyModel.circles.rcont, 'round');
  		self.setRounds(arrayNum, 'x', 'y', MyModel.num1.x, MyModel.num1.y, MyModel.num1.rcont, 'num1');
  		self.setRounds(arrayNum, 'x', 'y', MyModel.num2.x, MyModel.num2.y, MyModel.num2.rcont, 'num2');
  	}
  	self.setRounds = function(array, x, y, posx, posy, r, id) {
  	  for  (var i = 0; i < 12; i++){
  	    var angle = (i - 2) * (Math.PI * 2) / 12;
  			if(id === "round" || (id ==='num1' && i < 9)){
    				array[i].setAttributeNS(null, x, r * Math.cos(angle) + posx);
    				array[i].setAttributeNS(null, y, r * Math.sin(angle) + posy);
  			 }else if(id ==='num2' && i > 8  )  {
    				array[i].setAttributeNS(null, x, r * Math.cos(angle) + posx);
    				array[i].setAttributeNS(null, y, r * Math.sin(angle) + posy);
			  }
			}
		}
  	self.createArrows = function () {
  	  for (var i = 0; i < MyModel.arrows.length; i++) {
    		var arrow = document.createElementNS(svgns,"line");
    		arrow.setAttributeNS(null,"id",MyModel.arrows[i].name);
    		arrow.setAttributeNS(null,"x1", MyModel.arrows[i].x1);
    		arrow.setAttributeNS(null,"y1", MyModel.arrows[i].y1);
    		arrow.setAttributeNS(null,"x2", MyModel.arrows[i].x2);
    		arrow.setAttributeNS(null,"y2", MyModel.arrows[i].y2);
    		arrow.setAttributeNS(null,"stroke","black");
    		arrow.setAttributeNS(null,"stroke-width",MyModel.arrows[i].r);
    		clock.appendChild(arrow)
  	  }
  	}
  } 

//Controller  
  function Controller() {
    var self = this;
    var timer = null;
    var MyModel = null; 
    var MyField = null; 
    self.Start=function(Model,Field) {
      MyModel=Model;
      MyField=Field;
      var ButtonStop=MyField.querySelector('.btnStop');
      ButtonStop.addEventListener('click',self.StopBtn);
      var ButtonStart=MyField.querySelector('.btnStart');
      ButtonStart.addEventListener('click',self.StartBtn);
      StartTimer ();
    }
    self.StartBtn=function() {
      StartTimer ();
    }
    self.StopBtn=function() {
      clearInterval(timer);
    }
    function StartTimer () {
      setTimeout(function(){MyModel.StartCl();}, 200)
    	clearInterval(timer);
    	timer=setInterval(function(){MyModel.StartCl();}, 1000) 
    }
  } 
  
    var ModelClockSVG1 = new Model();
    var ModelClockSVG2 = new Model();
    var ClockViewSVG1 = new TClockViewSVG();
    var ClockViewSVG2 = new TClockViewSVG();
    var ControllerSVG1 = new Controller();
    var ControllerSVG2 = new Controller();

    var ModelClockDOM1 = new Model();
    var ModelClockDOM2 = new Model();
    var ClockViewDOM1 = new TClockViewDOM;
    var ClockViewDOM2 = new TClockViewDOM;
    var ControllerDOM1 = new Controller();
    var ControllerDOM2 = new Controller();
    
     var ModelClockCNVS1 = new Model();
    var ModelClockCNVS2 = new Model();
    var ClockViewCNVS1 = new TClockViewCNVS;
    var ClockViewCNVS2 = new TClockViewCNVS;
    var ControllerCNVS1 = new Controller();
    var ControllerCNVS2 = new Controller();
    
  function createClocks (Model,View, Contr, id,infoGMT, GMT ) {
    var Container=document.getElementById(id);
    View.Start(Model,Container,infoGMT);
    Model.Start(View, GMT);
    Contr.Start(Model,Container);
  }
  createClocks (ModelClockDOM2,ClockViewDOM2, ControllerDOM2, 'clockDOM2', 'Токио (GMT+9)', +9);
  createClocks (ModelClockDOM1,ClockViewDOM1, ControllerDOM1, 'clockDOM1', 'Лондон (GMT)', 0);
  createClocks (ModelClockSVG2,ClockViewSVG2, ControllerSVG2, 'clockSVG2', 'Минск (GMT+3)', +3);
  createClocks (ModelClockSVG1,ClockViewSVG1, ControllerSVG1, 'clockSVG1', 'Нью-Йорк (GMT-5)', -5);
  createClocks (ModelClockCNVS2,ClockViewCNVS2, ControllerCNVS2, 'clockCNVS2', 'Берлин(GMT+1)', +1);
  createClocks (ModelClockCNVS1,ClockViewCNVS1, ControllerCNVS1, 'clockCNVS1', 'Владивосток(GMT+10)', +10);
