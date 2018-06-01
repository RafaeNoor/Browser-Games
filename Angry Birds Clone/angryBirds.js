let grav = 0.02;
var pigState;

var lives = 3;


class Player {
  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravSpeed = 0;
  }
}

isClick  = false;

var bird, sling, pig, bg;




window.onload = function() {
  canv = document.getElementById('gameCanvas');
  ctx = canv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

      
  var fps = 60;
  var birdSprite = new Image();
  birdSprite.src = 'images/redBird.png' 

  var slingshotSprite = new Image();
  slingshotSprite.src = 'images/slingshot.png'

  var bgSprite = new Image();
  bgSprite.src = 'images/angryBirdsBG.png'

  var pigSprite = new Image();
  pigSprite.src = 'images/greenPig.png'

  bird = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: birdSprite,
    xLen : canv.width * 4,
    yLen : canv.height * 4
  });

  sling = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: slingshotSprite,
    xLen :canv.width * 3 ,
    yLen : canv.height * 3
  });

  bg = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: bgSprite,
    xLen :canv.width * 23 ,
    yLen : canv.height * 18
  });

  pig = sprite({
    context:canv.getContext('2d'),
    width: canv.width ,
    height: canv.height,
    image: pigSprite,
    xLen : canv.width * 2,
    yLen : canv.height * 2
  });


  pigState = buildPigs(5);

  setInterval(() => {
    // code will execute at 60 frames per second
    drawScreen();
    updateScreen();
           
  },1000/fps)

  canv.addEventListener('mousedown',mousePress)
  canv.addEventListener('mouseup',mouseUp)
  canv.addEventListener('mousemove',(evt) =>{
    let mPos = mouseMove(evt);
    if(isClick){
      mPos.x = mPos.x - 30;
      mPos.y = mPos.y - 40;
      bird.update(mPos);
    }
  }
  )
}

function buildPigs(n){
  ls = [];
  for(var i= 0; i< n;i++){
    ls.push({
      x: (0.65+i*0.05)*canv.width,
      y: 0.75 * canv.height,
      dead: false
    });
  }
  return ls;
}

function drawPigs(pgSt){
  for(var i =0;i<pgSt.length;i++){
    let obj = pgSt[i];
    if(!obj.dead){
      pig.render(obj.x,obj.y);
    }
  }
}


function mousePress(evt){
  console.log('Mouse pressed')
  isClick = true;
  bird.p.vx = 0;
  bird.p.vy = 0;
  bird.p.gravSpeed = 0;
}

function mouseUp(evt){
  isClick = false;
  lives --;
  console.log('Mouse up')
  bird.p.vx = (160-bird.p.x)/8;
  bird.p.vy = ((canv.height -250)-bird.p.y)/10;
  console.log(`vx = ${bird.p.vx}, by = ${bird.p.vy}`)


}

function mouseMove(evt){
  var rect = canv.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  //console.log(`x = ${mouseX}, y = ${mouseY}`)
  return {
    x: mouseX,
    y: mouseY
  }




}

function sprite(options){
  var that = {},
    frameIndex = 0,
    numberOfFrames = 0;
    
  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.xLen = options.xLen;
  that.yLen = options.yLen;
  that.p = new Player(0,0,0,0)

  that.update = function (pos) {
    if(isClick){
      that.p.x = pos.x;
      that.p.y = pos.y;
    }
  };


  that.render = function (x,y) {
    that.p.x = x;
    that.p.y = y;
    //Draw the animation

    that.context.drawImage(
      that.image, //image src
      0, //top left x co-rd
      0, // top left y co-rd
      that.width, //width
      that.height, // height
      that.p.x, //destination on canvas
      that.p.y,
      that.xLen, // destination width
      that.yLen,); // destination height

  };

  return that;
}

function drawScreen(){
  ctx.fillStyle = 'white'
  ctx.fillRect(0,0,canv.width,canv.height);
  
  bg.render(0,0);
  sling.render(120,canv.height - 250);
  ctx.fillRect(160,canv.height - 250,10,10);// center of slingshot
  drawPigs(pigState);
    
  bird.render(bird.p.x,bird.p.y);

  ctx.fillStyle = 'black';
  ctx.font ='20px Courier New';
  ctx.fillText(`Lives: ${lives}`,50,50);
}

function updateScreen(){
  if(isClick){
      //console.log(`dx = ${160-bird.p.x}, dy = ${canv.height -300 -bird.p.y}`);
  } else {
      bird.p.gravSpeed += grav;
      bird.p.vy +=bird.p.gravSpeed;

      bird.p.x += bird.p.vx;
      bird.p.y += bird.p.vy;
  }
  detectContact(pigState);
}

function detectContact(pgSt){
  for(var i=0;i<pgSt.length;i++){
    if(!isClick && bird.p.x >= pgSt[i].x && bird.p.x <= pgSt[i].x + 60
        && bird.p.y >= pgSt[i].y && bird.p.y <= pgSt[i].y +60) { 
      pgSt[i].dead = true;
      console.log('contact')
    }
  }
}
