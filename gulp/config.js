var config = {
  dev: 'dev/',
  dist: 'publish/',
  modernizr: [],

  server: {
    baseDir: 'publish/',
    port: 3000,
    index: './index.html',
    host: 'localhost',
    sync: {
      files: [ 'publish/**/*.css', 'publish/js/*.js', 'publish/**/*.html' ],
      notify: true,
      reloadDelay: 0,
      minify: true,
      browser: 'google chrome',
      notify: false
    }
  }
}

module.exports = config;
