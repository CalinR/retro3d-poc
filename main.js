var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var lastTime = Date.now();
var deltaTime = 0;

var player = {
    x: 0,
    y: 0,
    rotation: 0,
    radius: 20,
    moveSpeed: 1,
    turnSpeed: 90,
    maxSpeed: 1,
    friction: 2,
    speed: {
        x: 0,
        y: 0,
        z: 0
    },
    position: {
        x: 100,
        y: 100,
        z: 0
    }
}

var keys = {
    backspace 		: 8,
    tab 			: 9,
    enter 			: 13,
    shift 			: 16,
    ctrl 			: 17,
    alt 			: 18,
    pause 			: 19,
    capslock 		: 20,
    escape 			: 27,
    space			: 32,
    pageUp 			: 33,
    pageDown 		: 34,
    home 			: 36,
    end 			: 35,
    left 			: 37,
    up 				: 38,
    right 			: 39,
    down 			: 40,
    insert 			: 45,
    del 			: 46,
    zero 			: 48,
    one 			: 49,
    two 			: 50,
    three 			: 51,
    four 			: 52,
    five 			: 53,
    six 			: 54,
    seven 			: 55,
    eight 			: 56,
    nine 			: 57,
    a				: 65,
    b 				: 66,
    c 				: 67,
    d 				: 68,
    e 				: 69,
    f 				: 70,
    g 				: 71,
    h 				: 72,
    i 				: 73,
    j 				: 74,
    k 				: 75,
    l 				: 76,
    m 				: 77,
    n 				: 78,
    o 				: 79,
    p 				: 80,
    q 				: 81,
    r 				: 82,
    s 				: 83,
    t 				: 84,
    u 				: 85,
    v 				: 86,
    w 				: 87,
    x 				: 88,
    y 				: 89,
    z 				: 90,
    leftWindow 		: 91,
    rightWindow 	: 92,
    select 			: 93,
    numpad0 		: 96,
    numpad1 		: 97,
    numpad2 		: 98,
    numpad3 		: 99,
    numpad4 		: 100,
    numpad5 		: 101,
    numpad6 		: 102,
    numpad7 		: 103,
    numpad8 		: 104,
    numpad9 		: 105,
    multiply 		: 106,
    add 			: 107,
    subtract 		: 109,
    decimal 		: 110,
    divide 			: 111,
    f1 				: 112,
    f2 				: 113,
    f3 				: 114,
    f4 				: 115,
    f5 				: 116,
    f6 				: 117,
    f7 				: 118,
    f8 				: 119,
    f9 				: 120,
    f10 			: 121,
    f11 			: 122,
    f12 			: 123,
    numlock 		: 144,
    scrollLock 		: 145,
    semicolon 		: 186,
    equal 			: 187,
    comma 			: 188,
    dash 			: 189,
    period 			: 190,
    forwardSlash 	: 191,
    graveAccent 	: 192,
    openBracket 	: 219,
    backSlash 		: 220,
    closeBraket 	: 221,
    singleQuote		: 222
}

var key = {
    up: false,
    down: false,
    left: false,
    right: false,
    down: [],
    next: []
}

function toRadians(degrees){
    return degrees * Math.PI / 180;
}

function update(){
    updateTime();
    updateKeyboard();
    updatePlayer();
    clearCanvas();

    drawPlayer();

    window.requestAnimationFrame(update);
}

function updateKeyboard(){
    key.down = key.next;
}

function updateTime(){
    var currentTime = Date.now();
    deltaTime = (currentTime - lastTime) / 1000.0;
    lastTime = currentTime;
}

function updatePlayer(){
    if(key.down[keys.up]){
        player.speed.y = Math.max(-player.maxSpeed, player.speed.y - player.moveSpeed * deltaTime);
    }
    else if(key.down[keys.down]){
        player.speed.y = Math.min(player.maxSpeed, player.speed.y + player.moveSpeed * deltaTime);
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

    var radians = toRadians(player.rotation);
    var move = {
        x: Math.cos(radians) * player.speed.y,
        y: Math.sin(radians) * player.speed.y
    }

    player.position.x += move.x;
    player.position.y += move.y;
}

function drawPlayer(){
    context.beginPath();
    context.strokeStyle = 'red';
    context.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
    context.stroke();
    context.closePath();
}

function friction(){
    if(player.speed.x < 0){
        player.speed.x = Math.min(0, player.speed.x * deltaTime);
    }
    else if(player.speed.x > 0){
        player.speed.x = Math.max(0, player.speed.x * deltaTime);
    }
    if(player.speed.y < 0){
        player.speed.y = Math.min(0, player.speed.y + player.friction * deltaTime);
    }
    else if(player.speed.y > 0){
        player.speed.y = Math.max(0, player.speed.y - player.friction * deltaTime);
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('keydown', function(e){
    key.next[e.keyCode] = true;
})

window.addEventListener('keyup', function(e){
    key.next[e.keyCode] = false;
})

window.requestAnimationFrame(update);