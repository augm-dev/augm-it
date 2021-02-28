import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default [{
	input: 'src/index.ts',
	output: [{
		format: 'cjs',
		file: pkg.main,
		sourcemap: false,
	}],
	plugins: [
		resolve(),
		typescript({
			useTsconfigDeclarationDir: true
		})
	]
},{
	input: 'src/browser.js',
	output: [{
		format: 'umd',
		file: pkg.unpkg,
		name: 'augmit',
		sourcemap: false,
		plugins: [terser()]
	}, {
		format: 'esm',
		file: pkg.browser,
		sourcemap: false,
		plugins: [terser()]
	}],
	plugins: [
		resolve(),
		typescript({
			useTsconfigDeclarationDir: true
		})
	]
},{
	input: 'src/saturation.js',
	output: [{
		format: 'esm',
		file: 'saturation/index.js',
		sourcemap: false,
		plugins: [terser()]
	}],
	plugins: [
		resolve(),
		typescript({
			useTsconfigDeclarationDir: true
		})
	]
}]