
var acc = -0.3;
var gravSpeed = 0;
var ground = 0;
var radius = 15;
var holdLeft = holdRight = false;
var obstacles = [];
var refresh = 100;
var current = 0;
var oldScore = 0;

let speedX = 10;
let speedY = 10;

let boxL = 40;
let boxW = 2*radius;


var score = 0;
class Player {
  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}



var p1=new Player(0,0,1,-1); 

window.onload = function() {
  canv = document.getElementById('gameCanvas');
  ctx = canv.getContext('2d');
  p1.x = canv.width/2;
  p1.y = canv.width/2;

  ground = 0.75*canv.height;
      
  var fps = 60;


  setInterval(() => {
    if(current == 0){
      obstacles = makeRandomMap(50);
      current ++;
    }
    updateScore();
    onGround();
    movePlayer(p1);
    drawScreen();
    
  },1000/fps)

  setInterval(() => { // refreshes map with new obstacles
    current +=1;
    current = current % refresh;
  },100);

  document.addEventListener('keydown',keyPress)
  document.addEventListener('keyup',keyUp)

}
function keyPress(evt){
  console.log('keyPress invoked')
  
    switch(evt.keyCode) {
    case 37://left
      holdLeft = true;
      if(p1.x > radius){
        p1.vx = -(speedX);
      } else {
        p1.x = 0;
        holdLeft = false;
        holdRight = true;
        setTimeout(()=>{
          holdRight = false;
        },100)
      }
      break;
    case 38:
      p1.vy = -(speedY)//+acc;
      break;
    case 39:
      holdRight = true;
      if(p1.x + 10 < canv.width){
        p1.vx = (speedX);
      } else {
        p1.x = canv.width - radius;
        holdLeft = true;
        holdRight = false;
        setTimeout(()=>{
          holdLeft = false;
        },100)
      }
      break;
    case 40:
      p1.vy =speedY
      break;
  }
}

function keyUp(evt){
  p1.vy = 0;
  switch(evt.keyCode) {
    case 37://left
      holdLeft = false;
      break;
    case 38://up
      acc = -2;
      break;
    case 39:
      holdRight = false;
      break;
    case 40:
      break;
  }
}




function drawScreen(){
  
  var gradient=ctx.createLinearGradient(0,0,canv.width,0);
  gradient.addColorStop("0","gray");
  gradient.addColorStop("0.5","darkblue");
  gradient.addColorStop("1.0","indigo");


  //creating backGround
  

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canv.width,canv.height);

  gradient=ctx.createLinearGradient(0,0,canv.width,0);
  gradient.addColorStop("0","lightgreen");
  gradient.addColorStop("0.5","green");
  gradient.addColorStop("1.0","darkgreen");


  //creating ground
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0.75*canv.height,canv.width,0.25*canv.height);

  for(var i=0;i<canv.width;i+=30){
    for(var j=0.75*canv.height;j<canv.height;j+=40){
      ctx.fillStyle = 'black';
      ctx.fillRect(i,j,5,5);
    }
  }

  for(var i=0;i<canv.width;i+=1){// horizontal line at ground level
    ctx.fillStyle = 'black'
    ctx.fillRect(i,0.75*canv.height,1,4);
  }
  



  drawRandomMap();
  resetScore();//checks if needs to reset in the function
  drawPlayer();

  
  ctx.fillStyle = 'white';
  ctx.font='15px Courier New';
  ctx.fillText(`High Score: ${oldScore}`,50,30);
  ctx.fillText(`Score: ${score}`,50,50);

}

function drawPlayer(){
  //Player Head
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(p1.x,p1.y-radius-boxL,radius,0,Math.PI*2,true);
  ctx.fill();


  //Player Body
  ctx.fillStyle = 'maroon';
  ctx.fillRect(p1.x-radius,p1.y-boxL,boxW,boxL);

  //Player legs
  ctx.fillStyle = 'black';
  ctx.fillRect(p1.x-boxW/2,p1.y,10,10);
  ctx.fillRect(p1.x+boxW/2-10,p1.y,10,10);

  ctx.fillStyle = 'white';

  //Player Arms
  let armLength = 8
  ctx.fillRect(p1.x-boxL/2 -armLength/2,p1.y-boxL*0.75,armLength,armLength);
  ctx.fillRect(p1.x+boxL/2 - armLength/2,p1.y-boxL*0.75,armLength,armLength);

  ctx.fillStyle = 'black';
  armLength = 6;
  ctx.fillRect(p1.x-boxL/2 -armLength/2,p1.y-boxL*0.8,armLength,armLength);
  ctx.fillRect(p1.x+boxL/2 - armLength/2,p1.y-boxL*0.8,armLength,armLength);


  

}

function makeRandomMap(lim){
  let plats = [];
  let w = canv.width;
  let h = canv.height;

  for(var i =0;i<lim;i++){

    let temp = {
      x: Math.random()*w,
      y: Math.random()*h,
      hor: Math.random()*50+90,
      ver: Math.random()*20+10
    }
    if(temp.y + temp.ver < 0.75*canv.height){//valid platform
      plats.push(temp);
    }

  }
  return plats;
}

function onGround(){
  if(p1.x == 0.75*canv.height){
    ground = 0.75*canv.height;
  }

  let gr = false;
  for(var i =0;i<obstacles.length;i++){
    let obj = obstacles[i];
    if(p1.x+6 >= obj.x && p1.x-6 <= obj.x +obj.hor && p1.y >=obj.y && p1.y -boxL/4 <= obj.y+obj.ver){
      gr = true;
      ground = obj.y;
      break;
    }
  }

  if(!gr){
     ground = 0.75*canv.height;
  }
}

function drawRandomMap(){
  var gradient=ctx.createLinearGradient(0,0,canv.width,0);
  gradient.addColorStop("0","orange");
  gradient.addColorStop("0.5","white");
  gradient.addColorStop("1.0","orange");

  for(var i=0; i<obstacles.length;i++){
    ctx.fillStyle = gradient;
    let obj = obstacles[i];
    if(obj.x>0 && obj.x<canv.width && obj.y+obj.ver < 0.75*canv.height && obj.y>0){
      ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].hor,obstacles[i].ver);
    }
  }
}

function resetScore(){
  if(p1.y >= 0.75*canv.height){
    if(oldScore < score && score >20){
      oldScore = score;
    }
    score = 0;
  }
}

function updateScore(){//Higher score when closer to the ground
  deltaScore =   (p1.y-0)/100 *2;  
  score += Math.floor(deltaScore); 

}

function movePlayer(p){
  
  //to make it difficult to stay on higher grounds
  acc = -(ground-p1.y)/80;

  if(holdLeft){
    p.vx = -speedX;
  }
  if(holdRight){
    p.vx = speedX;
  }
  if(!holdRight && !holdLeft && p.y < ground){
    p.vx = 0;
  }
  
  p.x +=p.vx;
  p.y +=p.vy;

  if(p.y < ground){
    gravSpeed +=acc;
    p.y += p.vy-gravSpeed;
  } else { 
    p.y = ground ;
    p.vy = 0;
    gravSpeed = 0;
    p.vx = 0;
  }
}
