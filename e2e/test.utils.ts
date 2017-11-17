import {browser} from 'protractor';
import * as request from 'request';
import {resolve} from 'url';

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
    setTimeout(() => request(resolve(browser.baseUrl, 'api/test/emails?email=' + email), {json: true}, (err, resp, body) => {
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

}
