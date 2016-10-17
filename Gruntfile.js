module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: "**/*.scss",
            tasks: ['sass'],
        },
        sass: {
            dist: {
                
                // files: {
                //     'assets/css/main.css': 'assets/sass/style.scss'
                // }
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['**/*.scss'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
			}
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'assets/scss',
                    cssDir: 'assets/css',
                    outputStyle: 'compressed'
                }
            }
        },
        
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'assets/css/*.css',
                        'index.html',
			'*.html',
                        'sortable-bar-chart.html'
                    ]
                },
                options: {
                    host: "192.168.0.1",
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    // create custom task-list
    grunt.registerTask('default', ["browserSync", "watch"]);
};
