
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var EventEmitter = require("events").EventEmitter;



var user;
var users=[];

var words=["UMBRELLA","BOTTLE","MOUSE","TELEVISION","BEACH","MOUNTAIN","TELEPHONE","APPLE","ORANGE","FISH","HOUSE","INTERNET","WALLET","RAINBOW"];

function drawing(word,duration){
	this.word=word;
	this.duration=duration;
	
}

function game(players,drawing){
	this.players=players;
	this.winner='';
	this.losers=[];
	this.drawing=drawing;
	
	
}

function player(name,id,room,role){
	this.name=name;
	this.id=id;
	this.points=0;
	this.room=room;
	this.role=role;
	this.game;
	this.wordguessed=0;
	this.drawingguessed=0;
	this.answered=false;
	
}

 function processMsg(word,M){
 
 
 if(word==M){
 return true;

 }else{
 return false;
 }
 
 }




var arrays=[];




io.on('connection', function(socket){ 
socket.on('send-nickname', function(nickname) {
	
	
	var found=false;
	              var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
					var connected=[];
					for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
						const nm = io.nsps['/'].connected[socketID].nickname;
						const nmi = io.nsps['/'].connected[socketID].id;			
							connected.push(new player(nm,nmi,roomCheck,"Guessor"));
					  }
		
		
		for (var i=0;i<connected.length;i++){
			if(connected[i].name==nickname){
				found=true;
				break;
			}
		}

	if (found==false){
		socket.nickname=nickname;
		io.to(socket.id).emit('nameControl',found);
		
		if (connected.length>1){
			io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('showStart',true);
		}
		
	}else{
			
			io.to(socket.id).emit('nameControl',found);
		}	
		
		 
	
		
	});
	
socket.on('room', function(r) {
	
if(typeof io.nsps['/'].adapter.rooms[r]!='undefined'){
			
			
			
					if ((typeof io.nsps['/'].adapter.rooms[r].active=='undefined')&&(r!=='')){
						socket.join(r);
						io.to(socket.id).emit('control',true); 
					
					}else{
						io.to(socket.id).emit('control',"errorMsg");
					}
					  // if (socket.rooms.active==true){
							// io.to(socket.id).emit('control',false);
					  // }else{
						  
						 // socket.join(r);
						 // io.to(socket.id).emit('control',true); 
					  // } 
	
	
}else if(r==''){
	
	io.to(socket.id).emit('control',false);
	
	//check eror msgs not displaying, page loading too fast
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}else{
	
	
	socket.join(r);
    io.to(socket.id).emit('control',true);
}
					
					
					
					  
	
	
	
	
	
});
	
socket.on('startGame',function(sg){
		var clientArray=sg.client;
		if(sg.round>0){
			
			      var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
					var connected=[];
					for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
						const nm = io.nsps['/'].connected[socketID].nickname;
						const nmi = io.nsps['/'].connected[socketID].id;			
							connected.push(new player(nm,nmi,roomCheck,"Guessor"));
					  }
			
			if (sg.round<connected.length-1||sg.round==connected.length-1){
						 connected[sg.round].role="Drawer";
						 connected[sg.round-1].role="Guessor";
						 }
						 
						 else if ((sg.round>connected.length-1)&&(sg.round<((connected.length*2)-1)+1)){
									var dummy=sg.round-connected.length;
										if(dummy==0){
										 connected[dummy].role="Drawer";
										 connected[dummy+(connected.length-1)].role="Guessor";
										 }
										 else
										 {
										 connected[dummy].role="Drawer";
										 connected[dummy-1].role="Guessor";
										 
										 }
								}
								 else if (sg.round>((connected.length*2)-1)){
									var dummy=sg.round-(connected.length*2);
										if(dummy==0){
										 connected[dummy].role="Drawer";
										 connected[dummy+(connected.length-1)].role="Guessor";
										 }
										 else
										 {
										 connected[dummy].role="Drawer";
										 connected[dummy-1].role="Guessor";
										 
										 }
									
									}
									
						//update points
						
					
						
						
						for (var i=0;i<connected.length;i++){
							
							for (var j=0;j<clientArray.length;j++){
								
								if (connected[i].id==clientArray[j].id){
									connected[i].points=clientArray[j].points;
									connected[i].wordguessed=clientArray[j].wordguessed;
									connected[i].drawingguessed=clientArray[j].drawingguessed;
									connected[i].answered=false;
									
								}
								
								
							}
							
						}
						
						
			

		}else{
			
					var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
					io.nsps['/'].adapter.rooms[roomCheck].active=true;
					var connected=[];
					for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
						const nm = io.nsps['/'].connected[socketID].nickname;
						const nmi = io.nsps['/'].connected[socketID].id;			
							connected.push(new player(nm,nmi,roomCheck));
					  }
					
					 
					for (var i=0;i<connected.length;i++){
						connected[i].role="Guessor";
					}
					connected[0].role="Drawer";
		
		        }
		
		
		
		 var adrawing=new drawing(words[Math.floor(Math.random() * words.length)],30);
		var myGame=new game(connected,adrawing);
		
		
		for (var j=0;j<connected.length;j++){
			io.to(connected[j].id).emit('role',{"role":connected[j].role,"word":adrawing.word});
			
		}
		
		
		// var count=100;
		// setInterval(function(){console.log(count--);},1000);
		
		io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('start',{"permit":"begin","template":connected,"d":adrawing});
		
		
		
		
	});
socket.on('displayWin',function(T){
	
	
	io.to(T.id).emit('win',T.msg);
	
	
});

socket.on('displayLose',function(T){
	
	
	io.to(T.id).emit('Lose',T.msg);
	
	
});

socket.on('startTimer',function(r){
	var interval;

	var t=r.t;
	var round=r.round;
	
	
    io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('setTime',{"t":t,"round":round});
	
	interval=setInterval(function(){	
	
	t--;
	
		// console.log(socket.nickname);
		// console.log("Time:"+t+", Round:"+round);
			if (t==0){
				    round++;
					clearInterval(interval);
					
				}
				
				
						
				io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('setTime',{"t":t,"round":round});
				
				// if (t==0){
					
					// var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
					// var connected=[];
					// for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
						// const nm = io.nsps['/'].connected[socketID].nickname;
						// const nmi = io.nsps['/'].connected[socketID].id;			
							// connected.push(new player(nm,nmi,roomCheck));
					  // }
					  
						// if ((round==(connected.length*3))){
							// delete io.nsps['/'].adapter.rooms[roomCheck];
						 // }	
				// }				

	},1000);
	
	
	
	
});

socket.on('deleteRoom',function(x){
	
	var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
	delete io.nsps['/'].adapter.rooms[roomCheck];
	
});


// socket.on('timer', function(t){
     // var time=t.t;
	 // var round=t.round;
	 // var template=t.client;
	 // console.log("6");
	 // if ((round==(template.length*3))&&(time==0)){
		 
		 // io.to(socket.id).emit('timeover',{"type":"end"});
	 // }
	 // else if ((time==0)&&(round<(template.length*3))){
		
		 // io.to(socket.id).emit('timeover',{"type":"endOfRound"});
		 
	 // }
	// });
	
	
socket.on('send-connected', function(name){
	var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
	var connected=[];
	for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
            const nm = io.nsps['/'].connected[socketID].nickname;
			const nmi = io.nsps['/'].connected[socketID].id;
				connected.push(new player(nm,nmi,roomCheck));
          }
	
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('send-connected',connected);
	});	


// socket.on('disconnect', function(){


// if (members==(total-1)){
     
	
// }
	
	// });
				  
 // socket.on('chat message', function(msg){
	// console.log(socket.nickname+':'+ msg);
	// });

socket.onclose=function(){
var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];

var connected=[];
if (typeof roomCheck!='undefined'){
	
for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
            const nm = io.nsps['/'].connected[socketID].nickname;
			const nmi = io.nsps['/'].connected[socketID].id;
				connected.push(new player(nm,nmi,roomCheck));
          }	
		  
		  io.sockets.to(roomCheck).emit('send-connected',{"Lname":socket.nickname,"leave":true});
		  socket.leave(roomCheck);
		  
}



if (connected.length==2){
	io.sockets.to(roomCheck).emit('control',false);
	io.nsps['/'].adapter.rooms[roomCheck].active=false;
	let roomObj = io.nsps['/'].adapter.rooms[roomCheck];
        Object.keys(roomObj.sockets).forEach(function(id) {
            io.sockets.connected[id].leave(roomCheck);
			console.log("completed");
        })
    
}
}
	

	

	
socket.on('chat message', function(m){
	
	
	var connected=m.client;
	  
	var treated=m.msg.toUpperCase();
	var sketch=m.d.word;
	if(m.time>0){
		
		if (processMsg(sketch,treated)==true){
			
			for (var i=0;i<connected.length;i++){
				if(connected[i].role=="Drawer"){
					
					if (connected[i].name==socket.nickname){
						io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":"cheat"});
						
					}
					else if((connected[i].name!==socket.nickname)&&(connected[i].answered==false)){
					
					
								connected[i].points=connected[i].points+(m.time*1);
								connected[i].drawingguessed=connected[i].drawingguessed+1;
								connected[i].answered=true;
								io.to(connected[i].id).emit('score',{"wguessed":connected[i].wordguessed,"score":connected[i].points,"dguessed":connected[i].drawingguessed});
								io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":true});
						
					
				    }else if((connected[i].name!==socket.nickname)&&(connected[i].answered==true)){
						
								
						io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":"answered"});
						
					}
				
				}else{
					
					if((connected[i].name==socket.nickname)&&(connected[i].answered==false)){
						
								connected[i].points=connected[i].points+(m.time*2);
								connected[i].wordguessed=connected[i].wordguessed+1;
								connected[i].answered=true;
								io.to(connected[i].id).emit('score',{"wguessed":connected[i].wordguessed,"score":connected[i].points,"dguessed":connected[i].drawingguessed});
								//io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":true});
						
					}else if((connected[i].name==socket.nickname)&&(connected[i].answered==true)){
						
						//io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":"answered"});
					}
					
					
				}

				
				
			}
			
				   
				

		}
		else{
		  io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{nkname:socket.nickname,message:m.msg,ans:false});
		}
		
	
		
		io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('score',{"server":connected});
	
	}
	
	});

	
socket.on('mousedown', function(positiondown){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('mousedown',positiondown);
	});

	socket.on('paint', function(paint){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('paint',paint);
	});

	socket.on('mousemove', function(positionmove){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('mousedown',positionmove);
	});
	
	socket.on('clear', function(c){
	
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('clear',c);
	});
	

	
});

io.configure(function () {  
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

var port = process.env.PORT || 5000; 
http.listen(port, function(){
  console.log('listening on *:5000');
  
});
	

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});





    
