import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { skypin } from 'rollup-plugin-skypin'
import pkg from './package.json';

let localBuilds = [
	{
		input: './src/templates/saturation.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/saturation.js'
		}],
		plugins: [resolve()]
	},{
		input: './src/templates/saturation.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/saturation.min.js'
		}],
		plugins: [resolve(), terser()]
	},{
		input: './src/templates/runtime.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/runtime.js'
		}],
		plugins: [resolve()]
	},{
		input: './src/templates/runtime.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/runtime.min.js'
		}],
		plugins: [resolve(), terser()]
	}
]

let skypinBuilds = [
	{
		input: './src/templates/saturation.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/skypin/saturation.js'
		}],
		plugins: [skypin()]
	},{
		input: './src/templates/saturation.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/skypin/saturation.min.js'
		}],
		plugins: [skypin(), terser()]
	},{
		input: './src/templates/runtime.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/skypin/runtime.js'
		}],
		plugins: [skypin()]
	},{
		input: './src/templates/runtime.js',
		output: [{
			format: 'esm',
			file: 'src/runtimes/skypin/runtime.min.js'
		}],
		plugins: [skypin(), terser()]
	}
]

export default [
	...localBuilds,
	...skypinBuilds
]
