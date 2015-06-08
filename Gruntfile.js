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
        }
    });

    grunt.registerTask('default', [
        'mochaTest',
        'umd'
    ]);
};
