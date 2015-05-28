'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var snakeCase = require('lodash').snakeCase;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'So you want a ' + chalk.red('Gruntfile?')
    ));

    var prompts = [

    ];

    this.prompt(prompts, function (props) {

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { projectName: this.projectName, snakeCase: snakeCase }
      );
    },

    projectfiles: function () {
    },

    gruntFile: function () {
      var gruntConfig = {
        sass: {
          dist: {
            options: {
              style: 'compressed',
              quiet: false
            },
            files: {
              '<%= dist %>/css/styles.css': '<%= src %>/scss/styles.scss'
            }
          }
        },

        autoprefixer: {
          options: {
            browsers: ['> 1%', 'last 2 versions', 'ie 8', 'ie 9', 'Firefox ESR', 'Opera 12.1'],
            remove: false
          },
          dist: {
            src: '<%= dist %>/css/styles.css',
          }
        },

        jade: {
          compile: {
            options: {
              pretty: true,
              data: {
                debug: false
              }
            },
            files: [{
              expand: true,
              cwd: '<%= src %>/',
              src: ['*.jade', '!_*.jade'],
              ext: '.html',
              dest: '<%= dist %>/'
            }]
          }
        },

        jshint: {
          options: {
            jshintrc: '.jshintrc'
          },
          all: [
            'Gruntfile.js',
            '<%= src %>/js/**/*.js'
          ]
        },

        imagemin: {
          target: {
            files: [{
              expand: true,
              cwd: '<%= src %>/images/',
              src: ['**/*.{jpg,gif,svg,jpeg,png}'],
              dest: '<%= dist %>/images/'
            }]
          }
        },

        uglify: {
          options: {
            preserveComments: 'some',
            mangle: false
          },
          dist: {
            files: {
              '<%= dist %>/js/scripts.js': ['<%= src %>/js/scripts.js']
            }
          }
        },

        watch: {
          grunt: {
            files: ['Gruntfile.js'],
            tasks: ['sass', 'jshint']
          },
          sass: {
            files: '<%= src %>/scss/**/*.scss',
            tasks: ['sass', 'autoprefixer']
          },
          jade: {
            files: '<%= src %>/**/*.jade',
            tasks: ['jade']
          },
          js: {
            files: '<%= src %>/js/**/*.js',
            tasks: ['jshint', 'uglify']
          }
        },

        defaultTask: ['jade', 'sass', 'autoprefixer', 'imagemin', 'jshint', 'uglify', 'watch'],
        buildTask: ['jade', 'sass', 'autoprefixer', 'imagemin', 'jshint', 'uglify']
      };

      gruntConfig.sass.dist.options.compass = this.usesCompass;

      if (this.usesFoundation) {
        gruntConfig.sass.dist.options.loadPath = '<%= src %>/bower_components/foundation/scss';
      }

      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );

      this.gruntfile.insertConfig('sass', JSON.stringify(gruntConfig.sass));
      this.gruntfile.insertConfig('autoprefixer', JSON.stringify(gruntConfig.autoprefixer));
      this.gruntfile.insertConfig('jade', JSON.stringify(gruntConfig.jade));
      this.gruntfile.insertConfig('jshint', JSON.stringify(gruntConfig.jshint));
      this.gruntfile.insertConfig('imagemin', JSON.stringify(gruntConfig.imagemin));
      this.gruntfile.insertConfig('uglify', JSON.stringify(gruntConfig.uglify));
      this.gruntfile.insertConfig('watch', JSON.stringify(gruntConfig.watch));

      this.gruntfile.registerTask('default', gruntConfig.defaultTask);
    },

  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
