module.exports = function (grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'css/main.css': 'less/main.less'
				}
			}
		},
		watch: {
			less: {
				files: ['less/main.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.registerTask('default', ['less', 'watch']);
};
