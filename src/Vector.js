export default class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  // magnitude(){
  //   return Math.sqrt(this.x * this.x + this.y * this.y);
  // }

  // normalized(){
  //   const magnitude = this.magnitude();
  //   return new Vector(this.x / magnitude, this.y / magnitude);
  // }

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

  static getNormal(vector1, vector2){
    const delta = vector1.minus(vector2);
    return new Vector(-delta.y, delta.x).normalized();
  }

  static getDistanceToLine(point, lineStart, lineEnd){
    const l2 = Vector.distance(lineStart, lineEnd);
    const vector1 = point.minus(lineStart);
    const vector2 = lineEnd.minus(lineStart);

    // Adds vector1 and vector2 together and then divides by the magnitude of the line to get the percent difference. You can then use that number and multiply it by the length of the line to get the projection.
    const t = Math.max(0, Math.min(1, Vector.dot(vector1, vector2) / l2));

    const projection = new Vector(
      lineStart.x + t * vector2.x,
      lineStart.y + t * vector2.y
    )

    return Math.sqrt(Vector.distance(a, projection));
  }
}