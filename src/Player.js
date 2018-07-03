import Vector from './Vector'
import {KeyboardListener, keys} from './Keyboard'
import Time from './Time'
import { toRadians } from './util'

export default class Player {
  constructor({ position = new Vector(0,0), radius = 10, rotation = 180, moveSpeed = 1, turnSpeed = 90, maxSpeed = 1, world = {}} = {}){
    this.position = position;
    this.radius = radius;
    this.rotation = rotation;
    this.moveSpeed = moveSpeed;
    this.turnSpeed = turnSpeed;
    this.maxSpeed = maxSpeed;
    this.friction = 2;
    this.velocity = new Vector(0, 0);
    this.world = world;
    this.activeSector = 0;
    this.keyboardListener = new KeyboardListener();
  }

  applyFriction(){
    if(this.velocity.x < 0){
      this.velocity.x = Math.min(0, this.velocity.x * Time.deltaTime);
    }
    else if(this.velocity.x > 0){
      this.velocity.x = Math.max(0, this.velocity.x * Time.deltaTime);
    }
    if(this.velocity.y < 0){
      this.velocity.y = Math.min(0, this.velocity.y + this.friction * Time.deltaTime);
    }
    else if(this.velocity.y > 0){
      this.velocity.y = Math.max(0, this.velocity.y - this.friction * Time.deltaTime);
    }
  }

  getActiveSector(){
    if(this.world){
      return this.world.sectors[this.activeSector];
    }
    return {
      walls: []
    };
  }

  checkCollisions(){
    this.getActiveSector().walls.forEach(wall => {
      const lengthSquared = Vector.distance(wall.start, wall.end);
      const vector1 = this.position.minus(wall.start); // delta of wall start to this
      const vector2 = wall.end.minus(wall.start); // length of wall
  
      // Adds vector1 and vector2 together and then divides by the magnitude of the line to get the percent difference. You can then use that number and multiply it by the length of the wall to get the projection.
      const t = Math.max(0, Math.min(1, Vector.dot(vector1, vector2) / lengthSquared));
      const projection = new Vector(
        wall.start.x + t * vector2.x,
        wall.start.y + t * vector2.y
      )
  
      const distance = Math.sqrt(Vector.distance(this.position, projection));
  
      if(distance < this.radius){
        const magnitude = Math.sqrt(lengthSquared);
        const delta = wall.end.minus(wall.start);
        const normal = new Vector(delta.x / magnitude, delta.y / magnitude);
        this.position.x = projection.x + this.radius * -normal.y;
        this.position.y = projection.y + this.radius * normal.x;
      }
    })
  }

  update(){
    this.keyboardListener.update();
    if(this.keyboardListener.down[keys.up]){
      this.velocity.y = Math.max(-this.maxSpeed, this.velocity.y - this.moveSpeed * Time.deltaTime);
    }
    else if(this.keyboardListener.down[keys.down]){
      this.velocity.y = Math.min(this.maxSpeed, this.velocity.y + this.moveSpeed * Time.deltaTime);
    }
    else {
      this.applyFriction();
    }

    if(this.keyboardListener.down[keys.left]){
      this.rotation = this.rotation - this.turnSpeed * Time.deltaTime;
    }
    else if(this.keyboardListener.down[keys.right]){
      this.rotation = this.rotation + this.turnSpeed * Time.deltaTime;
    }

    this.checkCollisions();

    const radians = toRadians(this.rotation);

    const move = new Vector(
      Math.cos(radians) * this.velocity.y,
      Math.sin(radians) * this.velocity.y
    )

    this.position.x += move.x;
    this.position.y += move.y;
  }
}