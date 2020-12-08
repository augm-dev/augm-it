import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { skypin } from 'rollup-plugin-skypin'
import pkg from './package.json';

export default [{
	input: './src/templates/saturation.js',
	output: [{
		format: 'esm',
		file: 'src/runtimes/saturation-cdn.js'
	}],
	plugins: [skypin()]
},{
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
		file: 'src/runtimes/saturation-cdn.min.js'
	}],
	plugins: [skypin(), terser()]
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
	plugins: [skypin()]
}]
