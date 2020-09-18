export default {
  init(){
    this.hello = this.element.getAttribute('hello');
    this.render();
  },
  render(){
    this.html`
      <h1>
        Hello ${this.hello}
      </h1>
    `
  }
}