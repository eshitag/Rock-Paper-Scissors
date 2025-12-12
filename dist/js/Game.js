export default class GameObj {
  constructor() {
    this.active = false;
    this.p1AllTime = 0;
    this.cpAlltime = 0;
    this.p1Session = 0;
    this.cpSession = 0;
  }

  getActiveStatus() {
    this.active;
  }
  startGame() {
    this.active = true;
  }
  endGame() {
    this.active = false;
  }
  getP1AllTime() {
    return this.p1AllTime;
  }
  setp1AllTime(number) {
    this.p1AllTime = number;
  }
  getcpAllTime() {
    return this.cpAllTime;
  }
  setcpAllTime(number) {
    this.cpAllTime = number;
  }
  getP1session() {
    return this.p1Session;
  }
  getCpsession() {
    return this.cpSession;
  }
  p1Wins() {
    this.p1Session += 1;
    this.p1AllTime += 1;
  }
  cpWins() {
    this.cpSession += 1;
    this.cpAllTime += 1;
  }
}
