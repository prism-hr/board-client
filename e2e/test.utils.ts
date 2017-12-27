import * as dateFormat from 'dateformat';
import * as fs from 'fs';
import {resolve as pathResolve} from 'path';
import {browser, ElementFinder} from 'protractor';
import * as request from 'request';
import {resolve as urlResolve} from 'url';

export class TestUtils {

  static randomString(length) {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static removeTestData(defer) {
    setTimeout(() => request(urlResolve(this.getBaseUrl(), 'api/user/test'), {json: true, method: 'DELETE'}, (err, resp, body) => {
      if (err) {
        console.log('Unexpected error when deleting test data ' + err);
        defer.reject(err);
      } else if (resp.statusCode === 200) {
        console.log('Deleted test data');
        defer.fulfill(body);
      } else {
        console.log('Could not delete test data. Status code: ' + resp.statusCode);
        TestUtils.removeTestData(defer);
      }
    }), 500);
  }

  static getTestEmails(email, defer, expectedLength = 1) {
    setTimeout(() => request(urlResolve(this.getBaseUrl(), 'api/test/emails?email=' + email), {json: true}, (err, resp, body) => {
      if (err) {
        console.log('Error requesting test email ' + err);
        defer.reject(err);
      } else if (body.length === expectedLength) {
        defer.fulfill(body);
      } else if (body.length > expectedLength) {
        throw new Error('' + body.length + ' email found for ' + email + '. Expected: ' + expectedLength);
      } else {
        TestUtils.getTestEmails(email, defer);
      }
    }), 500);
  }

  static assertCurrentUrlEquals(relativeUrl: string) {
    expect(browser.getCurrentUrl()).toEqual(urlResolve(this.getBaseUrl(), relativeUrl));
  }

  static uploadFile(element: ElementFinder, relativeFilePath: string) {
    const absolutePath = pathResolve(__dirname, relativeFilePath);
    element.sendKeys(absolutePath);
  }

  static getFutureDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dateFormat2 = dateFormat(date, 'yyyy-mm-dd');
    return dateFormat2;
  }

  static getBaseUrl() {
    return browser.baseUrl.replace(':80', '');
  }

  static takeScreenshot(browser, filename) {
    browser.takeScreenshot().then(function (png) {
      fs.exists('tmp', exists => {
        fs.mkdir('tmp', created => {
          const stream = fs.createWriteStream('tmp/' + filename, {flags: 'w'});
          stream.write(new Buffer(png, 'base64'));
          stream.end();
        });
      });

    });
  }

}
