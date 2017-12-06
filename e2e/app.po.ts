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

  openActivitiesPanel(expectedCount: number) {
    browser.wait(EC.presenceOf(this.getActivitiesButton()));
    if (expectedCount) {
      expect(this.getActivitiesCountBadge().getText()).toEqual('' + expectedCount);
    } else {
      expect(this.getActivitiesCountBadge().isPresent()).toBeFalsy();
    }
    this.getActivitiesButton().click();
    expect(this.getActivityItems().count()).toEqual(expectedCount);
  }

  getActivitiesButton() {
    return this.browser.element(by.css('b-header div.activity a'));
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
  }
}

export class HomePage extends GenericPage {
  navigateTo() {
    return browser.get('/');
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


export class AuthenticationDialog {
  constructor(private browser: ProtractorBrowser) {
  }

  getParagraphText() {
    return this.browser.element(by.tagName('mat-dialog-container h2')).getText();
  }

  getGivenNameInput() {
    return this.browser.element(by.css('input[placeholder="First Name"'));
  }

  getSurnameInput() {
    return this.browser.element(by.css('input[placeholder="Last Name"'));
  }

  getEmailInput() {
    return this.browser.element(by.css('input[placeholder="Email"'));
  }

  getPasswordInput() {
    return this.browser.element(by.css('input[placeholder="Password"'));
  }

  getSubmitButton() {
    return this.browser.element(by.css('mat-dialog-container button[label="Submit"]'));
  }

  performRegistration(email: string, givenName: string, surname: string, password: string) {
    this.browser.wait(EC.presenceOf(this.browser.element(by.tagName('mat-dialog-container'))))
    expect(this.getParagraphText()).toEqual('Register');
    this.sendKeysWithRetry(this.getGivenNameInput(), givenName);
    this.sendKeysWithRetry(this.getSurnameInput(), surname);
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  performLogin(email: string, password: string) {
    this.browser.wait(EC.presenceOf(this.browser.element(by.tagName('mat-dialog-container'))))
    expect(this.getParagraphText()).toEqual('Login');
    this.sendKeysWithRetry(this.getEmailInput(), email);
    this.sendKeysWithRetry(this.getPasswordInput(), password);
    this.getSubmitButton().click();
  }

  getAlreadyRegisteredButton() {
    return this.browser.element(by.css('button[label="Already Registered?"'));
  }

  private sendKeysWithRetry(input: ElementFinder, value: string) {
    input.clear();
    input.sendKeys(value);
    input.getAttribute('value').then(existingValue => {
      if (existingValue !== value) {
        this.sendKeysWithRetry(input, value);
      }
    })
  }

}

