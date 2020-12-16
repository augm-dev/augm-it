import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { skypin } from 'rollup-plugin-skypin'
import pkg from './package.json';
import path from 'path'

let flavors = [
	{
		destination: './src/runtimes/',
		plugins: [resolve()]
	},
	{
		destination: './src/runtimes/skypin/',
		plugins: [skypin()]
	}
]

let builds = [
	{
		input: 'saturation.js',
		output: 'saturation.js',
		plugins: []
	},
	{
		input: 'saturation.js',
		output: 'saturation.min.js',
		plugins: [terser()]
	},
	{
		input: 'standalone.js',
		output: 'standalone.js',
		plugins: []
	},
	{
		input: 'standalone.js',
		output: 'standalone.min.js',
		plugins: [terser()]
	},
	{
		input: 'runtime.js',
		output: 'runtime.js',
		plugins: []
	},
	{
		input: 'runtime.js',
		output: 'runtime.min.js',
		plugins: [terser()]
	}
]

let results = flavors.reduce((total, flavor) => {
	return [
		...total,
		...builds.map(build => ({
			input:'./src/templates/' + build.input,
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