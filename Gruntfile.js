module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: ['./public/css/less/*.less'],
                tasks: ['less']
            }
        },
        less: {
            development: {
                options: {
                    paths: ['./public/css']
                },
                files: {
                    './public/css/style.css': './public/css/less/style.less'
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};
