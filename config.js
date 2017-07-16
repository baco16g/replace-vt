import minimist from 'minimist';

const envSettings = {
	string: 'env',
	default: {
		env: process.env.NODE_ENV || 'development',
	},
};

const options = minimist(process.argv.slice(2), envSettings);
const production = options.env === 'production';

const config = {
	dirs: {
		src: './src',
		dest: './docs',
	},
	absDirs: {
		src: '/src',
		dest: '/docs',
	},
	envProduction: production,
};

const tasks = {
	pug: {
		src: [`${config.dirs.src}/pug/!(_)*.pug`, `${config.dirs.src}/pug/pages/**/!(_)*.pug`],
		dest: `${config.dirs.dest}`,
		options: {
			pretty: true,
			basedir: __dirname + `${config.absDirs.src}`,
		},
	},
	sass: {
		src: `${config.dirs.src}/sass/!(_)*.{scss,sass}`,
		dest: `${config.dirs.dest}/assets/css`,
		options: {
			outputStyle: 'expanded',
		},
	},
	babel: {
		src: `${config.dirs.src}/js/app.js`,
		dest: `${config.dirs.dest}/assets/js`,
		filename: 'bundle.js',
	},
	watch: {
		pug: [`${config.dirs.src}/pug/**/*.pug`],
		sass: [`${config.dirs.src}/sass/**/*.scss`],
		babel: [`${config.dirs.src}/js/**/*.js`],
	},
	clean: [
		config.dirs.dest,
	],
};

config.tasks = tasks;
module.exports = config;
