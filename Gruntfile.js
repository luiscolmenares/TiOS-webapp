// /* 
//  * To change this license header, choose License Headers in Project Properties.
//  * To change this template file, choose Tools | Templates
//  * and open the template in the editor.
//  */
// module.exports = function(grunt) {

//  grunt.initConfig({
//    pkg: grunt.file.readJSON('package.json'),
//    concat: {
//        // concat task configuration goes here.
//      },
//      uglify: {
//        // uglify task configuration goes here.
//      },
//    connect: {
//      example: {
//        port: 1337,
//        base: 'src'
//      }
//    }
//  });
//  grunt.loadNpmTasks('grunt-contrib-watch');
//  grunt.loadNpmTasks('grunt-connect');
//  grunt.registerTask('default', 'connect:example');

// };
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 
            'src/assets/js/modules/**/*.js',
            'src/assets/js/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    connect: {
    webapp: {
      port: 8000,
      base: 'src'
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-connect');

  // grunt.registerTask('default', ['jshint']);
  grunt.registerTask('serve', 'connect:webapp');
    // grunt.registerTask('default', 'connect:webapp');

};