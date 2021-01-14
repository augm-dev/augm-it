let default_config = {
  input: 'it',
  output: [
    {
      destination: 'public/it',
      cdn: 'skypack',
      minified: false
    }
  ]
}

export let normalizeConfig = (config={}) => {
  config = { ...default_config, ...config }
  if(!Array.isArray(config.output)){
    config.output = [config.output]
  }
  return config;
}