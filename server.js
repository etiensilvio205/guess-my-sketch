
var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var EventEmitter = require("events").EventEmitter;
var path = require('path');


var user;
var users=[];

var wordsFrench=[
"En colere",
"Feux d'artifice",
"Citrouille",
"Bebe",
"Fleur",
"arc en ciel",
"Barbe",
"Soucoupe volante",
"Recycler",
"Bible",
"Girafe",
"Chateau de sable",
"Bikini",
"Des lunettes",
"Flocon de neige",
"Livre",
"Talon haut",
"Escaliers",
"Seau",
"Cornet de glace",
"Etoile de mer",
"Bumble bee",
"Iglou",
"fraise",
"Papillon",
"Lady bug",
"Soleil",
"Camera",
"Lampe",
"Pneu",
"Chat",
"Lion",
"Pain grille",
"Eglise",
"Boites aux lettres",
"Brosse a dents",
"Crayon",
"Nuit",
"Dentifrice",
"Dauphin",
"Nez",
"un camion",
"Oeuf",
"Jeux olympiques",
"Volley-ball",
"tour Eiffel",
"Cacahuete",
"Cerveau",
"Chaton",
"Cour de recreation",
"Bain moussant",
"kiwi",
"Tarte à la citrouille",
"Boucle",
"Rouge a levres",
"Goutte de pluie",
"Autobus",
"Homard",
"Robot",
"Accident de voiture",
"Sucette",
"Chateau de sable",
"Chateau",
"Aimant",
"Pantoufle",
"Tronçonneuse",
"Megaphone",
"Boule de neige",
"Tente de cirque",
"Sirene",
"Arroseur",
"Ordinateur",
"Minivan",
"Statue de la Liberte",
"Lit de bebe",
"Mont Rushmore",
"Tetard",
"Dragon",
"La musique",
"Tipi",
"Haltere",
"Pole Nord",
"Telescope",
"Anguille",
"Infirmiere",
"Train",
"grande roue",
"Hibou",
"Tricycle",
"Drapeau",
"Sucette",
"Tutu",
"Courrier indesirable",
"Piano",
"Siege arriere",
"Chaise haute",
"Groupe de rock",
"Anniversaire",
"Le hockey",
"Sasquatch",
"Trou noir",
"Un hotel",
"Oeufs brouilles",
"Blizzard",
"Corde a sauter",
"Ceinture de securite",
"Burrito",
"Koala",
"Sauter",
"Capitaine",
"Lutin",
"Eclipse solaire",
"Lustre",
"Lumiere",
"Espace",
"Lit de bebe",
"Masque",
"Stethoscope",
"Bateau de croisiere",
"Mecanicien",
"Cigogne",
"Danse",
"Maman",
"Coup de soleil",
"Deodorant",
"Monsieur Potato Head",
"Fil",
"Facebook",
"Collants",
"Touristique",
"Appartement",
"Assiette en papier",
"Etats Unis",
"Cadre",
"Photo",
"WIFI",
"Pleine lune",
"Pilgram",
"Zombie",
"Jeu",
"Pirate"];

var wordsEng=["Angry","Fireworks","Pumpkin","Baby","Flower","Rainbow","Beard","Flying Saucer","Recycle","Bible","Giraffe","SandCastle","Bikini","Glasses","Snowflake","Book","High Heel","Stairs","Bucket","IceCornet","Starfish","Bumble bee","Iglou","strawberry","Butterfly","Ladybug","Sun","Camera","Lamp","Tire","Cat","Lion","Toast","Church","Mailbox","Toothbrush","Pencil","Night","Toothpaste","Dolphin","Nose","Truck","Egg","Olympic Games","Volleyball","Eiffel Tower","Peanut","Brain","Kitten","Playground","Bubble Bath","Kiwi","Pumpkin Pie","Loop","Lipstick","Rain drop","Bus","Lobster","Robot","Car Accident","Lollipop","SandCastle","Castle","Magnet","Slipper","Chainsaw","Megaphone","Snowball","Circus Tent","Mermaid","Sprinkler","Computer","Minivan","Statue of Liberty","Crib","Mount Rushmore","Tadpole","Dragon","Music","Tipi","Dumb bell","North Pole","Telescope","Eel","Nurse","Train","Ferris wheel","Owl","Tricycle","Flag","Lollipop","Tutu","Junk","Piano","BackSeat","HighChair","Rock Band","Anniversary","Hockey","Sasquatch","BlackHole","Hotel","Scrambled Eggs","Blizzard","Skipping Rope","Seat Belt","Burrito","Koala","Jumping","Captain","Goblin","Solar Eclipse","Chandelier","Light","Space","Crab","Mask","Stethoscope","CruiseShip","Mechanic","Stork","Dance","Mom","Sunburn","Deodorant","Mr. Potato Head","Fil","Facebook","Tights","Tourist","Apartment","Paper Plate","United States","Frame","Photo","WIFI","FullMoon","Pilgram","Zombie","Game","Pirate"];
function drawing(word,duration){
	this.word=word;
	this.duration=duration;
	
}

function game(players,drawing,language){
	this.players=players;
	this.winner='';
	this.losers=[];
	this.drawing=drawing;
	this.language=language;
	
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
	this.browser="eng";
	
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
socket.on('send-nickname', function(n) {
	var found=false;
	var nickname=n.name;
	

	
	
	              var roomCheck=Object.keys(socket.rooms).filter(item => item!=socket.id)[0];
					var connected=[];
					for (socketID in io.nsps['/'].adapter.rooms[roomCheck].sockets) {
						const nm = io.nsps['/'].connected[socketID].nickname;
						const nmi = io.nsps['/'].connected[socketID].id;			
							connected.push(new player(nm,nmi,roomCheck,"Guessor"));
					  }
		
	if (nickname!=''){	
		for (var i=0;i<connected.length;i++){
			
				if(connected[i].name==nickname){
					found=true;
					break;
				}
		}
	}else{
	found=true;
	}

	if ((found==false)){
		socket.nickname=nickname;
		io.to(socket.id).emit('nameControl',found);
		
		if (connected.length==1){
		socket.language=n.language;	
		
		}
		
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
						io.to(socket.id).emit('control',false);
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

						if(typeof io.nsps['/'].connected[socketID].language !='undefined'){
							var lang=io.nsps['/'].connected[socketID].language;
						}							
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
						
						if(typeof io.nsps['/'].connected[socketID].language !='undefined'){
							var lang=io.nsps['/'].connected[socketID].language;
						}	
						
							connected.push(new player(nm,nmi,roomCheck));
					  }
					
					 
					for (var i=0;i<connected.length;i++){
						connected[i].role="Guessor";
					}
					connected[0].role="Drawer";
		
		        }
		
		console.log(lang);
		if (lang=='fr'){
			
			var adrawing=new drawing(wordsFrench[Math.floor(Math.random() * wordsFrench.length)],60);
		}else{
			
			var adrawing=new drawing(wordsEng[Math.floor(Math.random() * wordsEng.length)],60);
		}
		 
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
			
        })
    
}
}
	

	

	
socket.on('chat message', function(m){
	
	
	var connected=m.client;
	var falser='';
	var treatedd=m.msg.toUpperCase();
	var treated=treatedd.replace(/\s/g,'');
	var sketchd=m.d.word.toUpperCase();
	var sketch=sketchd.replace(/\s/g,'');
	
	for (var i=0;i<connected.length;i++){
		if(socket.nickname==connected[i].name){
			falser=connected[i].points;
			break;
		}
		
	}
	
	
	if(m.time>0){
		
		if (processMsg(sketch,treated)==true){
			
			for (var i=0;i<connected.length;i++){
				if(connected[i].role=="Drawer"){
					
					if (connected[i].name==socket.nickname){
						io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":"cheat","points":connected[i].points});
						
					}
					else if((connected[i].name!==socket.nickname)&&(connected[i].answered==false)){
					
					
								connected[i].points=connected[i].points+(m.time*1);
								connected[i].drawingguessed=connected[i].drawingguessed+1;
								connected[i].answered=true;
								io.to(connected[i].id).emit('score',{"wguessed":connected[i].wordguessed,"score":connected[i].points,"dguessed":connected[i].drawingguessed});
								io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":true,"points":connected[i].points});
						
					
				    }else if((connected[i].name!==socket.nickname)&&(connected[i].answered==true)){
						
								
						io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":"answered","points":connected[i].points});
						
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
		  io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('chat',{"nkname":socket.nickname,"message":m.msg,"ans":false,"points":falser});
		}
		
	
		
		io.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('score',{"server":connected});
	
	}
	
	});

	
	socket.on('mousedown', function(positiondown){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('mdown',positiondown);
	
	});

	socket.on('paint', function(paint){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('paint',paint);
	});

	socket.on('mousemove', function(positionmove){
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('mmove',positionmove);
	
	
	});
	
	socket.on('clear', function(c){
	
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('clear',c);
	});
	
	socket.on('addColor',function(col){
		
	io.sockets.to(Object.keys(socket.rooms).filter(item => item!=socket.id)[0]).emit('pushColor',col);
	});
	

	
});
	
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res){
  
  var lang=req.headers["accept-language"][0]+req.headers["accept-language"][1];
  
  if (lang=="fr"){
	 res.sendFile(__dirname + '/views/IndexFR.html');
  }else{
	  
	 res.sendFile(__dirname + '/views/Index.html');   
  }
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

http.listen(server_port,server_host, function(){
  console.log('listening on'+server_port);
});





    
