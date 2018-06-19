const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const sector = {
  walls: [
    {
      id: 1,
      start: {
        x: 150,
        y: 100
      },
      end: {
        x: 300,
        y: 100
      }
    },
    {
      id: 2,
      start: {
        x: 300,
        y: 100
      },
      end: {
        x: 350,
        y: 150
      }
    },
    {
      id: 3,
      start: {
        x: 350,
        y: 150
      },
      end: {
        x: 350,
        y: 300
      }
    },
    {
      id: 4,
      start: {
        x: 350,
        y: 300
      },
      end: {
        x: 300,
        y: 350
      }
    },
    {
      id: 5,
      start: {
        x: 300,
        y: 350
      },
      end: {
        x: 150,
        y: 350
      }
    },
    {
      id: 6,
      start: {
        x: 150,
        y: 350
      },
      end: {
        x: 100,
        y: 300
      }
    },
    {
      id: 7,
      start: {
        x: 100,
        y: 300
      },
      end: {
        x: 100,
        y: 150
      }
    },
    {
      id: 8,
      start: {
        x: 100,
        y: 150
      },
      end: {
        x: 150,
        y: 100
      }
    }
  ]
}
const player = {
  x: 200,
  y: 200,
  radius: 10,
  rotation: 180,
  moveSpeed: 1,
  turnSpeed: 90,
  maxSpeed: 1,
  friction: 2,
  velocity: {
    x: 0,
    y: 0
  }
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

const dotProduct = (vector1, vector2) => {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}

function sqrMagnitude(vector){
  return vector.x * vector.x + vector.y * vector.y;
}

function getDistance(vector1, vector2){
  const a = Math.max(vector1.x, vector2.x) - Math.min(vector1.x, vector2.x);
  const b = Math.max(vector1.y, vector2.y) - Math.min(vector1.y, vector2.y);
  return Math.sqrt(a * a + b * b);
}

function normalize(vector){
  var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  return {
    x: vector.x / length,
    y: vector.y / length
  }
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
  sector.walls.forEach((wall) => {
    /* The wall distance code can be optimized */
    const vector1 = {
      x: player.x - wall.start.x,
      y: player.y - wall.start.y
    }
    const vector2 = {
      x: wall.end.x - wall.start.x,
      y: wall.end.y - wall.start.y
    }
    const dot = dotProduct(vector1, vector2);
    const magnitude = sqrMagnitude(vector2);
    const projection = {
      x: wall.start.x + ((dot * vector2.x) / magnitude),
      y: wall.start.y + ((dot * vector2.y) / magnitude)
    }
    const distance = getDistance({ x: player.x, y: player.y}, projection);

    if(distance < player.radius){
      const dx = wall.end.x - wall.start.x;
      const dy = wall.end.y - wall.start.y;
      const normalized = normalize({ x: dx, y: dy });
      player.x = projection.x + player.radius * -normalized.y;
      player.y = projection.y + player.radius * normalized.x;
    }

    context.beginPath();
    context.fillStyle = 'green';
    context.arc(projection.x, projection.y, 4, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  })

  if(player.x < 100){
    player.x = 100;
  }
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

  player.x += move.x;
  player.y += move.y;
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
  context.arc(player.x, player.y, 3, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

const drawPlayerCollisionRadius = () => {
  context.beginPath();
  context.strokeStyle = 'red';
  context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
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