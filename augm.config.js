import { skypin } from 'skypin'

export let it = {
  cdn: skypin,
  source: 'it',
  destination: 'public/it',
  mode: 'all', // | 'saturation' | 'external',
  optimize: true, // minify
  builders: {
    aggregate: [
      async function(targets){
        let mobileStyles = ""
        let desktopStyles = ""
        targets.forEach(target => {
          mobileStyles += target.styles(true)
          desktopStyles += target.styles(false)
        });
        return {
          'desktop.css': desktopStyles,
          'mobile.css': mobileStyles
        }
      }
    ]

    
  }
}



// TODO: export { preloadLinks(configPath?) } --> to insert HTML into the <head></head>