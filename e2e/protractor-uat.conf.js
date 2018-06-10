protractor = require('./protractor.conf.js');
const config = protractor.config;

config.capabilities.chromeOptions = {args: ["--headless", '--no-sandbox', "--disable-gpu", "--window-size=800x600"]};

exports.config = config;
