var Lie = typeof Promise === 'function' ? Promise : function (fn) {
  let queue = [], resolved = 0, value;
  fn($ => {
    value = $;
    resolved = 1;
    queue.splice(0).forEach(then);
  });
  return {then};
  function then(fn) {
    return (resolved ? setTimeout(fn, 0, value) : queue.push(fn)), this;
  }
};

const {document: document$1, MutationObserver: MutationObserver$1, Set: Set$1, WeakMap: WeakMap$1} = self;

const elements = element => 'querySelectorAll' in element;
const {filter} = [];

var QSAO = options => {
  const live = new WeakMap$1;
  const callback = records => {
    const {query} = options;
    if (query.length) {
      for (let i = 0, {length} = records; i < length; i++) {
        loop(filter.call(records[i].addedNodes, elements), true, query);
        loop(filter.call(records[i].removedNodes, elements), false, query);
      }
    }
  };
  const drop = elements => {
    for (let i = 0, {length} = elements; i < length; i++)
      live.delete(elements[i]);
  };
  const flush = () => {
    callback(observer.takeRecords());
  };
  const loop = (elements, connected, query, set = new Set$1) => {
    for (let selectors, element, i = 0, {length} = elements; i < length; i++) {
      // guard against repeated elements within nested querySelectorAll results
      if (!set.has(element = elements[i])) {
        set.add(element);
        if (connected) {
          for (let q, m = matches(element), i = 0, {length} = query; i < length; i++) {
            if (m.call(element, q = query[i])) {
              if (!live.has(element))
                live.set(element, new Set$1);
              selectors = live.get(element);
              // guard against selectors that were handled already
              if (!selectors.has(q)) {
                selectors.add(q);
                options.handle(element, connected, q);
              }
            }
          }
        }
        // guard against elements that never became live
        else if (live.has(element)) {
          selectors = live.get(element);
          live.delete(element);
          selectors.forEach(q => {
            options.handle(element, connected, q);
          });
        }
        loop(element.querySelectorAll(query), connected, query, set);
      }
    }
  };
  const matches = element => (
    element.matches ||
    element.webkitMatchesSelector ||
    element.msMatchesSelector
  );
  const parse = (elements, connected = true) => {
    loop(elements, connected, options.query);
  };
  const observer = new MutationObserver$1(callback);
  const root = options.root || document$1;
  const {query} = options;
  observer.observe(root, {childList: true, subtree: true});
  if (query.length)
    parse(root.querySelectorAll(query));
  return {drop, flush, observer, parse};
};

const {create, keys} = Object;

const attributes = new WeakMap;
const lazy = new Set;

const query = [];
const config = {};
const defined = {};

const attributeChangedCallback = (records, o) => {
  for (let h = attributes.get(o), i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    const newValue = target.getAttribute(attributeName);
    h.attributeChanged(attributeName, oldValue, newValue);
  }
};

const set = (value, m, l, o) => {
  const handler = create(o, {element: {enumerable: true, value}});
  for (let i = 0, {length} = l; i < length; i++)
    value.addEventListener(l[i].t, handler, l[i].o);
  m.set(value, handler);
  if (handler.init)
    handler.init();
  const {observedAttributes} = o;
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChangedCallback);
    mo.observe(value, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes.map(attributeName => {
        if (value.hasAttribute(attributeName))
          handler.attributeChanged(
            attributeName,
            null,
            value.getAttribute(attributeName)
          );
        return attributeName;
      })
    });
    attributes.set(mo, handler);
  }
  return handler;
};

const {drop, flush, parse} = QSAO({
  query,
  handle(element, connected, selector) {
    const {m, l, o} = config[selector];
    const handler = m.get(element) || set(element, m, l, o);
    const method = connected ? 'connected' : 'disconnected';
    if (method in handler)
      handler[method]();
  }
});

const define = (selector, definition) => {
  if (-1 < query.indexOf(selector))
    throw new Error('duplicated: ' + selector);
  flush();
  const listeners = [];
  const retype = create(null);
  for (let k = keys(definition), i = 0, {length} = k; i < length; i++) {
    const key = k[i];
    if (/^on/.test(key) && !/Options$/.test(key)) {
      const options = definition[key + 'Options'] || false;
      const lower = key.toLowerCase();
      let type = lower.slice(2);
      listeners.push({t: type, o: options});
      retype[type] = key;
      if (lower !== key) {
        type = key.slice(2, 3).toLowerCase() + key.slice(3);
        retype[type] = key;
        listeners.push({t: type, o: options});
      }
    }
  }
  if (listeners.length) {
    definition.handleEvent = function (event) {
      this[retype[event.type]](event);
    };
  }
  query.push(selector);
  config[selector] = {m: new WeakMap, l: listeners, o: definition};
  parse(document.querySelectorAll(selector));
  whenDefined(selector);
  if (!lazy.has(selector))
    defined[selector]._();
};

const defineAsync = (selector, callback, _) => {
  lazy.add(selector);
  define(selector, {
    init() {
      if (lazy.has(selector)) {
        lazy.delete(selector);
        callback().then(({default: definition}) => {
          query.splice(query.indexOf(selector), 1);
          drop(document.querySelectorAll(selector));
          (_ || define)(selector, definition);
        });
      }
    }
  });
};

const whenDefined = selector => {
  if (!(selector in defined)) {
    let _, $ = new Lie($ => { _ = $; });
    defined[selector] = {_, $};
  }
  return defined[selector].$;
};

const loaded = new Set;

  //|     m4r.sh
 //||     9/18/20
//_||  @  

var index = (path, options = {}) => {
  const ext = options.extension || '.js';
  const prefix = options.prefix || 'it-';
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
          const classes = node.classList.value + " " + (node.getAttribute('is') || node.tagName).toLowerCase();
          let id = classes.substr(classes.indexOf(prefix) + prefix.length).split(" ")[0];
          let it = id.length ? prefix + id : null;
          if (it && !loaded.has(it)) {
            loaded.add(it);
            defineAsync(`.${it},${it},[is="${it}"]`, () => {
              return import(path.replace(/\/?$/, "/") + id + ext).then(mod => {
                Object.assign(mod.default,runtime);
                return mod;
              }).catch((e) => {
                console.log("No component found for " + id);
              });
             });
          }
          crawl(node.querySelectorAll('*'));
        }
      }
    }
  };
  const crawl = addedNodes => { load([{addedNodes}]); };
  crawl(container.querySelectorAll('*'));
  const observer = new MutationObserver(load);
  observer.observe(container, {subtree: true, childList: true});
  let upgrade = (target = container) => upgrade(target);
  let augmit = upgrade;
  augmit.upgrade = upgrade;
  augmit.disconnect = function(){
    observer.disconnect();
  };
  return augmit;
};

export default index;
