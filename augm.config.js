import { skypin } from 'skypin'

export let it = {
  cdn: skypin,
  source: 'it',
  destination: 'public/it',
  mode: 'all', // | 'saturation' | 'external',
  optimize: true, // minify

}

// TODO: export { preloadLinks(configPath?) } --> to insert HTML into the <head></head>