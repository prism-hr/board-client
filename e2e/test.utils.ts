import {resolve as pathResolve} from 'path';
import {browser, ElementFinder} from 'protractor';
import * as request from 'request';
import * as dateFormat from 'dateformat';
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
    request(urlResolve(this.getBaseUrl(), 'api/user/test'), {json: true, method: 'DELETE'}, (err, resp, body) => {
      if (err || resp.statusCode !== 200) {
        console.log('Error deleting test data ' + (err || JSON.stringify(resp)));
        defer.reject(err);
      } else {
        console.log('Deleted test data');
        defer.fulfill(body);
      }
    });
  }

  static getTestEmails(email, defer) {
    setTimeout(() => request(urlResolve(this.getBaseUrl(), 'api/test/emails?email=' + email), {json: true}, (err, resp, body) => {
      if (err) {
        console.log('Error requesting test email ' + err);
        defer.reject(err);
      } else if (body.length > 0) {
        defer.fulfill(body);
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

}
