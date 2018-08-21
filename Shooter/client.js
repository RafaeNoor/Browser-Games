let fps = 60;


let p1 = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  orient: 0,
  health: 100,
  render: function(){
    ctx.fillStyle = 'orange';
    ctx.fillRect(p1.x,p1.y,15,15);
    ctx.fillStyle = 'silver';
    ctx.fillRect(20,20,100,10);
    ctx.fillStyle = 'red';
    ctx.fillRect(20,20,p1.health,10)
    ctx.fillStyle = 'black';
    ctx.fillText(`P1: ${p1.health}/100`,30,30);
  },
  update: function(){
    p1.x += p1.vx;
    p1.y += p1.vy;
  },
  ammo: 100 
}

let p2 ={
  x: 800,
  y: 500,
  vx: 0,
  vy: 0,
  orient: 0,
  health: 100,
  render: function(){
    ctx.fillStyle = 'orange';
    ctx.fillRect(p2.x,p2.y,15,15);
    ctx.fillStyle = 'silver';
    ctx.fillRect(canv.width-150,20,100,10);
    ctx.fillStyle = 'red';
    ctx.fillRect(canv.width-150,20,p2.health,10)
    ctx.fillStyle = 'black';
    ctx.fillText(`P2: ${p2.health}/100`,canv.width-125,30);
  },
  update: function(){
    p2.x += p2.vx;
    p2.y += p2.vy;
  },
  ammo: 100 
}

let playerList = [p1,p2];
 



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
    ctx.fillText(`Ammo: ${p2.ammo}`,canv.width-125,50);
    
    ctx.fillStyle = 'pink';
    ammoList.forEach(ammo =>{
      playerList.forEach((player,index,arr) => {
        if(!ammo.used){
          ctx.fillRect(ammo.x,ammo.y,ammo.dx,ammo.dy);
        }
        if(!ammo.used && ammo.x >= player.x && ammo.x <= player.x + 15
          && ammo.y >= player.y && ammo.y <= player.y + 15){
          arr[index].health -= 15;
          arr[index].ammo++;
          ammo.used = true;
        }
      })
    });

    ctx.fillStyle = 'black';
    testMaze.forEach(wall =>{
      ctx.fillRect(wall.x,wall.y,wall.dx,wall.dy);
    })

    playerList.forEach(player => {
      player.update();
      player.render();
    });
   
    
    
    tempShotList = [];
    shotList.forEach(shot => {
      for(var i =0; i<testMaze.length;i++){
        if(shot.x >= testMaze[i].x && shot.x <= testMaze[i].x +testMaze[i].dx  &&
          shot.y >= testMaze[i].y && shot.y <= testMaze[i].y + testMaze[i].dy){
          shot.isShot = false;
          break;
        }
      }
      if(shot.isShot){
        tempShotList.push(shot);
      }
      shot.checkShot();
    });
    shotList = tempShotList;
      
     
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
    case 191:// /
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
      break;
    case 81:// q
      console.log('shoot');
      if(p2.ammo > 0){
        let shot = newShot();
        shot.x = p2.x;
        shot.y = p2.y;
        shot.isShot = true;

        switch(p2.orient){ 
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
        p2.ammo --;
      } else {
        console.log('Out of ammo!');
      }
      break;
    case 87://W
      p2.vy =  -playerSpeed;
      p2.orient = 1;
      break;
    case 65://A
      p2.vx = -playerSpeed;
      p2.orient = 0;
      break;
    case 83://S
      p2.vy = playerSpeed;
      p2.orient = 3;
      break;
    case 68://D
      p2.vx = playerSpeed;
      p2.orient = 2;
      break;
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
    case 87:
      p2.vy = 0;
      break;
    case 65:
      p2.vx = 0;
      break;
    case 83:
      p2.vy = 0;
      break;
    case 68:
      p2.vx = 0;
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

