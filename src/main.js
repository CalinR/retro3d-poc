import Vector from './Vector';
import Player from './Player'
import Time from './Time'
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const world = {
  name: 'World 1',
  sectors: [
    {
      id: 0,
      walls: [
        {
          id: 0,
          start: new Vector(150, 100),
          end: new Vector(300, 100)
        },
        {
          id: 1,
          start: new Vector(300, 100),
          end: new Vector(350, 150)
        },
        {
          id: 2,
          start: new Vector(350, 150),
          end: new Vector(350, 300)
        },
        {
          id: 3,
          start: new Vector(350, 300),
          end: new Vector(300, 350)
        },
        {
          id: 4,
          start: new Vector(300, 350),
          end: new Vector(150, 350)
        },
        {
          id: 5,
          start: new Vector(150, 350),
          end: new Vector(100, 300)
        },
        {
          id: 6,
          start: new Vector(100, 300),
          end: new Vector(100, 150)
        },
        {
          id: 7,
          start: new Vector(100, 150),
          end: new Vector(150, 100)
        }
      ]
    }
  ]
}
const player = new Player({
  position: new Vector(200, 200),
  radius: 10,
  rotation: 180,
  moveSpeed: 1,
  turnSpeed: 90,
  maxSpeed: 1,
  world: world
})

/*==================================================
# RENDERER
==================================================*/
const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const drawPlayer = () => {
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(player.position.x, player.position.y, 3, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

const drawPlayerCollisionRadius = () => {
  context.beginPath();
  context.strokeStyle = 'red';
  context.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
  context.stroke();
  context.closePath();
}

const drawSectors = () => {
  world.sectors.forEach(sector => {
    sector.walls.forEach(wall => {
      context.beginPath();
      context.strokeStyle = 'black';
      context.moveTo(wall.start.x, wall.start.y);
      context.lineTo(wall.end.x, wall.end.y);
      context.stroke();
      context.closePath();
    })
  })
}


/*==================================================
# MAIN LOOP
==================================================*/
const mainLoop = () => {
  Time.update();
  clearCanvas();
  player.update();
  drawPlayer();
  drawPlayerCollisionRadius();
  drawSectors();
  window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);