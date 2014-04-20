/* jshint indent: false, quotmark: false */

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // loads multiple grunt (plugins) tasks: https://github.com/sindresorhus/load-grunt-tasks
  require('time-grunt')(grunt);       // Displays the elapsed execution time of grunt tasks when done https://github.com/sindresorhus/time-grunt

  // references and exposes data in package.json
  var pkgJson = grunt.file.readJSON('package.json');

  // ### Project configuration.
  grunt.initConfig({

    // local variables
    config: {
      appName     : pkgJson.name,
      appVer      : pkgJson.version,
      baseFilename: pkgJson.appFilename,
      appStartCmd : [pkgJson.name, 'start();'].join('.'),
      client: {
        root  : 'client',
        src   : 'client/src',
        vendor: 'client/vendor',
        assets: 'client/assets',
      },
      server: {
        root: 'server',
        src : 'server/src',
      },
      build: {
        app   : 'build/app',
        dist  : 'build/dist',
        target: 'server/public',
      },
      tests: {
        client  : 'client/test',
        server  : 'server/test',
        ui      : 'test',
        uiCasper: 'test/casperjs',
      },
    },

    // ### GLOBAL UTILITIES

    notify: {
      devbuild    : { options: { title: '<%= config.appName %> Dev', message: 'Build completed successfully' } },
      debugbuild  : { options: { title: '<%= config.appName %> Debug', message: 'Build completed successfully' } },
      releasebuild: { options: { title: '<%= config.appName %> Release', message: 'Build completed successfully' } },
      testingbuild: { options: { title: '<%= config.appName %> Testing', message: 'Build completed successfully' } },
      devrebuild  : { options: { title: '<%= config.appName %> Dev', message: 'Rebuild completed successfully' } },
    },

    // cleaning target directory
    clean: {
      build   : ['build/*'],
      buildApp: ['build/app'],
      target  : ['server/public'],
    },

    watch: {
      options: {
        spawn: false,
      },
      appShell: {
        files: ['client/src/index.hjs'],
        tasks: ['replace:dev', 'scriptlinker:srcJs', 'scriptlinker:vendor', 'notify:devrebuild'], //all the tasks are run dynamically during the watch event handler
        options: { event: 'changed', },
      },
      clientSrc: {
        files: ['client/src/js/**/*.js', 'client/vendor/**/*.js'],
        tasks: ['replace:dev', 'scriptlinker:srcJs', 'scriptlinker:vendor', 'notify:devrebuild'], //all the tasks are run dynamically during the watch event handler
        options: { event: ['added', 'deleted'], },
      },
      bower: {
        files: ['bower_components'],
        tasks: ['bower'], //all the tasks are run dynamically during the watch event handler
        options: { event: ['added', 'deleted'], },
      },
    },

    // ### BUILD CHAIN TASKS

    // JS Hint options :: see http://www.jshint.com/options/
    jshint: {
      grunt: {
        options: { jshintrc: '.jshintrc' },
        files  : { src: ['Gruntfile.js', '.jshintoptions.js'] },
      },
      client: {
        options: { jshintrc: '<%= config.client.src %>/js/.jshintrc' },
        files  : { src: ['<%= config.client.src %>/js/**/*.js'] },
      },
      server: {
        options: { jshintrc: '<%= config.server.root %>/.jshintrc' },
        files  : { src: ['<%= config.server.root %>/server.js', '<%= config.server.src %>/**/*.js'] },
      },
      testClient: {
        options: { jshintrc: '<%= config.tests.client %>/.jshintrc' },
        files  : { src: ['<%= config.tests.client %>/**/*.js', '!<%= config.tests.client %>/vendor/**/*.js'] },
      },
      testServer: {
        options: { jshintrc: '<%= config.tests.server %>/.jshintrc' },
        files  : { src: ['<%= config.tests.server %>/**/*.js'] },
      },
    },

    bower: {
      dev: {
        dest: 'client/vendor'
      }
    },

    scriptlinker: {
      srcJs: {
        options: {
          startTag: '<!-- SCRIPTS -->\n',
          endTag  : '  <!-- SCRIPTS END -->',
          fileTmpl: '  <script src="/assets/%s"></script>\n',
          appRoot : '<%= config.client.root %>/',
        },
        files: {
          // Target-specific file lists and/or options go here.
          '<%= config.build.target %>/index.hjs': [
            '<%= config.client.src %>/js/app.js',
            '<%= config.client.src %>/js/**/*Module.js',
            '<%= config.client.src %>/js/**/*.js',
          ]
        }
      },
      vendor: {
        options: {
          startTag: '<!-- VENDOR -->\n',
          endTag  : '  <!-- VENDOR END -->',
          fileTmpl: '  <script src="/assets/%s"></script>\n',
          appRoot : '<%= config.client.root %>/',
        },
        files: {
          // Target-specific file lists and/or options go here.
          '<%= config.build.target %>/index.hjs': [
            '<%= config.client.vendor %>/angular.js',
            '<%= config.client.vendor %>/angular-*.js',
            '<%= config.client.vendor %>/**/*.js',
          ]
        }
      }
    },

    ngtemplates: {
      build: {
        cwd    : 'client',
        src    : 'src/templates/**/*.html',    // config.client variable not used because 'cwd' changed task root
        dest   : '<%= config.build.app %>/templates/templates.js',
        options: {
          module : '<%= config.baseFilename %>.templates',
          prefix : '/assets',
          htmlmin: {
            collapseBooleanAttributes    : true,
            collapseWhitespace           : true,
            removeAttributeQuotes        : true,
            removeComments               : true, // Only if you don't use comment directives!
            removeEmptyAttributes        : true,
            removeRedundantAttributes    : true,
            removeScriptTypeAttributes   : true,
            removeStyleLinkTypeAttributes: true,
          },
        }
      }
    },

    replace: {
      dev: {
        options: {
          variables: {
            appStartCmd : '<%= config.appStartCmd %>',
            appJs       : '<!-- SCRIPTS -->\n  <!-- SCRIPTS END -->',
            appCss      : '<link rel="stylesheet/less" type="text/css" href="/assets/src/styles/style.less" media="all">',
            lessJs      : '<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.7.0/less.min.js" type="text/javascript"></script>',
            vendorJs    : '<!-- VENDOR -->\n  <!-- VENDOR END -->',
          },
          force: true
        },
        files: [
          { expand: true, flatten: true, src: ['<%= config.client.src %>/*.hjs'], dest: '<%= config.build.target %>/' }
        ]
      },
      debug: {
        options: {
          variables: {
            appStartCmd : '<%= config.appStartCmd %>',
            appJs       : '<script src="/assets/js/<%= config.baseFilename %>.js"></script>',
            appCss      : '<link rel="stylesheet" type="text/css" href="/assets/css/<%= config.baseFilename %>.css"/>',
            lessJs      : '',
            vendorJs    : '<script src="/assets/js/vendor.js"></script>',
          },
          force: true
        },
        files: [
          { expand: true, flatten: true, src: ['<%= config.client.src %>/*.hjs'], dest: '<%= config.build.dist %>/' }
        ]
      },
      release: {
        options: {
          variables: {
            appStartCmd : '<%= config.appStartCmd %>',
            appJs       : '<script src="/assets/js/<%= config.baseFilename %>.min.js"></script>',
            appCss      : '<link rel="stylesheet" type="text/css" href="/assets/css/<%= config.baseFilename %>.min.css"/>',
            lessJs      : '',
            vendorJs    : '<script src="/assets/js/vendor.min.js"></script>',
          },
          force: true
        },
        files: [
          { expand: true, flatten: true, src: ['<%= config.client.src %>/*.hjs'], dest: '<%= config.build.dist %>/' }
        ]
      }
    },

    // The concatenate task merges require.js/almond and other dependencies (templates)
    // into the application code.
    concat: {
      options: {
        separator: ';\n\n'
      },
      src: {
        src: [
          '<%= config.client.src %>/js/app.js',
          '<%= config.client.src %>/js/**/*Module.js',
          '<%= config.client.src %>/js/**/*.js',
          '<%= config.build.app %>/templates/templates.js',
        ],
        dest: '<%= config.build.app %>/js/<%= config.baseFilename %>.js'
      },
      vendor: {
        src: [
          '<%= config.client.vendor %>/angular.js',
          '<%= config.client.vendor %>/angular-*.js',
          '<%= config.client.vendor %>/**/*.js',
        ],
        dest: '<%= config.build.app %>/js/vendor.js'
      }
    },

    less: {
      build: {
        options: {
          paths: ['<%= config.client.src %>/styles']
        },
        files: {
          '<%= config.build.app %>/css/<%= config.baseFilename %>.css' : '<%= config.client.src %>/styles/style.less'
        }
      }
    },

    cssmin: {
      options: {
        banner: '/*! <%= config.appName %> - v<%= config.appVer %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      release: {
        files : {
          '<%= config.build.app %>/css/<%= config.baseFilename %>.min.css' : ['<%= config.build.app %>/css/<%= config.baseFilename %>.css'],
        }
      }
    },

    // minifying app js-file on release
    uglify: {
      options: {
        banner: '/*! <%= config.appName %> - v<%= config.appVer %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        beautify: false,
      },
      release: {
        src: '<%= config.build.app %>/js/<%= config.baseFilename %>.js',
        dest: '<%= config.build.app %>/js/<%= config.baseFilename %>.min.js',
      },
      vendor: {
        options: { banner: '', mangle: true },
        src: '<%= config.build.app %>/js/vendor.js',
        dest: '<%= config.build.app %>/js/vendor.min.js',
      },
    },

    hashres: {
      options: {
        fileNameFormat: '${hash}-${name}.${ext}'
      },
      build: {
        src: [
          '<%= config.build.dist %>/**/*.css',
          '<%= config.build.dist %>/**/*.js'
        ],
        dest: '<%= config.build.dist %>/index.hjs'
       }
    },

    copy: {
      assets: {
        files : [
          { expand: true, cwd: '<%= config.client.src %>/img/',   src: ['**'], dest: '<%= config.build.app %>/img/' },
          { expand: true, cwd: '<%= config.client.src %>/fonts/', src: ['**'], dest: '<%= config.build.app %>/fonts/' },
        ]
      },
      debugDist: {
        files : [
          { expand: true, cwd: '<%= config.build.app %>/css/',   src: ['**/*.css'], dest: '<%= config.build.dist %>/css' },
          { expand: true, cwd: '<%= config.build.app %>/js/',    src: ['**/*.js'],  dest: '<%= config.build.dist %>/js/' },
          { expand: true, cwd: '<%= config.build.app %>/fonts/', src: ['**'],       dest: '<%= config.build.dist %>/fonts/' },
          { expand: true, cwd: '<%= config.build.app %>/img/',   src: ['**'],       dest: '<%= config.build.dist %>/img/' },
          { expand: true, cwd: '<%= config.client.assets %>',    src: ['**'],       dest: '<%= config.build.dist %>/assets' },
        ]
      },
      releaseDist: {
        files : [
          { expand: true, cwd: '<%= config.build.app %>/css/',   src: ['**/*.min.css'], dest: '<%= config.build.dist %>/css' },
          { expand: true, cwd: '<%= config.build.app %>/js/',    src: ['**/*.min.js'],  dest: '<%= config.build.dist %>/js/' },
          { expand: true, cwd: '<%= config.build.app %>/fonts/', src: ['**'],           dest: '<%= config.build.dist %>/fonts/' },
          { expand: true, cwd: '<%= config.build.app %>/img/',   src: ['**'],           dest: '<%= config.build.dist %>/img/' },
          { expand: true, cwd: '<%= config.client.assets %>',    src: ['**'],           dest: '<%= config.build.dist %>/assets' },
        ]
      },
      distToTarget: {
        files : [
          { expand: true, cwd: '<%= config.build.dist %>/', src: ['**'], dest: '<%= config.build.target %>/' }
        ]
      }
    },

    shell: {
      devSymlink: { command: './scripts/devsymlink.sh' }
    },

    // #### TESTING

    // server-side tests
    simplemocha: {
      options: {
        timeout    : 3000,
        ignoreLeaks: false,
        globals    : ['NODE_CONFIG'],
        ui         : 'bdd',
        reporter   : 'dot',
      },
      server: {
        src: ['server/test/init.js', 'server/test/**/*.spec.js']
      }
    },

    // client-side tests
    karma:{
      dev: {
        configFile:'client/karma.conf.js',
        singleRun: false,
        autoWatch: true,
      },
      ci: {
        configFile: 'client/karma.conf.js',
        singleRun: true,
        autoWatch: false,
      }
    }
  });


  // ###################################################################################
  // ### BUILD CHAINS DEFINITIONS (compiling static assets)
  // ###################################################################################

  grunt.registerTask('testServer', ['jshint:server', 'jshint:testServer', 'clean:target', 'replace:dev', 'shell:devSymlink', 'simplemocha:server']);
  grunt.registerTask('testClient', ['jshint:client', 'jshint:testClient', 'karma:ci']);
  grunt.registerTask('test', ['jshint:grunt', 'testServer', 'testClient']);


  // js-hints source, cleans build dir, hooks dev paths into HTML app shell,
  grunt.registerTask('devBuild', [
    'jshint',
    'clean',
    'bower',
    'replace:dev',
    'scriptlinker:vendor',
    'scriptlinker:srcJs',
    'shell:devSymlink',
    'watch',
  ]);

  // js-hints source, cleans build dir, builds client app file with templates, LESS to CSS
  grunt.registerTask('_buildApp', [
    'jshint',
    'clean',
    'bower',
    'less:build',
    'ngtemplates:build',
    'concat:vendor',
    'concat:src',
    'copy:assets',
  ]);

  // builds app, adds r.js, hooks debug paths into HTML app shell, prepares static assets
  grunt.registerTask('debugBuild', [
    '_buildApp',
    'replace:debug',
    'copy:debugDist',
    'hashres:build',
    'clean:buildApp',
  ]);

  // builds app, adds r.js, minifies app and CSS, hooks release paths into HTML app shell, prepares static assets
  grunt.registerTask('releaseBuild', [
    '_buildApp',
    'uglify',
    'cssmin',
    'replace:release',
    'copy:releaseDist',
    'hashres:build',
    'clean:buildApp',
  ]);


  // dev build: runs build, symlinks client app sources to be accessible from node /public
  grunt.registerTask('dev', [
    'devBuild',
    'notify:devbuild',
  ]);

  // debug app: runs build, cleans node's /public and copies built app into it
  grunt.registerTask('debug', [
    'debugBuild',
    'clean:target',
    'copy:distToTarget',
    'notify:debugbuild',
  ]);

  // release app: runs build, cleans node's /public and copies built app into it
  grunt.registerTask('release', [
    'releaseBuild',
    'clean:target',
    'copy:distToTarget',
    'notify:releasebuild',
  ]);


  // Default task: a dev build
  grunt.registerTask('default', 'dev');
};
