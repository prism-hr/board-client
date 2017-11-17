import {browser, protractor} from 'protractor';
import {resolve} from 'url';
import {AuthenticationDialog, DepartmentViewPage, HomePage, NewDepartmentPage, ResourceUsersPage} from './app.po';
import {TestUtils} from './test.utils';

var EC = browser.ExpectedConditions;

describe('board-frontend App', () => {
  let homePage: HomePage;
  let newDepartmentPage: NewDepartmentPage;
  let authenticationDialog: AuthenticationDialog;
  let departmentViewPage: DepartmentViewPage;
  let resourceUsersPage: ResourceUsersPage;

  beforeEach(() => {
    homePage = new HomePage();
    newDepartmentPage = new NewDepartmentPage();
    authenticationDialog = new AuthenticationDialog();
    departmentViewPage = new DepartmentViewPage();
    resourceUsersPage = new ResourceUsersPage();
  });

  // it('should see homepage', () => {
  //   homePage.navigateTo();
  //   expect(homePage.getParagraphText()).toContain('Create a new Department');
  //   expect(homePage.getUniversityInput()).toBeDefined();
  //   expect(homePage.getDepartmentNameInput()).toBeDefined();
  // });

  it('should create new department', () => {
    const randomString = TestUtils.randomString(4);
    homePage.navigateTo();
    homePage.getUniversityInput().sendKeys('Bisho');
    expect(homePage.getUniversityAutocompleteItems().count()).toEqual(2);
    homePage.getUniversityAutocompleteItems().get(0).click();
    expect(homePage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');

    homePage.getDepartmentNameInput().sendKeys('Bishop department' + randomString);
    homePage.getDepartmentNameInput().sendKeys(protractor.Key.ENTER);

    expect(browser.getCurrentUrl()).toEqual(resolve(browser.baseUrl, 'newDepartment?prepopulate=true'));

    expect(newDepartmentPage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');
    expect(newDepartmentPage.getNameInput().getAttribute('value')).toEqual('Bishop department' + randomString);
    newDepartmentPage.getSummaryTextarea().sendKeys('Bishop summary');
    newDepartmentPage.getNameInput().sendKeys(protractor.Key.ENTER);

    authenticationDialog.getEmailInput().sendKeys('admin_' + randomString + '@test.prism.hr');
    authenticationDialog.getGivenNameInput().sendKeys('Admin');
    authenticationDialog.getSurnameInput().sendKeys('Bishop');
    authenticationDialog.getPasswordInput().sendKeys('password1');
    authenticationDialog.getPasswordInput().sendKeys(protractor.Key.ENTER);

    browser.waitForAngularEnabled(false);
    browser.wait(EC.urlContains('bishop-burton-college'));

    expect(browser.getCurrentUrl()).toEqual(resolve(browser.baseUrl, 'bishop-burton-college/bishop-department' + randomString));

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

      authenticationDialog.getEmailInput().sendKeys('m_new_admin_' + randomString + '@test.prism.hr');
      authenticationDialog.getGivenNameInput().sendKeys('m_new');
      authenticationDialog.getSurnameInput().sendKeys('m_admin');
      authenticationDialog.getPasswordInput().sendKeys('password1');
      authenticationDialog.getPasswordInput().sendKeys(protractor.Key.ENTER);
    });

  });
});

