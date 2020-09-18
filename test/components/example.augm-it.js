export default {
  counter: 0,
  init(){
    this.render();
  },
  onClick(){
    this.counter++;
    this.render();
  },
  render(){
    this.html`
      <h1>
        Hello. ${this.counter} clicks so far!
      </h1>
      <it-example2 hello=${`Hello ${this.counter}`} />
    `
  }
}