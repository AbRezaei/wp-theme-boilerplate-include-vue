import path from 'path';
import {fileURLToPath} from 'url';

import {VueLoaderPlugin} from "vue-loader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: {
		app: './src/index.js'
	},
	output: {
		path: __dirname + '/dist/js',
		filename: '[name].js',
	},
	resolve: {
		alias: {
			vue: "vue/dist/vue.esm-bundler.js"
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/preset-env'
						],
					],
				}
			}
		],
	},
	plugins: [
		new VueLoaderPlugin()
	]
};
