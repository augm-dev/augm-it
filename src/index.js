import { defineAsync, upgrade } from 'wicked-elements'

const loaded = new Set;

  //|     m4r.sh
 //||     9/18/20
//_||  @  

export default (path, options = {}) => {
  const ext = options.extension || '.js';
  const prefix = options.prefix || 'it-'
  const runtime = options.runtime || {
    html() { return render(this.element, html.apply(null, arguments)) },
    svg() { return render(this.element, svg.apply(null, arguments)) }
  };
  const container = options.container || document;
  const load = mutations => {
    for (let i = 0, {length} = mutations; i < length; i++) {
      for (let {addedNodes} = mutations[i], j = 0, {length} = addedNodes; j < length; j++ ) {
        const node = addedNodes[j];
        if (node.querySelectorAll) {
          const classes = node.classList.value + " " + (node.getAttribute('is') || node.tagName).toLowerCase()
          let id = classes.substr(classes.indexOf(prefix) + prefix.length).split(" ")[0]
          let it = id.length ? prefix + id : null
          if (it && !loaded.has(it)) {
            loaded.add(it);
            defineAsync(`.${it},${it},[is="${it}"]`, () => {
              return import(path.replace(/\/?$/, "/") + id + ext).then(mod => {
                Object.assign(mod.default,runtime)
                return mod;
              }).catch((e) => {
                console.log("No component found for " + id);
              });
             })
          }
          crawl(node.querySelectorAll('*'));
        }
      }
    }
  };
  const crawl = addedNodes => { load([{addedNodes}]) };
  crawl(container.querySelectorAll('*'));
  const observer = new MutationObserver(load);
  observer.observe(container, {subtree: true, childList: true});
  let upgrade = (target = container) => upgrade(target);
  augmit.disconnect = function(){
    observer.disconnect()
  }
  let augmit = upgrade
  augmit.upgrade = upgrade
  return augmit;
};