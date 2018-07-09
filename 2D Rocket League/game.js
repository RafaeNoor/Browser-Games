
class Player {
  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.angSpeed = 0;
  }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

var bgm = new sound('sounds/disco.mp3');
bgm.play();

var hitSound = new sound('sounds/hit.mp3');
var goalSound = new sound('sounds/goal.mp3');

let CAR_WIDTH = 32*2;
let BALL_WIDTH = CAR_WIDTH*2.5;


scoreP1 = scoreP2 = 0;



window.onload = function() {
  canv = document.getElementById('gameCanvas');
  ctx = canv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

      
  var fps = 60;

  var player1Img = new Image();
  player1Img.src = 'images/purpleBumperCar.png' 

  player1 = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: player1Img,
    xLen : CAR_WIDTH,
    yLen : CAR_WIDTH,
    widthPerSprite: 32,
    heightPerSprite: 32,
    numSprites:1,
    ID:1
    
  });
  
  var player2Img = new Image();
  player2Img.src = 'images/redBumperCar.png';
  player2 = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: player2Img,
    xLen : CAR_WIDTH  ,
    yLen : CAR_WIDTH,
    widthPerSprite: 32,
    heightPerSprite: 32,
    numSprites:1,
    ID:2
  });

  var footballImg = new Image();
  footballImg.src = 'images/football.png';
  football = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: footballImg,
    xLen : BALL_WIDTH,
    yLen : BALL_WIDTH,
    widthPerSprite: 32,
    heightPerSprite: 32,
    numSprites:1,
    ID:3
  });

  var bgImg = new Image();
  bgImg.src = 'images/pitch.png';
  background = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: bgImg,
    xLen : canv.width*2.35,
    yLen : canv.height*2.35,
    widthPerSprite: 1184,
    heightPerSprite: 704,
    numSprites:1,
    ID:4
  });



  

  defaultPositions();
  playerList = [player1, player2, football];
  let i = 0;


  ctx.fillStyle = 'black';
  setInterval(() => {
    i+=0.1/4;

    ctx.clearRect(0,0,canv.width,canv.height);
    background.render(0,0);
    
    //Update player positions
    player1.update(playerList);
    player2.update(playerList);
    
    ballCollision(playerList);
    football.p.x += football.p.vx;
    football.p.y += football.p.vy;


    // Ball deceleration
    football.p.vx *= 0.995;
    football.p.vy *= 0.995;

    //Render player objects in correct orientations and locations
    player1.drawPlayer();
    player2.drawPlayer();

    ctx.save();
    ctx.translate(football.p.x,football.p.y);
    ctx.rotate(i);
    football.render(-BALL_WIDTH/2,-BALL_WIDTH/2);
    ctx.restore();
    
    ctx.font="20px Verdana";
    ctx.fillStyle= 'white';
    ctx.fillText(`Score: ${scoreP1}`,50,50);
    ctx.fillText(`Score: ${scoreP2}`,canv.width-150,50);
    isGoal();
    
  },1000/fps)

  document.addEventListener('keydown',keyPress)//key down events
  document.addEventListener('keyup',keyUp) // key up events

}
function keyPress(evt){
  //console.log(player1.orient);
  rotSpeed = 5;
  
    switch(evt.keyCode) {
    case 37://left
        player1.p.angSpeed = -rotSpeed*Math.PI/180;
        player1.isRot = true;

      break;
    case 38://up
        player1.isMove = true;
        player1.isFwd = true;
        
      break;
    case 39://right
        player1.p.angSpeed = rotSpeed*Math.PI/180;
        player1.isRot = true;
      break;
    case 40://down
        player1.isMove = true;
        player1.isFwd = false;
      break;
    case 87: //W
        player2.isMove = true;
        player2.isFwd = true;
        break;
    case 65: //A
        player2.p.angSpeed = -rotSpeed*Math.PI/180;
        player2.isRot = true;
        break;
    case 83: //S
        player2.isMove = true;
        player2.isFwd = false;
        break;
    case 68: //D
        player2.p.angSpeed = rotSpeed*Math.PI/180;
        player2.isRot = true;
        break;
  }
}

function keyUp(evt){
  switch(evt.keyCode) {
    case 37://left
      player1.isRot = false;
      break;
    case 38://up
      player1.isMove = false;
      break;
    case 39:// Right
      player1.isRot = false;
      break;
    case 40:// down
      player1.isMove = false;  
      break;
    case 87:
      player2.isMove = false;
      break;
    case 65:
      player2.isRot = false;
      break;
    case 83:
      player2.isMove = false;
      break;
    case 68:
      player2.isRot = false;
      break;
  }
}


function sprite(options){
  var that = {},
  frameIndex = 0,
  numberOfFramesPerSprite = 15;
  currentFrame = 0;
    
  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.xLen = options.xLen;
  that.yLen = options.yLen;
  that.widthPerSprite = options.widthPerSprite;
  that.numSprites = options.numSprites;
  that.heightPerSprite = options.heightPerSprite;
  that.p = new Player(0,0,0,0)
  that.orient = 0;
  that.isMove = false;
  that.isRot = false;
  that.ID = options.ID;

  that.update = function(listPlayers) {
    isCol = that.detectCol(listPlayers)['isCol'];
    speed = 8;
    //console.log(isCol);
    if(isCol){
      that.p.x -= that.p.vx*1.5;
      that.p.y -= that.p.vy*1.5;
    }
    if(that.isRot && !isCol){
      that.orient += that.p.angSpeed;
    }
    if(that.isMove && !isCol){
      if(that.isFwd ){
        that.p.vx = Math.sin(that.orient)*speed;
        that.p.vy = -Math.cos(that.orient)*speed;
      } else {
        that.p.vx = -Math.sin(that.orient)*speed;
        that.p.vy =Math.cos(that.orient)*speed;
      }

      that.p.x += that.p.vx;
      that.p.y += that.p.vy;
    }
  };


  that.render = function (x,y) {
    if(currentFrame == 0){
      frameIndex = (frameIndex+1)%that.numSprites;
    }
    currentFrame = (currentFrame+1)%numberOfFramesPerSprite;
    //Draw the animation

    that.context.drawImage(
      that.image, //image src
      that.widthPerSprite*frameIndex, //top left x co-rd
      0, // top left y co-rd
      that.widthPerSprite, //width
      that.heightPerSprite, // height
      x, //destination on canvas
      y,
      that.xLen, // destination width
      that.yLen,); // destination height

  };

  that.drawPlayer = function(){
    ctx.save();
    ctx.translate(that.p.x,that.p.y);
    ctx.rotate(that.orient);
    that.render(-CAR_WIDTH/2,-CAR_WIDTH/2);
    ctx.restore();
  }

  that.detectCol = function(listPlayers){
    let xLow = Math.abs(Math.sin(that.orient)*CAR_WIDTH/2); //Orientation specific collision boxes
    let yLow = Math.abs(Math.cos(that.orient)*CAR_WIDTH/2);
    let ballXLow = BALL_WIDTH/2;
    let ballYLow = BALL_WIDTH/2;

    let retObj = {};

    //console.log(`orient: ${that.orient*180/Math.PI}, xlow: ${xLow}, ylow: ${yLow}`);
    for(var i =0;i<listPlayers.length;i++){
      let car = listPlayers[i];
      //console.log(listPlayers[i]);
      if(car.ID == 3 || that.ID == 3){ // if ball

        if((car.p.x>= (that.p.x-ballXLow) && car.p.x <= that.p.x + ballXLow) 
          && (car.p.y>= (that.p.y-ballYLow) && car.p.y <= that.p.y + ballYLow) && that.ID != car.ID){
            retObj['isCol'] = true;
            retObj['player'] = car.ID;
            return retObj;
        }
      }
      if((car.p.x>= (that.p.x-xLow) && car.p.x <= that.p.x + xLow) 
        && (car.p.y>= (that.p.y-yLow) && car.p.y <= that.p.y + yLow) && that.ID != car.ID){
        retObj['isCol'] = true;
        retObj['player'] = car.ID;

        return retObj;
      }
    }

    if(that.p.x-xLow <=0 || that.p.x+xLow >=canv.width){
      console.log('collision with wall');
      retObj['isCol'] = true;
      retObj['player'] = 5;// -1 for wall
      return retObj;
    }
    if(that.p.y-yLow <=0 || that.p.y+yLow >=canv.height){
      retObj['isCol'] = true;
      retObj['player'] = 6;// -1 for wall
      return retObj;
    }
    retObj['isCol'] = false;
    retObj['player'] = 5;
    return retObj;
  }

  return that;
}


function ballCollision(playerList){
  colObj = football.detectCol(playerList);
  ballSpeed = 4;
  isCol = colObj['isCol'];
  
  if(isCol){
    hitSound.play();
    window.setTimeout(()=>{
      hitSound.stop();}, 4000);
    football.isMove = true;
    switch(colObj['player']){
      case 5: // wall
        console.log('ball wall');
        football.p.vx = -football.p.vx;
        //football.p.vy = -football.p.vy;
        break;
      case 6: //wall y
        football.p.vy = - football.p.vy;
        break;
      case 1: //player1
        football.p.vx = player1.p.vx*0.75;
        football.p.vy = player1.p.vy*0.75;
        break;
      case 2:
        football.p.vx = player2.p.vx*0.75;
        football.p.vy = player2.p.vy*0.75;
        break;
    }
  }
}

function isGoal(){
  //if player 1 scored
  if(football.p.x+BALL_WIDTH/2 >= canv.width && football.p.y >= 0.2*canv.height
      && football.p.y <= 0.75*canv.height){
    console.log('Player 1 scored');
    goalSound.play()
    window.setTimeout(() =>{
      goalSound.stop()},4000)

    scoreP1++;
    defaultPositions();
  } else if(football.p.x-BALL_WIDTH/2 <= 0 && football.p.y >= 0.2*canv.height
      && football.p.y <= 0.75*canv.height){
    console.log('Player 2 scored');
    goalSound.play()
    window.setTimeout(() =>{
      goalSound.stop()},4000)

    scoreP2++;
    defaultPositions();
  }
}


function defaultPositions(){
  football.p.x = canv.width/2;
  football.p.y = canv.height/2;

  football.p.vx = 0;
  football.p.vy = 0;


  player1.p.x = 50;
  player1.p.y = 50;
  player1.orient = Math.PI;

  player2.p.x = canv.width - CAR_WIDTH;
  player2.p.y = canv.height - CAR_WIDTH;
  player2.orient = 0;
}

