module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        gitcommit: {
            release: {
                options: {
                    allowEmpty: true,
                    message: 'Update compiled version'
                },
                files: {
                    src: ['dist/index.js']
                }
            }
        },
        umd: {
            all: {
                options: {
                    src: 'src/index.js',
                    dest: 'dist/index.js',
                    globalAlias: 'MapTable',
                    objectToExport: 'MapTable'
                    //deps: { // optional, `default` is used as a fallback for rest!
                        //'default': ['foo', 'bar'],
                        //amd: ['foobar', 'barbar'],
                        //cjs: ['foo', 'barbar'],
                        //global: ['foobar', 'bar']
                    //}
                }
            }
        },
        mochaTest: {
            test: {
                src: ['tests/**/*.js'],
                options: {
                    require: 'should'
                }
            }
        },
        release: {
            options: {
                additionalFiles: ['bower.json'],
                commit: true,
                tagName: 'v<%= version %>'
            }
        }
    });

    grunt.registerTask('default', [
        'mochaTest',
        'umd'
    ]);

    grunt.registerTask('publish', [
        'default',
        'gitcommit:release',
        'release'
    ]);
};
