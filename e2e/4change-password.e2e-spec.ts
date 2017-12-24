import {browser, protractor} from 'protractor';
import {AuthenticationDialog, HomePage} from './app.po';
import {
  BoardViewPage, DepartmentEditPage, DepartmentsPage, PostEditPage, PostNewEditPage, PostsPage, PostViewPage,
  ResourceUsersPage
} from './resource.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('Change password', () => {
  let homePage: HomePage;
  let departmentsPage: DepartmentsPage;
  let postsPage: PostsPage;
  let postViewPage: PostViewPage;
  let postNewEditPage: PostNewEditPage;
  let postEditPage: PostEditPage;
  let boardViewPage: BoardViewPage;
  let departmentEditPage: DepartmentEditPage;
  let resourceUsersPage: ResourceUsersPage;
  let authenticationDialog: AuthenticationDialog;

  beforeAll(() => {
  });

  beforeEach(() => {
    homePage = new HomePage(browser);
    departmentsPage = new DepartmentsPage(browser);
    postsPage = new PostsPage(browser);
    postViewPage = new PostViewPage(browser);
    postNewEditPage = new PostNewEditPage(browser);
    postEditPage = new PostEditPage(browser);
    boardViewPage = new BoardViewPage(browser);
    departmentEditPage = new DepartmentEditPage(browser);
    resourceUsersPage = new ResourceUsersPage(browser);
    authenticationDialog = new AuthenticationDialog(browser);
  });

  it('Should change user password', () => {
    homePage.navigateTo();
    browser.wait(EC.presenceOf(homePage.getLoginButton()));
    homePage.getLoginButton().click();

    authenticationDialog.getForgotPasswordButton().click();
    authenticationDialog.performForgotPassword('independent-student4@test.prism.hr');

    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails('independent-student4@test.prism.hr', defer);

      return defer.promise;
    }).then(function (data: any[]) {
      const message = data[0];
      const urls: string[] = message.content.match(/\bhttps?:\/\/\S+/gi);
      if (urls.length !== 1) {
        fail('Expected only one url');
      }

      browser.get(urls[0]);

      authenticationDialog.performResetPassword('2secret2');
      authenticationDialog.performLogin('independent-student4@test.prism.hr', '2secret2');
    });
  });
});

