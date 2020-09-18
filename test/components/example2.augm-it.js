export default {
  init(){
    console.log("initializing example2");
    this.hello = this.element.getAttribute('hello');
    this.render();
  },
  observedAttributes: ['hello'],
  attributeChanged(name, old, value){
    if(name === 'hello'){
      this.hello = value;
    }
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