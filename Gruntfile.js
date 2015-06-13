module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
                github: {
                    repo: 'hippich/map-table',
                    usernameVar: 'GITHUB_USERNAME',
                    passwordVar: 'GITHUB_PASSWORD'
                },
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
        'release'
    ]);
};
