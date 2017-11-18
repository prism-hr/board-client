import {browser, protractor} from 'protractor';
import {resolve} from 'url';
import {AuthenticationDialog, DepartmentViewPage, GenericPage, HomePage, NewDepartmentPage, ResourceUsersPage} from './app.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('board-frontend App', () => {
  const randomString = browser.params.randomString;
  let homePage: HomePage;
  let newDepartmentPage: NewDepartmentPage;
  let authenticationDialog: AuthenticationDialog;
  let departmentViewPage: DepartmentViewPage;
  let resourceUsersPage: ResourceUsersPage;
  let genericPage: GenericPage;

  beforeAll(() => {
    browser.waitForAngularEnabled(false);
  });

  beforeEach(() => {
    homePage = new HomePage();
    newDepartmentPage = new NewDepartmentPage();
    authenticationDialog = new AuthenticationDialog();
    departmentViewPage = new DepartmentViewPage();
    resourceUsersPage = new ResourceUsersPage();
    genericPage = new GenericPage();
  });

  it('should create new department', () => {
    homePage.navigateTo();
    homePage.getUniversityInput().sendKeys('Bisho');
    browser.wait(EC.presenceOf(homePage.getUniversityAutocompleteItems()));
    expect(homePage.getUniversityAutocompleteItemsList().count()).toEqual(2);
    homePage.getUniversityAutocompleteItemsList().get(0).click();
    expect(homePage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');

    homePage.getDepartmentNameInput().sendKeys('Bishop department' + randomString);
    homePage.getDepartmentNameInput().sendKeys(protractor.Key.ENTER);

    browser.wait(EC.urlContains('newDepartment'));
    expect(browser.getCurrentUrl()).toEqual(resolve(browser.baseUrl, 'newDepartment?prepopulate=true'));

    expect(newDepartmentPage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');
    expect(newDepartmentPage.getNameInput().getAttribute('value')).toEqual('Bishop department' + randomString);
    newDepartmentPage.getSummaryTextarea().sendKeys('Bishop summary');
    newDepartmentPage.getNameInput().sendKeys(protractor.Key.ENTER);

    authenticationDialog.performRegistration(
      'admin_' + randomString + '@test.prism.hr', 'Admin','Bishop','1secret1');

    browser.wait(EC.urlContains('bishop-burton-college'));
    expect(browser.getCurrentUrl()).toEqual(resolve(browser.baseUrl, 'bishop-burton-college/bishop-department' + randomString));
  });

  it('should add new administrator to a department', () => {
    departmentViewPage.getTabItem(3).click();
    browser.wait(EC.urlContains('users'));

    expect(browser.getCurrentUrl()).toEqual(resolve(browser.baseUrl, 'bishop-burton-college/bishop-department' + randomString + '/users'));

    resourceUsersPage.getCannotFindUserButton().click();
    resourceUsersPage.getGivenNameInput().sendKeys('New');
    resourceUsersPage.getSurnameInput().sendKeys('Admin');
    resourceUsersPage.getEmailInput().sendKeys('new_admin_' + randomString + '@test.prism.hr');
    resourceUsersPage.getRoleRadioButton('administrator').click();

    resourceUsersPage.getAddUserButton().click();

    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails('new_admin_' + randomString + '@test.prism.hr', defer);

      return defer.promise;
    }).then(function (data: any[]) {
      if (data.length !== 1) {
        fail('Expected only one email');
      }
      const message = data[0];
      const urls: string[] = message.content.match(/\bhttps?:\/\/\S+/gi);
      if (urls.length !== 1) {
        fail('Expected only one url');
      }

      browser.get(urls[0]);
      browser.wait(EC.textToBePresentInElement(authenticationDialog.getParagraphText(), 'Register'));

      authenticationDialog.performRegistration(
        'admin2' + randomString + '@test.prism.hr', 'Admin2','Bishop','1secret1');

      browser.wait(EC.presenceOf(genericPage.getLogoutButton()));
      genericPage.getLogoutButton().click();
    });

  });
});

