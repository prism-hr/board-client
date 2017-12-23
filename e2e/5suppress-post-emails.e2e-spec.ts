import {browser, by, protractor} from 'protractor';
import {AccountPage, AuthenticationDialog, HomePage} from './app.po';
import {
  BoardViewPage, DepartmentEditPage, DepartmentsPage, PostEditPage, PostNewEditPage, PostsPage, PostViewPage,
  ResourceUsersPage
} from './resource.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('Suppress post emails', () => {
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

  it('apply to a post as a member', () => {
    const studentEmail = 'student2@test.prism.hr';
    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails(studentEmail, defer);

      return defer.promise;
    }).then(function (data: any[]) {
      const message = data[0];
      const urls: string[] = message.content.match(/\bhttps?:\/\/\S+/gi);
      if (urls.length !== 2) {
        fail('Expected exactly two urls');
      }

      browser.get(urls[1]);
      browser.wait(EC.presenceOf(browser.element(by.tagName('mat-dialog-container'))));
      homePage.getButtonByLabel('Yes').click();
      browser.wait(EC.not(EC.presenceOf(browser.element(by.tagName('mat-dialog-container')))));

      browser.get(urls[0]);
      authenticationDialog.performRegistration(studentEmail, 'Student2', 'Bishop', '1secret1');
      browser.wait(EC.presenceOf(postViewPage.getAccountButton()));
      postViewPage.getAccountButton().click();

      expect(accountPage.getNotificationsButton('Career Opportunities').element(by.css('span')).getText())
        .toEqual('Off');
      expect(accountPage.getNotificationsButton('Research Opportunities').element(by.css('span')).getText())
        .toEqual('On');
    });
  });
});

