import {browser, ElementFinder} from 'protractor';
import * as request from 'request';
import {resolve as urlResolve} from 'url';
import {resolve as pathResolve} from 'path';

export class TestUtils {

  static randomString(length) {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static getTestEmails(email, defer) {
    setTimeout(() => request(urlResolve(browser.baseUrl, 'api/test/emails?email=' + email), {json: true}, (err, resp, body) => {
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
    expect(browser.getCurrentUrl()).toEqual(urlResolve(browser.baseUrl, relativeUrl));
  }

  static uploadFile(element: ElementFinder, relativeFilePath: string){
    const absolutePath = pathResolve(__dirname, relativeFilePath);
    element.sendKeys(absolutePath);
  }

}
