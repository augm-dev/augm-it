import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { skypin, unpkg } from 'rollup-plugin-cloudport'

let templates = ['saturation', 'external', 'ssr']
let flavors = [
	{
		destination: './builder/runtimes/',
		plugins: [resolve()]
	},
	{
		destination: './builder/runtimes/skypack/',
		plugins: [skypin()]
	},
	{
		destination: './builder/runtimes/unpkg/',
		plugins: [unpkg()]
	}
]


let builds = []
templates.forEach(name => {
  // Normal build
  builds.push({
    input: name+'.js',
    output: name+'.js',
    plugins: []
  })
  // Minified build
  builds.push({
    input: name+'.js',
    output: name+'.min.js',
    plugins: [terser()]
  })
})

let results = flavors.reduce((total, flavor) => {
	return [
		...total,
		...builds.map(build => ({
			input:'./builder/templates/' + build.input,
			output: [{
				format: 'esm',
				file:flavor.destination + build.output
			}],
			plugins: [
				...flavor.plugins,
				...build.plugins
			]
		}))
	]
}, [])

export default results