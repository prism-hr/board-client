import {browser, protractor} from 'protractor';
import {AuthenticationDialog, HomePage,} from './app.po';
import {DepartmentEditPage, DepartmentNewPage, DepartmentsPage, DepartmentViewPage, ResourceUsersPage} from './resource.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('board-frontend App', () => {
  const randomString = browser.params.randomString;
  let homePage: HomePage;
  let departmentNewPage: DepartmentNewPage;
  let authenticationDialog: AuthenticationDialog;
  let departmentViewPage: DepartmentViewPage;
  let resourceUsersPage: ResourceUsersPage;
  let departmentsPage: DepartmentsPage;
  let departmentEditPage: DepartmentEditPage;

  beforeAll(() => {
    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.removeTestData(defer);

      return defer.promise;
    })
  });

  beforeEach(() => {
    homePage = new HomePage(browser);
    departmentNewPage = new DepartmentNewPage(browser);
    authenticationDialog = new AuthenticationDialog(browser);
    departmentViewPage = new DepartmentViewPage(browser);
    resourceUsersPage = new ResourceUsersPage(browser);
    departmentsPage = new DepartmentsPage(browser);
    departmentEditPage = new DepartmentEditPage(browser);
  });

  it('should create new department', () => {
    homePage.navigateTo();
    expect(homePage.getParagraphText()).toEqual('Create a new Department');
    homePage.getUniversityInput().sendKeys('Bisho');
    expect(homePage.getUniversityAutocompleteItemsList().count()).toEqual(2);
    homePage.getUniversityAutocompleteItemsList().get(0).click();
    browser.wait(EC.textToBePresentInElementValue(homePage.getUniversityInput(), 'Bishop Burton College'));
    expect(homePage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');

    homePage.getDepartmentNameInput().sendKeys('Bishop department');
    homePage.getDepartmentNameInput().sendKeys(protractor.Key.ENTER);

    TestUtils.assertCurrentUrlEquals('newDepartment?prepopulate=true');
    expect(departmentNewPage.getParagraphText()).toEqual('Create a new Department');

    expect(departmentNewPage.getUniversityInput().getAttribute('value')).toEqual('Bishop Burton College');
    expect(departmentNewPage.getNameInput().getAttribute('value')).toEqual('Bishop department');
    departmentNewPage.getSummaryTextarea().sendKeys('Bishop summary');
    departmentNewPage.getNameInput().sendKeys(protractor.Key.ENTER);

    authenticationDialog.performRegistration(
      'admin@test.prism.hr', 'Admin', 'Bishop', '1secret1');

    browser.wait(EC.urlContains('bishop-burton-college'));

    TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department');
    departmentViewPage.assertDepartmentView('Bishop department', 'Bishop summary',
      ['Undergraduate Student', 'Master Student', 'Research Student', 'Research Staff']);
    departmentViewPage.assertTabItems('View', 'Edit', 'Users', 'Badge');
  });

  it('should add new administrator to a department', () => {
    departmentViewPage.getTabItem('Users').click();
    browser.wait(EC.urlContains('users'));

    TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department/users');

    resourceUsersPage.getCannotFindUserButton().click();
    resourceUsersPage.getGivenNameInput().sendKeys('New');
    resourceUsersPage.getSurnameInput().sendKeys('Admin');
    resourceUsersPage.getEmailInput().sendKeys('new-admin@test.prism.hr');
    resourceUsersPage.getRoleRadioButton('administrator').click();

    resourceUsersPage.getAddUserButton().click();

    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails('new-admin@test.prism.hr', defer);

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

      authenticationDialog.performRegistration(
        'admin2@test.prism.hr', 'Admin2', 'Bishop', '1secret1');
      browser.wait(EC.presenceOf(departmentViewPage.getActiveTabItem()));
      departmentViewPage.assertDepartmentView('Bishop department', 'Bishop summary',
        ['Undergraduate Student', 'Master Student', 'Research Student', 'Research Staff']);
      departmentViewPage.assertTabItems('View', 'Edit', 'Users', 'Badge');
      TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop-department');

      departmentViewPage.openActivitiesPanel(1);
      departmentViewPage.getActivityCloseButton(departmentViewPage.getActivityItems().first()).click();
      expect(departmentViewPage.getActivitiesCountBadge().isPresent()).toBeFalsy();

      departmentViewPage.getLogoutButton().click();
    });
  });

  it('should edit a department', () => {
    departmentViewPage.navigateTo('bishop-burton-college/bishop-department');
    departmentViewPage.getLoginButton().click();
    authenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');
    browser.wait(EC.presenceOf(departmentsPage.getDoItAgainButton()));
    departmentsPage.getDoItAgainButton().click();

    browser.wait(EC.presenceOf(departmentsPage.getDepartmentsButton()));
    departmentsPage.getDepartmentsButton().click();
    departmentsPage.waitForLoaded();
    departmentsPage.getDepartmentTitleUrl('bishop-burton-college_bishop-department').click();

    departmentViewPage.getTabItem('Edit').click();

    departmentEditPage.getNameInput().clear();
    departmentEditPage.getNameInput().sendKeys('Bishop2 dep');
    departmentEditPage.getSummaryTextarea().clear();
    departmentEditPage.getSummaryTextarea().sendKeys('Bishop2 summary');
    departmentEditPage.getCheckboxLabel('Undergraduate Student').click();
    departmentEditPage.getCheckboxLabel('Research Staff').click();
    departmentEditPage.getHandleInput().clear();
    departmentEditPage.getHandleInput().sendKeys('bishop2');
    departmentEditPage.getHandleInput().sendKeys(protractor.Key.ENTER);

    browser.wait(EC.not(EC.urlContains('/edit')));
    TestUtils.assertCurrentUrlEquals('bishop-burton-college/bishop2');

    departmentViewPage.assertDepartmentView('Bishop2 dep', 'Bishop2 summary',
      ['Master Student', 'Research Student']);

    departmentViewPage.getLogoutButton().click();
  });
});

