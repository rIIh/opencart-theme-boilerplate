const extension = 'afterfive';

const opencartPath = './opencart/upload';
const storePath = './store';
const extensionPath = './build';
const livePath = 'live';
const extensionSource = './src';

Array.prototype.without = function(...elements) {
    const result = [...this];
    elements.forEach(element => {
        const index = result.indexOf(element);
        if (index >= 0) {
            result.splice(index, 1);
        }
    })
    return result;
}

const storePathsToUpdate = ['admin', 'admin/**/*', 'catalog', 'catalog/**/*', '!**/config.php'];
const storePathsToClean = storePathsToUpdate.without('admin', 'catalog');

/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            store_update: {
                cwd: storePath,
                src: storePathsToClean,
                expand: true,
            },
            store: {
                src: storePath+'/*'
            },
            live: {
                src: livePath,
            },
            extension: {
                src: [extensionPath],
            }
        },
        sass: {
            store: {
                files: {
                    [`${extensionPath}/catalog/view/theme/${extension}/stylesheet/stylesheet.css`]: `${extensionSource}/style/index.scss`,
                }
            },
            live: {
                files: {
                    [`${livePath}/style/stylesheet.css`]: `${extensionSource}/style/index.scss`
                }
            }
        },
        pug: {
            compile: {
                options: {
                    data: {}
                },
                files: [{
                    expand: true,
                    cwd: `${extensionSource}/markup/static`,
                    src: [ '**/*.pug' ],
                    dest: livePath,
                    ext: '.html'
                }]
            }
        },
        watch: {
            extension: {
                files: [`${extensionSource}/**/*`],
                tasks: ['update'],
            },
            live: {
                options: {
                  livereload: {
                      host: 'localhost',
                      port: 4001,
                  },
                },
                files: [`${extensionSource}/**/*`],
                tasks: ['update_live'],
            }
        },
        copy: {
            // fresh store
            store_update: {
                cwd: opencartPath,
                src: storePathsToUpdate,
                dest: storePath,
                expand: true,
            },
            store: {
                cwd: opencartPath,
                src: ['**'],
                dest: storePath,
                expand: true,
            },
            admin_ext: {
                cwd: extensionSource,
                src: ['admin', 'admin/**'],
                dest: extensionPath,
                expand: true,
            },
            catalog_ext: {
                cwd: `${extensionSource}/markup/twig`,
                src: '**',
                dest: extensionPath,
                expand: true,
            },
            extension: {
                expand: true,
                cwd: extensionPath,
                src: '**',
                dest: storePath,
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: livePath,
                    hostname: '*',
                    livereload: 4001,
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('updateStore', ['clean:store_update', 'copy:store_update'])
    grunt.registerTask('reinstall_store', ['clean:store', 'copy:store'])
    grunt.registerTask('update_extension', ['clean:extension', 'copy:admin_ext', 'copy:catalog_ext', 'sass:store'])
    grunt.registerTask('update_live', ['clean:live', 'sass:live', 'pug'])
    grunt.registerTask('copy_extension', ['copy:extension'])
    grunt.registerTask('update', ['updateStore', 'update_extension', 'copy_extension'])
    grunt.registerTask('live', ['update_live', 'connect', 'watch:live'])

    grunt.registerTask('default', ['update', 'watch:extension'])

    // grunt.registerTask(
    //     'build',
    //     [ 'clean', 'copy', 'pug', 'sass' ]
    // );
    //
    // grunt.registerTask(
    //     'default',
    //     ['build', 'connect', 'watch']
    //     //['watch']
    // );
}