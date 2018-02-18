// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

const screenshotReporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html',
  captureOnlyFailedSpecs: true,
  showQuickLinks: true
});

function randomString(length) {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/1setup-department.e2e-spec.ts',
    './e2e/2setup-post.e2e-spec.ts',
    './e2e/3apply-to-post.e2e-spec.ts',
    './e2e/4change-password.e2e-spec.ts',
    './e2e/5suppress-post-emails.e2e-spec.ts',
    './e2e/6revise-post-responses.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  params: {
    randomString: randomString(4)
  },
  beforeLaunch: function() {
    return new Promise(function(resolve){
      screenshotReporter.beforeLaunch(resolve);
    });
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(screenshotReporter);
  },
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      screenshotReporter.afterLaunch(resolve.bind(this, exitCode));
    });
  },
  plugins: [{
    package: 'protractor-console',
    logLevels: ['severe']
  }]
};
