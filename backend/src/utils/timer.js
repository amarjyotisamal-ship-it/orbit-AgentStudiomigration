export class Timer {
  constructor() {
    this.start = Date.now();
  }
  elapsedMs() {
    return Date.now() - this.start;
  }
}
