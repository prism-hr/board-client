protractor = require('./protractor.conf.js');
const config = protractor.config;

config.capabilities.chromeOptions = {args: ["--headless"]};

exports.config = config;
