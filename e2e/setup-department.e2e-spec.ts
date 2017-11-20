import {browser, protractor} from 'protractor';
import {
  AuthenticationDialog, DepartmentsPage,
  DepartmentViewPage,
  GenericPage,
  GenericResourcePage,
  HomePage,
  NewDepartmentPage,
  ResourceUsersPage
} from './app.po';
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
  let genericResourcePage: GenericResourcePage;
  let departmentsPage: DepartmentsPage;

  beforeAll(() => {
  });

  beforeEach(() => {
    homePage = new HomePage();
    newDepartmentPage = new NewDepartmentPage();
    authenticationDialog = new AuthenticationDialog();
    departmentViewPage = new DepartmentViewPage();
    resourceUsersPage = new ResourceUsersPage();
    genericPage = new GenericPage();
    genericResourcePage = new GenericResourcePage();
    departmentsPage = new DepartmentsPage();
  });

  it('should create new department', () => {
    console.log('Random string: ' + randomString);
    homePage.navigateTo();
    expect(homePage.getParagraphText()).toEqual('Create a new Department');
    homePage.getUniversityInput().sendKeys('Bisho');
    expect(homePage.getUniversityAutocompleteItemsList().count()).toEqual(2);
    homePage.getUniversityAutocompleteItemsList().get(0).click();
    browser.wait(EC.textToBePresentInElementValue(homePage.getUniversityInput(), 'Bishop Burton College'));
    expect(homePage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');

    homePage.getDepartmentNameInput().sendKeys('Bishop department' + randomString);
    homePage.getDepartmentNameInput().sendKeys(protractor.Key.ENTER);

    TestUtils.assertCurrentUrlEquals('newDepartment?prepopulate=true');
    expect(newDepartmentPage.getParagraphText()).toEqual('Create a new Department');

    expect(newDepartmentPage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');
    expect(newDepartmentPage.getNameInput().getAttribute('value')).toEqual('Bishop department' + randomString);
    newDepartmentPage.getSummaryTextarea().sendKeys('Bishop summary');
    newDepartmentPage.getNameInput().sendKeys(protractor.Key.ENTER);

    authenticationDialog.performRegistration(
      'admin_' + randomString + '@test.prism.hr', 'Admin', 'Bishop', '1secret1');

    browser.wait(EC.urlContains('bishop-burton-college'));

    TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department' + randomString);
    departmentViewPage.assertDepartmentView('Bishop department' + randomString, 'Bishop summary',
      ['Undergraduate Student', 'Master Student', 'Research Student', 'Research Staff']);
    genericResourcePage.assertTabItems('View', 'Edit', 'Users', 'Badge');
  });

  it('should add new administrator to a department', () => {
    console.log('Random string: ' + randomString);
    genericResourcePage.getNthTabItem(3).click();
    browser.wait(EC.urlContains('users'));

    TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department' + randomString + '/users');

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

      console.log('Registering as user: ' + 'admin2' + randomString + '@test.prism.hr');
      authenticationDialog.performRegistration(
        'admin2' + randomString + '@test.prism.hr', 'Admin2', 'Bishop', '1secret1');
      browser.wait(EC.presenceOf(genericResourcePage.getActiveTabItem()));
      departmentViewPage.assertDepartmentView('Bishop department' + randomString, 'Bishop summary',
        ['Undergraduate Student', 'Master Student', 'Research Student', 'Research Staff']);
      genericResourcePage.assertTabItems('View', 'Edit', 'Users', 'Badge');

      // FIXME remove modal and uuid from URL
      // TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department' + randomString);

      genericPage.getLogoutButton().click();
    });

  });

  it('should edit a department', () => {
    departmentViewPage.navigateTo('bishop-burton-college/bishop-department' + randomString);
    genericPage.getLoginButton().click();

    console.log('Logging in as user: ' + 'admin2' + randomString + '@test.prism.hr');
    authenticationDialog.performLogin('admin2' + randomString + '@test.prism.hr', '1secret1');

    browser.wait(EC.presenceOf(genericPage.getDoItAgainButton()));
    genericPage.getDoItAgainButton().click();

    browser.wait(EC.presenceOf(genericPage.getDepartmentsButton()));
    genericPage.getDepartmentsButton().click();

    departmentsPage.getDepartmentTitleUrl('bishop-burton-college_bishop-department' + randomString).click();

    genericResourcePage.getNthTabItem(2).click();

  });
});

