//jshint camelcase:false

module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({


		//
		// FILES STRUCTURE
		//
		files: {
			src: 'src/**/*.js',
			test: 'test/**/*.test.js',
			all: [
				'<%= files.src %>',
				'<%= files.test %>',
			],

			config: [
				'Gruntfile.js',
				'karma.config.js',
				'*.json'
			],
		},


		//
		// WATCH LISTENERS
		//
		watch: {
			config: {
				files: [ '<%= files.config %>' ],
				tasks: [ 'jshint:config' ],
			},

			app: {
				files: [ '<%= files.js %>' ],
				tasks: [ 'build-app' ],
			},

			test: {
				files: [ '<%= files.test %>' ],
				tasks: [ 'watch-tests' ],
			},

			less: {
				files: [ '<%= files.less %>' ],
				tasks: [ 'build-less' ],
			},
		},


		//
		// TESTS
		//

		karma: {
			options: {
				configFile: 'karma.config.js',
			},
			run: { },
			once: {
				options: {
					singleRun: true,
					autoWatch: false,
				}
			}
		},


		//
		// BUILDERS
		//

		jshint: {
			options: {
				jshintrc: 'jshint.config.json',
			},
			src: [ '<%= files.src %>' ],
			test: [ '<%= files.test %>' ],
			config: [ '<%= files.config %>' ],
		}
	});


	//
	// GRUNT PLUGINS
	//

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');


	//
	// BATCH TASKS
	//

	grunt.registerTask('build', [
		'build-app',
		'build-less',
	]);


	//
	// DEFAULT TASK
	//
	grunt.registerTask('default', [ 'watch' ]);
};
