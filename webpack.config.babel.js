import config from './config';
import path from 'path';
import webpack from 'webpack';

export default {
	devtool: '',
	entry: [
		path.join(__dirname, `${config.tasks.babel.src}`),
	],
	output: {
		path: path.join(__dirname, config.tasks.babel.dest),
		filename: config.tasks.babel.filename,
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: require.resolve("jquery"),
				exclude: /node_modules/,
				loader: "expose-loader?$!expose-loader?jQuery",
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
	],
};
