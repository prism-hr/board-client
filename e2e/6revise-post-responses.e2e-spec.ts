import {browser, by, protractor} from 'protractor';
import {AccountPage, AuthenticationDialog, HomePage} from './app.po';
import {
  BoardViewPage, DepartmentEditPage, DepartmentsPage, PostEditPage, PostNewEditPage, PostsPage, PostViewPage,
  ResourceUsersPage
} from './resource.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('Revise post responses', () => {
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
  let accountPage: AccountPage;

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
    accountPage = new AccountPage(browser);
  });

  it('should revise post responses', () => {
    const studentEmail = 'admin2@test.prism.hr';
    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails(studentEmail, defer, 2);

      return defer.promise;
    }).then(function (data: any[]) {
      const message = data[0];
      const urls: string[] = message.content.match(/\bhttps?:\/\/\S+/gi);
      if (urls.length !== 1) {
        fail('Expected exactly one url');
      }

      browser.get(urls[0]);

      authenticationDialog.performLogin(null, '1secret1');

      browser.wait(EC.presenceOf(resourceUsersPage.getActiveTabItem()));
      resourceUsersPage.clickOverlay();
      const acceptButton = resourceUsersPage.getButtonByLabel('Accept');
      browser.wait(EC.presenceOf(acceptButton));
      acceptButton.click();
      browser.wait(EC.not(EC.presenceOf(acceptButton)));
    });
  });
});

