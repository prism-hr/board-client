import {browser, by} from 'protractor';
import {GenericPage} from './app.po';

const EC = browser.ExpectedConditions;

export class DepartmentNewPage extends GenericPage {
  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getUniversityInput() {
    return this.browser.element(by.id('university'));
  }

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }
}

export class PostNewPage extends GenericPage {
  getParagraphText() {
    return this.browser.element(by.tagName('h2')).getText();
  }

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }

  getDescriptionEditor() {
    return this.browser.element(by.css('div.ui-editor-content div.ql-editor'));
  }

  getCheckboxLabel(label: String) {
    return this.browser.element(by.css('p-checkbox[ng-reflect-label="' + label + '"] div.ui-chkbox-box'));
  }

  getOrganizationNameInput() {
    return this.browser.element(by.id('organizationName'));
  }

  getLocationInput() {
    return this.browser.element(by.css('input[placeholder="e.g. London"]'));
  }

  getLocationAutocomplete(klass?: string) {
    return this.browser.element(by.css('b-places-autocomplete' + (klass ? '.' + klass : '')));
  }

  getLocationAutocompleteItemsList() {
    return this.browser.element.all(by.css('li.ui-autocomplete-list-item'));
  }

  getRadioButton(roleName) {
    return this.browser.element(by.css('p-radiobutton[ng-reflect-label="' + roleName + '"] label'));
  }

  getApplyWebsiteInput() {
    return this.browser.element(by.id('applyWebsite'));
  }

  getApplyEmailInput() {
    return this.browser.element(by.id('applyEmail'));
  }

  getExplanationTextarea() {
    return this.browser.element(by.id('existingRelationExplanation'));
  }

}

export abstract class GenericResourcePage extends GenericPage {
  getActiveTabItem() {
    return this.browser.element(by.css('p-tabMenu li.ui-state-active a span'));
  }

  getTabItem(label: string) {
    return this.browser.element.all(by.css('p-tabMenu li a'))
      .filter(finder => {
        return finder.element(by.css('span')).getText().then(text => {
          return text === label;
        });
      }).first();
  }

  assertTabItems(...items: string[]) {
    expect(this.browser.element.all(by.css('p-tabMenu li a span')).getText()).toEqual(items);
  }

  getActionButtonLabels() {
    return this.browser.element.all(by.css('b-resource-actions-box button span')).map(b => b.getText());
  }

  getActionButton(label: string) {
    return this.browser.element(by.css('b-resource-actions-box button[ng-reflect-label="' + label + '"]'));
  }
}

export class DepartmentEditPage extends GenericResourcePage {

  getNameInput() {
    return this.browser.element(by.id('name'));
  }

  getSummaryTextarea() {
    return this.browser.element(by.id('summary'));
  }

  getCheckboxLabel(label: String) {
    return this.browser.element(by.css('p-checkbox[ng-reflect-label="' + label + '"] label'));
  }

  getHandleInput() {
    return this.browser.element(by.id('resourceHandle'));
  }
}

export class PostEditPage extends GenericResourcePage {
  getActionButtonLabels() {
    return this.browser.element.all(by.css('mat-card-actions button span')).map(b => b.getText());
  }

  getActionButton(label: string) {
    return this.browser.element(by.css('mat-card-actions button[label="' + label + '"]'));
  }
}

export class DepartmentViewPage extends GenericResourcePage {

  navigateTo(handle: string) {
    return browser.get('/' + handle);
  }

  assertDepartmentView(name: string, summary: string, categories: string[]) {
    expect(this.browser.element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    expect(this.browser.element(by.tagName('h1')).getText()).toEqual(name);
    expect(this.browser.element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(this.browser.element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

}

export class BoardViewPage extends GenericResourcePage {
  assertBoardView(name: string, summary: string, categories: string[], canEdit: boolean) {
    if (canEdit) {
      expect(this.browser.element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    }
    expect(this.browser.element(by.tagName('h1')).getText()).toEqual(name);
    expect(this.browser.element(by.css('div.summary-holder')).getText()).toEqual(summary);
    expect(this.browser.element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

  getNewPostButton() {
    return this.browser.element(by.css('a[label="New Post"] span.ui-button-text.ui-clickable'));
  }
}

export class PostViewPage extends GenericResourcePage {
  waitForLoaded() {
    browser.wait(EC.presenceOf(this.browser.element(by.css('div.post-content'))));
  }

  assertPostView(name: string, summary: string, description: string, categories: string[], canEdit: boolean) {
    if (canEdit) {
      expect(this.browser.element(by.css('p-tabMenu li.ui-state-active a span')).getText()).toEqual('View');
    }
    expect(this.browser.element(by.tagName('h1')).getText()).toEqual(name);
    expect(this.browser.element(by.css('div.post-content--excerpt')).getText()).toEqual(summary);
    expect(this.browser.element(by.css('div.post-content--description p')).getText()).toEqual(description);
    expect(this.browser.element.all(by.css('div.category-list span.ui-chips-token')).getText()).toEqual(categories);
  }

}

export class DepartmentsPage extends GenericPage {
  waitForLoaded() {
    this.browser.wait(EC.presenceOf(browser.element(by.tagName('mat-card'))));
  }

  getDepartmentCard(handle: string) {
    return this.browser.element(by.css('mat-card#department_' + handle));
  }

  getDepartmentTitleUrl(handle: string) {
    return this.getDepartmentCard(handle).element(by.css('mat-card-header a'));
  }
}

export class PostsPage extends GenericPage {
  waitForLoaded() {
    this.browser.wait(EC.presenceOf(browser.element(by.tagName('mat-card'))));
  }

  getPostCard(name: string) {
    return this.browser.element.all(by.tagName('mat-card'))
      .filter(card => {
        return card.element(by.css('mat-card-header mat-card-title h3 a')).getText()
          .then(title => title === name);
      }).first();
  }

  getPostTitleUrl(name: string) {
    return this.getPostCard(name).element(by.css('mat-card-header a'));
  }
}

export class ResourceUsersPage extends GenericResourcePage {
  getCannotFindUserButton() {
    return this.browser.element(by.css('button[label="Cannot find user?"]'));
  }

  getGivenNameInput() {
    return this.browser.element(by.id('givenName'));
  }

  getSurnameInput() {
    return this.browser.element(by.id('surname'));
  }

  getEmailInput() {
    return this.browser.element(by.id('email'));
  }

  getRoleRadioButton(roleName) {
    return this.browser.element(by.css('p-radiobutton[name="role"].' + roleName + ' label'));
  }

  getAddUserButton() {
    return this.browser.element(by.css('button[label="Add user"]'));
  }
}
