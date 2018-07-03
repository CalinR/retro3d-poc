// Creates Time Singleton
class Time {
  constructor(){
    this.deltaTime = 0;
    this.lastTime = Date.now();
  }

  update(){
    const currentTime = Date.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000.0;
    this.lastTime = currentTime;
  }
}

export default new Time();