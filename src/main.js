import Vector from './Vector';
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const sector = {
  walls: [
    {
      id: 1,
      start: new Vector(150, 100),
      end: new Vector(300, 100)
    },
    {
      id: 2,
      start: new Vector(300, 100),
      end: new Vector(350, 150)
    },
    {
      id: 3,
      start: new Vector(350, 150),
      end: new Vector(350, 300)
    },
    {
      id: 4,
      start: new Vector(350, 300),
      end: new Vector(300, 350)
    },
    {
      id: 5,
      start: new Vector(300, 350),
      end: new Vector(150, 350)
    },
    {
      id: 6,
      start: new Vector(150, 350),
      end: new Vector(100, 300)
    },
    {
      id: 7,
      start: new Vector(100, 300),
      end: new Vector(100, 150)
    },
    {
      id: 8,
      start: new Vector(100, 150),
      end: new Vector(150, 100)
    }
  ]
}
const player = {
  position: new Vector(200, 200),
  radius: 10,
  rotation: 180,
  moveSpeed: 1,
  turnSpeed: 90,
  maxSpeed: 1,
  friction: 2,
  velocity: new Vector(0, 0)
}
const keys = {
  backspace:      8,
  tab:            9,
  enter:          13,
  shift:          16,
  ctrl:           17,
  alt:            18,
  pause:          19,
  capslock:       20,
  escape:         27,
  space:          32,
  pageUp:         33,
  pageDown:       34,
  home:           36,
  end:            35,
  left:           37,
  up:             38,
  right:          39,
  down:           40,
  insert:         45,
  del:            46,
  zero:           48,
  one:            49,
  two:            50,
  three:          51,
  four:           52,
  five:           53,
  six:            54,
  seven:          55,
  eight:          56,
  nine:           57,
  a:              65,
  b:              66,
  c:              67,
  d:              68,
  e:              69,
  f:              70,
  g:              71,
  h:              72,
  i:              73,
  j:              74,
  k:              75,
  l:              76,
  m:              77,
  n:              78,
  o:              79,
  p:              80,
  q:              81,
  r:              82,
  s:              83,
  t:              84,
  u:              85,
  v:              86,
  w:              87,
  x:              88,
  y:              89,
  z:              90,
  select:         93,
  numpad0:        96,
  numpad1:        97,
  numpad2:        98,
  numpad3:        99,
  numpad4:        100,
  numpad5:        101,
  numpad6:        102,
  numpad7:        103,
  numpad8:        104,
  numpad9:        105,
  multiply:       106,
  add:            107,
  subtract:       109,
  decimal:        110,
  divide:         111,
  f1:             112,
  f2:             113,
  f3:             114,
  f4:             115,
  f5:             116,
  f6:             117,
  f7:             118,
  f8:             119,
  f9:             120,
  f10:            121,
  f11:            122,
  f12:            123,
  numlock:        144,
  scrollLock:     145,
  semicolon:      186,
  equal:          187,
  comma:          188,
  dash:           189,
  period:         190,
  forwardSlash:   191,
  graveAccent:    192,
  openBracket:    219,
  backSlash:      220,
  closeBraket:    221,
  singleQuote:    222
}
const key = {
  down: [],
  next: []
}
let lastTime = Date.now();
let deltaTime = 0;

const initialize = () => {
  window.requestAnimationFrame(mainLoop);
  listenForKeys();
}

/*==================================================
# KEYBOARD
==================================================*/
const listenForKeys = () => {
  window.addEventListener('keydown', function(e){
    key.next[e.keyCode] = true;
  })

  window.addEventListener('keyup', function(e){
    key.next[e.keyCode] = false;
  })
}

const updateKeyboard = () => {
  key.down = key.next;
}

/*==================================================
# UTILS
==================================================*/
const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
}

const updateTime = () => {
  const currentTime = Date.now();
  deltaTime = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime; 
}

/*==================================================
# PHYSICS
==================================================*/
const friction = () => {
  if(player.velocity.x < 0){
    player.velocity.x = Math.min(0, player.velocity.x * deltaTime);
  }
  else if(player.velocity.x > 0){
    player.velocity.x = Math.max(0, player.velocity.x * deltaTime);
  }
  if(player.velocity.y < 0){
    player.velocity.y = Math.min(0, player.velocity.y + player.friction * deltaTime);
  }
  else if(player.velocity.y > 0){
    player.velocity.y = Math.max(0, player.velocity.y - player.friction * deltaTime);
  }
}

/*==================================================
# PLAYER
==================================================*/
const checkPlayerCollisions = () => {
  const point = new Vector();

  sector.walls.forEach(wall => {
    const l2 = Vector.distance(wall.start, wall.end);
    const vector1 = player.position.minus(wall.start);
    const vector2 = wall.end.minus(wall.start);

    // Adds vector1 and vector2 together and then divides by the magnitude of the line to get the percent difference. You can then use that number and multiply it by the length of the line to get the projection.
    const t = Math.max(0, Math.min(1, Vector.dot(vector1, vector2) / l2));
    const projection = new Vector(
      wall.start.x + t * vector2.x,
      wall.start.y + t * vector2.y
    )

    context.beginPath();
    context.fillStyle = 'red';
    context.arc(projection.x, projection.y, 4, 0, Math.PI * 2);
    context.fill();
    context.closePath();

    const distance = Math.sqrt(Vector.distance(player.position, projection));

    if(distance < player.radius){
      const magnitude = Math.sqrt(l2);
      const delta = wall.end.minus(wall.start);
      const normal = new Vector(delta.x / magnitude, delta.y / magnitude);
      player.position.x = projection.x + player.radius * -normal.y;
      player.position.y = projection.y + player.radius * normal.x;
    }
  })
}

const updatePlayer = () => {
  if(key.down[keys.up]){
    player.velocity.y = Math.max(-player.maxSpeed, player.velocity.y - player.moveSpeed * deltaTime);
  }
  else if(key.down[keys.down]){
    player.velocity.y = Math.min(player.maxSpeed, player.velocity.y + player.moveSpeed * deltaTime);
  }
  else {
    friction();
  }

  if(key.down[keys.left]){
    player.rotation = player.rotation - player.turnSpeed * deltaTime;
  }
  else if(key.down[keys.right]){
    player.rotation = player.rotation + player.turnSpeed * deltaTime;
  }

  checkPlayerCollisions();

  const radians = toRadians(player.rotation);
  const move = {
    x: Math.cos(radians) * player.velocity.y,
    y: Math.sin(radians) * player.velocity.y
  }

  player.position.x += move.x;
  player.position.y += move.y;
}

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
  sector.walls.forEach((wall) => {
    context.beginPath();
    context.strokeStyle = 'black';
    context.moveTo(wall.start.x, wall.start.y);
    context.lineTo(wall.end.x, wall.end.y);
    context.stroke();
    context.closePath();
  })
}


/*==================================================
# MAIN LOOP
==================================================*/
const mainLoop = () => {
  updateTime();
  clearCanvas();
  updateKeyboard();
  updatePlayer();
  drawPlayer();
  drawPlayerCollisionRadius();
  drawSectors();
  window.requestAnimationFrame(mainLoop);
}

initialize();