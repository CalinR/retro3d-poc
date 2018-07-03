export default class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  minus(vector){
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  add(vector){
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  static dot(vector1, vector2){
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  static distance(vector1, vector2){
    const dx = vector1.x - vector2.x;
    const dy = vector1.y - vector2.y;
	  return dx * dx + dy * dy;
  }
}