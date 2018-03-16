module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: ['./assets/css/less/*.less'],
                tasks: ['less']
            }
        },
        less: {
            development: {
                options: {
                    paths: ['./assets/css']
                },
                files: {
                    './assets/css/style.css': './assets/css/less/style.less'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};
