import {browser, by, ElementFinder, ProtractorBrowser} from 'protractor';

const EC = browser.ExpectedConditions;

export abstract class GenericPage {
  constructor(protected browser: ProtractorBrowser) {
  }

  getLogoutButton() {
    return this.browser.element(by.id('logoutButton'));
  }

  getLoginButton() {
    return this.browser.element(by.id('loginButton'));
  }

  getPostsButton() {
    return this.browser.element(by.css('b-header header a[label="Posts"]'));
  }

  getBoardsButton() {
    return this.browser.element(by.css('b-header header a[label="Boards"]'));
  }

  getDepartmentsButton() {
    return this.browser.element(by.css('b-header header a[label="Departments"]'));
  }

  getDialog() {
    return this.browser.element(by.tagName('mat-dialog-container'));
  }

  getDoNotShowAgainButton() {
    return this.browser.element(by.css('button[label="Do not show it again"]'));
  }

  getDoItAgainButton() {
    return this.browser.element(by.css('button[label="I\'ll do it later"]'));
  }

  getSubmitButton() {
    return this.browser.element(by.css('button[label="Submit"]'));
  }

  getButtonByLabel(label: string) {
    return this.browser.element(by.css('button[label="' + label + '"]'));
  }

  getCheckboxLabel(text: String) {
    return this.browser.element.all(by.css('p-checkbox label'))
      .filter(label => {
        return label.getText().then(t => t === text);
      }).first();
  }

  getRadioButton(radioName: string, text: string) {
    return this.browser.element.all(by.css('p-radiobutton[name="' + radioName + '"] label'))
      .filter(label => {
        return label.getText().then(t => t === text);
      }).first();
  }

  selectDropdownOption(dropdownPlaceholder: string, optionLabel: string) {
    const dropdown = this.browser.element(by.css('p-dropdown[placeholder="' + dropdownPlaceholder + '"]'));
    dropdown.click();
    dropdown.all(by.css('li span'))
      .filter(span => span.getText().then(text => text === optionLabel))
      .first().click();
  }

  getAccountButton() {
    return this.browser.element(by.css('b-header a.btn-user'));
  }

  getActivitiesButton() {
    return this.browser.element(by.css('b-header div.activity a'));
  }

  openActivitiesPanel(expectedCount?: number, expectedNewCount?: number) {
    browser.wait(EC.presenceOf(this.getActivitiesButton()));
    if (expectedNewCount) {
      expect(this.getActivitiesCountBadge().getText()).toEqual('' + expectedNewCount);
    } else {
      expect(this.getActivitiesCountBadge().isPresent()).toBeFalsy();
    }
    this.getActivitiesButton().click();
    expect(this.getActivityItems().count()).toEqual(expectedCount);
    browser.sleep(1000); // following clicks need this sleep for some reason
  }

  getActivitiesCountBadge() {
    return this.browser.element(by.css('b-header div.activity span.activity-badge'));
  }

  getActivityItems() {
    return this.browser.element.all(by.css('p-overlaypanel#activitiesPanel > div'));
  }

  getActivityButton(activityItem: ElementFinder) {
    return activityItem.element(by.css('div.activity-inner > a'));
  }

  getActivityCloseButton(activityItem: ElementFinder) {
    return activityItem.element(by.css('button[icon="fa-close"]'));
  }

  selectLocation(keyword: string) {
    const autocomplete = this.browser.element(by.css('b-places-autocomplete'));
    const input = autocomplete.element(by.tagName('input'));
    input.clear();
    input.sendKeys(keyword);
    browser.wait(EC.presenceOf(autocomplete.element(by.tagName('ul'))));
    autocomplete.all(by.tagName('li')).first().click();
    browser.wait(EC.presenceOf(this.browser.element(by.css('b-places-autocomplete.ng-valid'))));
  }

  clickOverlay() {
    this.browser.element(by.css('div.cdk-overlay-backdrop')).click();
  }

}

export class HomePage extends GenericPage {
  navigateTo() {
    return this.browser.get('/');
  }

  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return this.browser.element(by.id('university'));
  }

  getUniversityAutocompleteItemsList() {
    return this.browser.element.all(by.css('.ui-autocomplete-list-item'));
  }

  getDepartmentNameInput() {
    return this.browser.element(by.id('departmentName'));
  }
}

export class AuthenticationDialog extends GenericPage {
  getParagraph() {
    return this.browser.element(by.tagName('mat-dialog-container h2'));
  }

  getGivenNameInput() {
    return this.browser.element(by.css('input[name="givenName"]'));
  }

  getSurnameInput() {
    return this.browser.element(by.css('input[name="surname"]'));
  }

  getEmailInput() {
    return this.browser.element(by.css('input[name="email"]'));
  }

  getPasswordInput() {
    return this.browser.element(by.css('input[name="password"]'));
  }

  getRepeatPasswordInput() {
    return this.browser.element(by.css('input[name="repeatPassword"]'));
  }

  getSubmitButton() {
    return this.browser.element(by.css('mat-dialog-container button[label="Submit"]'));
  }

  performRegistration(email: string, givenName: string, surname: string, password: string) {
    this.browser.wait(EC.presenceOf(this.getGivenNameInput())).then(() => {
      console.log('Registering as ' + email + ' (' + givenName + ' ' + surname + ')');
    });

    expect(this.getParagraph().getText()).toEqual('Register');
    if (givenName) {
      this.sendKeysWithRetry(this.getGivenNameInput(), givenName);
    }
    if (surname) {
      this.sendKeysWithRetry(this.getSurnameInput(), surname);
    }
    if (email) {
      this.sendKeysWithRetry(this.getEmailInput(), email);
    }
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  performLogin(email: string, password: string) {
    const dialogHeaderElement = this.getParagraph();
    this.browser.wait(EC.textToBePresentInElement(dialogHeaderElement, 'Login')).then(() => {
      console.log('Logging in as ' + email);
    });
    expect(this.getParagraph().getText()).toEqual('Login');
    if (email) {
      this.sendKeysWithRetry(this.getEmailInput(), email);
    }
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  performForgotPassword(email: string) {
    expect(this.getParagraph().getText()).toEqual('Forgot Password?');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.getButtonByLabel('Reset Password').click();
    expect(this.browser.element(by.css('mat-dialog-container span.ui-messages-summary')).getText()).toEqual('Email sent');
  }

  performResetPassword(password: string) {
    this.browser.wait(EC.presenceOf(this.browser.element(by.tagName('mat-dialog-container'))));
    expect(this.getParagraph().getText()).toEqual('Reset Password');
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.sendKeysWithRetry(this.getRepeatPasswordInput(), password);
    this.getSubmitButton().click();
  }

  getAlreadyRegisteredButton() {
    return this.browser.element(by.css('button[label="Already Registered?"]'));
  }

  getForgotPasswordButton() {
    return this.browser.element(by.css('button[label="Forgot password?"]'));
  }

  private sendKeysWithRetry(input: ElementFinder, value: string) {
    input.click();
    input.clear();
    input.sendKeys(value);
    input.getAttribute('value').then(existingValue => {
      if (existingValue !== value) {
        this.sendKeysWithRetry(input, value);
      }
    })
  }
}

export class AccountPage extends GenericPage {

  getNotificationsButton(boardName: string) {
    this.browser.wait(EC.presenceOf(this.browser.element(by.css('li.board-subscription-item'))));
    return this.browser.element.all(by.css('li.board-subscription-item'))
      .filter(li => {
        return li.element(by.css('h3 a')).getText().then(text => {
          return text === boardName;
        });
      })
      .first()
      .element(by.css('p-togglebutton'));

  }

}