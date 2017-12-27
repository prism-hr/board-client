import {browser, protractor} from 'protractor';
import {AuthenticationDialog, HomePage} from './app.po';
import {
  BoardViewPage, DepartmentEditPage, DepartmentsPage, PostEditPage, PostNewEditPage, PostsPage, PostViewPage,
  ResourceUsersPage
} from './resource.po';
import {TestUtils} from './test.utils';

const EC = browser.ExpectedConditions;

describe('Apply to post', () => {
  const randomString = browser.params.randomString;
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

  it('apply to a post as a member', () => {
    const flow = protractor.promise.controlFlow();
    flow.execute(function () {
      const defer = protractor.promise.defer();
      TestUtils.getTestEmails('student1@test.prism.hr', defer);

      return defer.promise;
    }).then(function (data: any[]) {
      const message = data[0];
      const urls: string[] = message.content.match(/\bhttps?:\/\/\S+/gi);
      if (urls.length !== 2) {
        fail('Expected exactly two urls');
      }

      browser.get(urls[0]);

      authenticationDialog.performRegistration(null, 'Student1', 'Bishop', '1secret1');

      postViewPage.assertPostView('Bishop2 Post',
        'Bishop2 summary', 'Bishop2 description', ['Employment', 'Internship'], false);
      postViewPage.getRadioButton('gender', 'Male').click();
      postViewPage.getRadioButton('ageRange', '30 - 39').click();
      postViewPage.selectLocation('Jelesn');

      postViewPage.getSubmitButton().click();
      browser.wait(EC.presenceOf(postViewPage.getDocumentResumeInput()));

      TestUtils.uploadFile(postViewPage.getDocumentResumeInput(), 'sample.pdf');
      postViewPage.getCoveringNoteEditor().sendKeys('Covering note');
      postViewPage.getWebsiteResumeInput().sendKeys('www.nie.com.pl');

      postViewPage.getSubmitButton().click();

      browser.wait(EC.presenceOf(postViewPage.getAlreadyAppliedDiv()));
      postViewPage.getLogoutButton().click();
    });
  });

  it('apply to a post as a stranger', () => {
    homePage.navigateTo();
    homePage.getLoginButton().click();
    authenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');

    browser.wait(EC.presenceOf(homePage.getPostsButton()));
    console.log('Posts button present');
    homePage.getPostsButton().click();
    postsPage.waitForLoaded();
    console.log('Posts loaded');
    postsPage.getPostTitleUrl('Bishop2 Post').click();
    postViewPage.assertPostView('Bishop2 Post',
      'Bishop2 summary', 'Bishop2 description', ['Employment', 'Internship'], true);

    postViewPage.getTabItem('Edit').click();

    postNewEditPage.getRadioButton('applyType', 'By visiting a web page').click();
    postNewEditPage.getApplyWebsiteInput().sendKeys('nie.com.pl');
    postEditPage.getButtonByLabel('Save').click();
    postViewPage.getLogoutButton().click();

    browser.get('/bishop-burton-college/bishop2/career-opportunities');
    boardViewPage.assertBoardView('Career Opportunities from Bishop2 dep',
      'Forum for partner organizations and staff to share career opportunities.',
      ['Employment', 'Internship', 'Volunteering'], false);

    postsPage.getPostTitleUrl('Bishop2 Post').click();

    postViewPage.assertPostView('Bishop2 Post',
      'Bishop2 summary', 'Bishop2 description', ['Employment', 'Internship'], false);
    postViewPage.getButtonByLabel('Apply Now').click();

    authenticationDialog.performRegistration(
      'independent-student4@test.prism.hr', 'Student1', 'Independent', '1secret1');

    browser.wait(EC.presenceOf(postViewPage.getRadioButton('gender', 'Male')));
    postViewPage.getRadioButton('gender', 'Male').click();
    postViewPage.getRadioButton('ageRange', '30 - 39').click();
    postViewPage.selectLocation('Jelesn');
    postViewPage.selectDropdownOption('Select a category', 'Research Student');
    postViewPage.getProgramInput().sendKeys('Another program');
    postViewPage.getMemberYearSelectButton(6).click();
    postViewPage.getExpiryDateInput().click();
    postViewPage.getExpiryDateInput().sendKeys(TestUtils.getFutureDate());
    postViewPage.getRadioButton('gender', 'Male').click(); // click outside calendar popup

    postViewPage.getSubmitButton().click();

    browser.wait(EC.presenceOf(postViewPage.getHowToApplyLink()));
    postViewPage.getLogoutButton().click();
  });
});

