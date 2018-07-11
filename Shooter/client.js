let fps = 60;

let p1 = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  orient: 0,
  render: function(){
    ctx.fillStyle = 'orange';
    ctx.fillRect(p1.x,p1.y,15,15);
  },
  update: function(){
    p1.x += p1.vx;
    p1.y += p1.vy;
  },
  ammo: 100 
}

function newShot(){
  let shot = {
    x:0,
    y:0,
    vx:0,
    vy: 0,
    isShot : false,
    render: function(){
      ctx.fillStyle = 'orange';
      ctx.fillRect(shot.x,shot.y,5,5);
    },
    checkShot: function(){
      if(shot.isShot){
        shot.render();
        shot.x += shot.vx;
        shot.y += shot.vy;
      }
    }
  };
  return shot;
}

let shotList = [];

window.onload = function() {
  canv = document.getElementById('gameCanvas');
  ctx = canv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  console.log('checking');

  testMaze = generateRandomMaze(30);
  count = 0;
  ammoRefresh = 1000;
  ammoList = [];
  setInterval( () => {
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canv.width,10);
    ctx.fillRect(0,0,10,canv.height);
    ctx.fillRect(0,canv.height-10,canv.width,10);
    ctx.fillRect(canv.width-10,0,10,canv.height);

    
    if(count == 0){
      ammoList = generateRandomAmmo(10);
    }
    count = (count+1)%ammoRefresh;
    

    ctx.fillText(`Ammo: ${p1.ammo}`,50,50);
    
    ctx.fillStyle = 'pink';
    ammoList.forEach(ammo =>{
      if(!ammo.used){
        ctx.fillRect(ammo.x,ammo.y,ammo.dx,ammo.dy);
      }
      if(!ammo.used && ammo.x >= p1.x && ammo.x <= p1.x + 15
        && ammo.y >= p1.y && ammo.y <= p1.y + 15){
        p1.ammo++;
        ammo.used = true;
      }
    });

    ctx.fillStyle = 'black';
    testMaze.forEach(wall =>{
      ctx.fillRect(wall.x,wall.y,wall.dx,wall.dy);
    })

    p1.update();
    p1.render();
    
    shotList.forEach(shot => {
      for(var i =0; i<testMaze.length;i++){
        if(shot.x >= testMaze[i].x && shot.x <= testMaze[i].x +testMaze[i].dx  &&
          shot.y >= testMaze[i].y && shot.y <= testMaze[i].y + testMaze[i].dy){
          shot.isShot = false;
          break;
        }
      }
      shot.checkShot();
    });
      
     
  }, 1000/fps);
  document.addEventListener('keydown', keyPress);
  document.addEventListener('keyup',keyUp);

}


function keyPress(evt){
  let playerSpeed = 5;
  let shotSpeed = 10;
  switch(evt.keyCode){
    case 37: //left
      console.log('left');
      p1.vx = -playerSpeed;
      p1.orient = 0;
      break;
    case 38: //up
      console.log('up');
      p1.vy =  -playerSpeed;
      p1.orient = 1;
      break;
    case 39: // right
      console.log('right');
      p1.vx = playerSpeed;
      p1.orient = 2;
      break;
    case 40: // down
      console.log('down');
      p1.vy = playerSpeed;
      p1.orient = 3;
      break;
    case 81:
      console.log('shoot');
      if(p1.ammo > 0){
        let shot = newShot();
        shot.x = p1.x;
        shot.y = p1.y;
        shot.isShot = true;

        switch(p1.orient){
          case 0:
            shot.vx = -shotSpeed;
            shot.vy = 0;
            break;
          case 1:
            shot.vy = -shotSpeed;
            shot.vx = 0;
            break;
          case 2:
            shot.vx = shotSpeed;
            shot.vy = 0;
            break;
          case 3:
            shot.vy = shotSpeed;
            shot.vx = 0;
            break;
        }
        shotList.push(shot);
        p1.ammo --;
      } else {
        console.log('Out of ammo!');
      }
  }


}

function keyUp(evt){
  switch(evt.keyCode){
    case 37: //left
      console.log('left');
      p1.vx = 0;
      break;
    case 38: //up
      console.log('up');
      p1.vy = 0; 
      break;
    case 39: // right
      console.log('right');
      p1.vx = 0;
      break;
    case 40: // down
      console.log('down');
      p1.vy = 0;
      break;
  }


}


function generateRandomMaze(n){
  mazeList = [];
  for(var i = 0; i<n;i++){
    wall = {
      x: Math.random()*canv.width,
      y: Math.random()*canv.height,
      dx: Math.random()*20+20,
      dy: Math.random()*10+100
    }

    mazeList.push(wall);
  }

  return mazeList;
}

function generateRandomAmmo(n){
  ammoList = [];
  for(var i = 0; i<n;i++){
    ammo = {
      x: Math.random()*canv.width,
      y: Math.random()*canv.height,
      dx: 5,
      dy: 5,
      used: false
    }

    ammoList.push(ammo);
  }

  return ammoList;
}

