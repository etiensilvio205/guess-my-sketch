var c = document.getElementById("myCanvas");
var context = c.getContext("2d");

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var interval;


//colour variety

var curColor="black";
var clickColor = new Array();


function addClick(x, y, dragging)
{
	
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(curColor);
  
  
  
}

function emptyArrays()
{
clickX.length=0;
clickY.length=0;
clickDrag.length=0;
clickColor.length=0;

}







function redraw(){
  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  //context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
	 context.strokeStyle = clickColor[i];
     context.stroke();
  }
  
 
}






 function processMsg(word,M){
 
 
 if(word==M){
 return true;

 }else{
 return false;
 }
 
 }
  

  $(function () {
	  
	 
	  
	
	$('#labelIns').click(function(){
		
		if (document.getElementById("instructions").style.display == "block"){
		document.getElementById("instructions").style.display = "none";
		}else{
		document.getElementById("instructions").style.display = "block";
		}
		
		
	});
	
	var socket=io.connect();
	var newRoom;
	var room;
	
	$('#create').click(function(){
	    modal.style.display = "block";
		$('#gameSet').hide();
		$('#gameArea').show();
		newRoom=$('#createRoomName').val();
		socket.emit('room', newRoom);
	});
	
	$('#enter').click(function(){
		
		
		
		room=$('#roomName').val();
		socket.emit('room', room);
		
	});
	
	var taken=false;
	socket.on('nameControl',function(x){
	
	taken=x;
		if (taken){
			$('#nameControl').show();
		}else{
			socket.emit('send-connected', $('#uname').val());
			$('#nameControl').hide();
			thisName=$('#uname').val();
			$('#unameInput').css({"display":"none"});
			$('#name').text($('#uname').val());
			$('#Greet').show();
			$('#tableConnected').css({"display":"block"});
			$('#uname').val('');
		}
	
	
	
	
	});
	
	var allow=false;
	
	socket.on('control',function(x){
	allow=x;
	
	
	if (allow){
	$('#roomControlmembers').hide();
	$('#gameSet').hide();
	$('#roomControl').hide();
	$('#gameArea').show();

	}else{
	$('#roomControlmembers').hide();
	$('#gameArea').hide();
	$('#gameSet').show();
	$('#roomControl').show();
	emptyArrays();
	clientPlayers.length=0;
	role=null;
	$('#role').hide();
	$('#unameInput').show();
	$('#score').hide();
	t=null;
	$('#timer').hide();
	$('#palette').show();
    $('#spanword').hide();
	$('#word').hide();
	$('#Greet').hide();
	$('#tableConnected').css({"display":"none"});
	setTimeout(function(){location.reload();},3000);
	}
	
	});
	
	
	
    $('form').submit(function(){
      socket.emit('chat message', {"msg":$('#m').val(),"time":t,"client":clientPlayers,"d":sketch});
      $('#m').val('');
      return false;
    });
	
	$('#enter').click(function(){
		$('#gameSet').hide();
		$('#gameArea').show();
		
	});
	
	//drawing on canvas 
	
	
	
	//support for mobile touches
	$('#myCanvas').on('touchstart',function(e){
	socket.emit('paint',true);
	var touch=e.originalEvent.touches[0];
	socket.emit('mousedown', {"X":touch.pageX - this.offsetLeft,"Y":touch.pageY - this.offsetTop,"dragging":false});
	e.preventDefault();
	e.stopPropagation();
	});
	
	$('#myCanvas').on('touchend',function(e){
	socket.emit('paint',false);
	e.preventDefault();
	e.stopPropagation();
	});
	
	$('#myCanvas').on('touchmove',function(e){
	 if(paint){
		var touch=e.originalEvent.touches[0];
		socket.emit('mousemove', {X:touch.pageX - this.offsetLeft,Y:touch.pageY - this.offsetTop,"dragging":true});
		e.preventDefault();
		  e.stopPropagation();
	  }
	});
	
	
	
	
	//support for desktops (mouse drawing)
	$('#myCanvas').mousedown(function(e){
	socket.emit('paint',true);
	socket.emit('mousedown', {"X":e.pageX - this.offsetLeft,"Y":e.pageY - this.offsetTop,"dragging":false});
	});
	
	
		
	  
	  	$('#black').click(function(){
			RandomWord();
			socket.emit('addColor',"black");	
	    });
		
		$('#white').click(function(){
			
			socket.emit('addColor',"white");	
			
	    });
		
		
		
		
		socket.on('pushColor',function(c){
			
			
			curColor=c;
			
		});
		
	socket.on('paint', function(p){
	paint=p;
	});
	
	socket.on('mdown', function(positiondown){
		
	addClick(positiondown.X, positiondown.Y,positiondown.dragging,positiondown.color);
	redraw();
	});

	$('#myCanvas').mousemove(function(e){
	  if(paint){
		socket.emit('mousemove', {"X":e.pageX - this.offsetLeft,"Y":e.pageY - this.offsetTop,"dragging":true,"color":curColor});
	  }
	});
	
	socket.on('mmove', function(positionmove){
		
	 addClick(positionmove.X, positionmove.Y, positionmove.dragging,positionmove.color);
	 redraw();
	});

	$('#myCanvas').mouseup(function(e){
	  socket.emit('paint',false);
	});
	
	$('#clear').click(function(){
	  socket.emit('clear', true);
	});
	
	socket.on('clear', function(c){
	if (c==true){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	emptyArrays();
	}
	});

	$('#myCanvas').mouseleave(function(e){
	  socket.emit('paint',false);
	});
	
	
    socket.on('chat', function(msg){
	
	  if (msg.ans==true){
		if((window.navigator.userLanguage || window.navigator.language)=='fr'){
			$('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#638c6b;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" a trouvé la réponse!"));
		}else{
	   $('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#638c6b;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" found the answer!"));
		}
		//$('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#638c6b;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').append(msg.nkname+'<span class="w3-badge w3-left">'+msg.points+"</span> found the answer"));
	  }else if(msg.ans=="cheat"){
		  if((window.navigator.userLanguage || window.navigator.language)=='fr'){
			 $('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#ba574c;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" essaie de tricher!"));
		   
		  }else{
		$('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#ba574c;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" is trying to cheat!"));
		  }
	  }else if(msg.ans=="answered"){
		  if((window.navigator.userLanguage || window.navigator.language)=='fr'){
			 $('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#ba574c;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" a déjà répondu!"));
		 
		  }else{
		$('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#ba574c;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+" already answered!"));
		  }
	  }
	  else{
	  $('#chatbox').append($('<div class="w3-small w3-btn w3-animate-zoom" style="background-color:#a5a7a8;color:white;width:100%;text-align:left;border-radius:3px;margin-bottom:3px;"></div>').text(msg.nkname+": "+msg.message));
	 
		}
	  $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
	  
    });
	
	var tableArray=[];
	var thisName;
	$("#btname").click(function(){
    socket.emit('send-nickname', {"name":$('#uname').val(),"language":window.navigator.userLanguage || window.navigator.language});
	
	
    });
	
	socket.on('send-connected', function(n){
		if(!n.leave){
			for  (var i=0;i<n.length;i++){
				
				if (tableArray.indexOf(n[i].name,0)==-1){
					tableArray.push(n[i].name);
					
						for (var j=tableArray.length-1;j<tableArray.length;j++){
							
							if((window.navigator.userLanguage || window.navigator.language)=='fr'){
							$('#connected').append($('<tr><td>').text(tableArray[j]+" a rejoint la partie"));
							}
							else{
								
							$('#connected').append($('<tr><td>').text(tableArray[j]+" joined"));	
							}
						}
					
				}
			}
		}
		else{
		
				
				
					tableArray.push(n.Lname);
					
						for (var j=tableArray.length-1;j<tableArray.length;j++){
							if((window.navigator.userLanguage || window.navigator.language)=='fr'){
							$('#connected').append($('<tr><td><font color="red"').text(tableArray[j]+" a quitté la partie"));	
							}else{
							$('#connected').append($('<tr><td><font color="red"').text(tableArray[j]+" left"));
							}
						}
					
				
			
			
		
		}
				
			
	});
	
	var stop=false;
	var checkScore;
	socket.on('showStart',function(s){
		if (s==true){
			
			$("#startBtn").show();
			
		}
	});
	
	$("#score").text(0);
	$("#wordGuessed").text(0);
	$("#drawingGuessed").text(0);
	

	socket.on('score',function(score){
	
	clientPlayers=score.server;
	checkScore=score.score;
		$("#score").text(score.score);
	
		$("#wordGuessed").text(score.wguessed);
		$("#drawingGuessed").text(score.dguessed);
		
		if (checkScore>100){
			$('#red').css("background-color", "red");
			$('#red').click(function(){
			socket.emit('addColor',"red");	
		     });
			 
			$('#achievement').css("display", "block");
			setTimeout(function(){$('#achievement').css("display", "none");},3000);
		}
		
		if (checkScore>200){
			$('#orange').css("background-color", "orange");
			$('#yellow').css("background-color", "yellow");
			$('#orange').click(function(){
			socket.emit('addColor',"orange");	
			});
			
			$('#yellow').click(function(){
			socket.emit('addColor',"yellow");	
	        });
			
			$('#achievement').css("display", "block");
			setTimeout(function(){$('#achievement').css("display", "none");},3000);
			
	    }
			
		
			if (checkScore>300){
			$('#blue').css("background-color", "blue");
			$('#violet').css("background-color", "violet");
			$('#blue').click(function(){
			socket.emit('addColor',"blue");	
			});
		
			$('#violet').click(function(){
			socket.emit('addColor',"violet");	
			});
			
			$('#achievement').css("display", "block");
			setTimeout(function(){$('#achievement').css("display", "none");},3000);
			
	   
			
		}
		
		
		
	});
	
	var role;
	socket.on('role',function(r){
	
	role=r.role;
		if (r.role=='Guessor'){
		
		 $('#drawer').show();
		 $('#palette').hide();
		 $('#spanword').hide();
		 $('#word').hide();
		 $('#myCanvas').off('mousedown');
		 $('#myCanvas').off('mousemove');
		 $('#myCanvas').off('mouseup');
		 $('#myCanvas').off('touchstart');
		 $('#myCanvas').off('touchmove');
		 $('#myCanvas').off('touchend');
		 
		}else if(r.role=="Drawer"){
		$('#palette').show();
		$('#word').text('"'+r.word+'"');
		$('#spanword').show();
		$('#word').css({"display":"block"});
		$('#drawer').hide();
		
		
		 $('#myCanvas').on('mousedown',function(e){
			socket.emit('paint',true);
			socket.emit('mousedown', {X:e.pageX - this.offsetLeft,Y:e.pageY - this.offsetTop,dragging:false});
			redraw();
			});
		 $('#myCanvas').on('mousemove',function(e){
			  if(paint){
				socket.emit('mousemove', {X:e.pageX - this.offsetLeft,Y:e.pageY - this.offsetTop,dragging:true});
			  }
			});
		 $('#myCanvas').on('mouseup',function(e){
			  socket.emit('paint',false);
			});
		
				$('#myCanvas').on('touchstart',function(e){
				socket.emit('paint',true);
				var touch=e.originalEvent.touches[0];
				socket.emit('mousedown', {X:touch.pageX - this.offsetLeft,Y:touch.pageY - this.offsetTop,dragging:false});
				
				});
				
				$('#myCanvas').on('touchend',function(e){
				socket.emit('paint',false);
				});
				
				$('#myCanvas').on('touchmove',function(e){
				 if(paint){
					var touch=e.originalEvent.touches[0];
					socket.emit('mousemove', {X:touch.pageX - this.offsetLeft,Y:touch.pageY - this.offsetTop,dragging:true});
				  }
				})
		}
		
		$('#role').text(r.role);
		$('#role').show();
	
	});
	
	$("#startBtn").click(function(){
		socket.emit('startGame',{"round":round,"t":0});
		
		started=true;
	});
	
	var clientPlayers=[];
	var t;
	var round=0;
	var sketch;
	var thisGame;
	
	socket.on('start',function(sg){
		clientPlayers=sg.template;
		
		sketch=sg.d;
		
		if (sg.permit=="begin"){
		$("#playerscon").hide();
		$("#connected").hide();
		$("#startBtn").hide();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	    emptyArrays();
		$('#score').show();
		$('#timer').show();
		$('#playground').show();
		
		
		for (var i=0;i<clientPlayers.length;i++){
			
			if (clientPlayers[i].role=="Drawer"){
				if((window.navigator.userLanguage || window.navigator.language)=='fr'){
				$('#drawer').text(clientPlayers[i].name+" dessine...");
				}else{
				$('#drawer').text(clientPlayers[i].name+" is drawing...");
				}
			}
		}
		
		
		
		
		  
		
		if (started==true){
		socket.emit('startTimer',{"t":60,"round":round});
		started=false;
		}
		
		}
	
	});
	
	
	socket.on('win',function(T){
	if((window.navigator.userLanguage || window.navigator.language)=='fr'){
	$('#achievement').text("Vous remportez cette partie♥!");
	$('#achievement').css("display", "block");
	}else{
		
	$('#achievement').text("You win♥!");	
	$('#achievement').css("display", "block");
	}
	
	
	});
	
	socket.on('Lose',function(T){
	if((window.navigator.userLanguage || window.navigator.language)=='fr'){
	$('#achievement').text("Vous avez perdu!");
	$('#achievement').css("display", "block");
	}else{
	$('#achievement').text("You lose!");
	$('#achievement').css("display", "block");
	}
	
	});
	
	
	var started=false;
	
	
	
	socket.on('setTime',function(x){
	t=x.t;
	round=x.round;

	
	
	$('#timer').text(t);
	
	if ((round==(clientPlayers.length*3))&&(t==0)){
		 thisGame=false;
		 if((window.navigator.userLanguage || window.navigator.language)=='fr'){
			t="Partie terminée!";
		 }else{
			t="Game Over!"; 
		 }
		
		 $('#drawer').hide();
		 $('#spanword').hide();
		 $('#word').hide();
		 $('#timer').text(t);
		 
		 
		 var max=0;
		
		 var id;
		 for (var i=0;i<clientPlayers.length;i++){
			
			if (clientPlayers[i].points>max){
			max=clientPlayers[i].points;
			id=clientPlayers[i].id;
			
			}
		 
		 }
		 
		 
		 socket.emit('displayWin',{"msg":"You are the winner","id":id});
		 
		 for (var i=0;i<clientPlayers.length;i++){
			if (clientPlayers[i].id!==id){
			socket.emit('displayLose',{"msg":"You are the winner","id":clientPlayers[i].id});
			}
		 
		 }
		
		 socket.emit('deleteRoom',true);
		 
	 }
	 else if (((t==0)&&(round<(clientPlayers.length*3)))||(stop==true)){
		
	
		  $('#spanword').hide();
		  $('#word').hide();
		  $('#drawer').hide();
		  started=true;
		  var c=clientPlayers;
		  
		  if (round<c.length-1||round==c.length-1){
						 c[round].role="Drawer";
						 c[round-1].role="Guessor";
						 }
						 else if ((round>c.length-1)&&(round<((c.length*2)-1)+1)){
									var dummy=round-c.length;
										if(dummy==0){
										 c[dummy].role="Drawer";
										 c[dummy+(c.length-1)].role="Guessor";
										 }
										 else
										 {
										 c[dummy].role="Drawer";
										 c[dummy-1].role="Guessor";
										 
										 }
								}
								 else if (round>((c.length*2)-1)){
									var dummy=round-(c.length*2);
										if(dummy==0){
										 c[dummy].role="Drawer";
										 c[dummy+(c.length-1)].role="Guessor";
										 }
										 else
										 {
										 c[dummy].role="Drawer";
										 c[dummy-1].role="Guessor";
										 
										 }
									
									}
		  
		  
		  
								for (var i=0;i<c.length;i++){
								
									if (c[i].role=="Drawer"){
									
										if (c[i].name==thisName){
										
											//t="Round "+((round+1))+": Click to draw!";
											$('#timer').empty().append($('<img src="pb.png" width="50px"/>'));
											
											var flashing=setInterval(function () {
													var vis = $("#timer").css("visibility");
													vis = (!vis || vis == "visible") ? "hidden" : "visible";
													$("#timer").css("visibility", vis);
													}, 500);
													
											//$('#timer').text(t);
												$('#timer').click(function(){
												clearInterval(flashing);
												 socket.emit('startGame',{"round":round,"t":0,"client":clientPlayers});
												 
												});
										
										
										}else{
										if((window.navigator.userLanguage || window.navigator.language)=='fr'){
										t="Tour "+((round+1));
										}else{
										t="Round "+((round+1));	
											
										}
										$('#timer').text(t);
											$('#timer').off("click");
																	
										
										
										}
									
									
									
									}
								
								
								
								}
		  
		  
		   
	 }
	
	  
	 
	});
	
	 });
