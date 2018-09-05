import Vector from './Vector';
import Player from './Player'
import Time from './Time'
import { toRadians } from './util';
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
    },
    {
      id: 1,
      walls: [
        {
          id: 0,
          start: new Vector(350, 150),
          end: new Vector(560, 150)
        },
        {
          id: 1,
          start: new Vector(560, 150),
          end: new Vector(560, 300)
        },
        {
          id: 2,
          start: new Vector(560, 300),
          end: new Vector(350, 300)
        },
        {
          id: 3,
          start: new Vector(350, 150),
          end: new Vector(350, 150)
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
const screenCenter = new Vector(canvas.width / 2, canvas.height / 2);

/*==================================================
# RENDERER
==================================================*/
const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const drawPlayer = () => {
  // player position
  context.beginPath();
  context.fillStyle = 'black';
  context.arc(screenCenter.x, screenCenter.y, 3, 0, Math.PI * 2);
  context.fill();
  context.closePath();

  // player collision radius
  context.beginPath();
  context.strokeStyle = 'red';
  context.arc(screenCenter.x, screenCenter.y, player.radius, 0, Math.PI * 2);
  context.stroke();
  context.closePath();
}

const rotateVectorAroundPlayer = (vector) => {
  const t1 = vector.minus(player.position);

  // Rotate vector around player
  return new Vector(
    t1.x * player.angleSin - t1.y * player.angleCos,
    t1.x * player.angleCos + t1.y * player.angleSin
  )
}

const drawSectors = () => {
  world.sectors.forEach(sector => {
    sector.walls.forEach(wall => {
      const r1 = rotateVectorAroundPlayer(wall.start);
      const r2 = rotateVectorAroundPlayer(wall.end)

      context.beginPath();
      context.strokeStyle = 'black';
      context.moveTo(r1.x + screenCenter.x, r1.y + screenCenter.y);
      context.lineTo(r2.x + screenCenter.x, r2.y + screenCenter.y);
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
  drawSectors();
  window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);