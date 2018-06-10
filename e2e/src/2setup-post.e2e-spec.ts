import {browser, protractor} from 'protractor';
import {AuthenticationDialog, HomePage} from './app.po';
import {BoardViewPage, PostEditPage, PostNewEditPage, PostsPage, PostViewPage} from './resource.po';

const EC = browser.ExpectedConditions;

describe('Set up post', () => {
  let homePage: HomePage;
  let boardViewPage: BoardViewPage;
  let authenticationDialog: AuthenticationDialog;
  let postViewPage: PostViewPage;
  let postsPage: PostsPage;
  let postNewEditPage: PostNewEditPage;
  let postEditPage: PostEditPage;

  beforeAll(() => {
  });

  beforeEach(() => {
    homePage = new HomePage(browser);
    boardViewPage = new BoardViewPage(browser);
    authenticationDialog = new AuthenticationDialog(browser);
    postViewPage = new PostViewPage(browser);
    postsPage = new PostsPage(browser);
    postNewEditPage = new PostNewEditPage(browser);
    postEditPage = new PostEditPage(browser);
  });

  it('should create new post', () => {
    browser.get('/bishop-burton-college/bishop2/career-opportunities');
    boardViewPage.assertBoardView('Career Opportunities from Bishop2 dep',
      'Forum for partner organizations and staff to share career opportunities.',
      ['Employment', 'Internship', 'Volunteering'], false);

    const browser2 = browser.forkNewDriverInstance(true);
    browser.forkedInstances['browser2'] = browser2; // used by plugin protractor-jasmine2-screenshot-reporter
    const browser2BoardViewPage = new BoardViewPage(browser2);
    const browser2PostViewPage = new PostViewPage(browser2);
    const browser2AuthenticationDialog = new AuthenticationDialog(browser2);

    browser2BoardViewPage.getLoginButton().click();
    browser2AuthenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');

    boardViewPage.getNewPostButton().click();
    authenticationDialog.performRegistration('post-admin@test.prism.hr', 'Post Admin', 'Bishop', '1secret1');

    browser.wait(EC.urlContains('/newPost'));
    expect(postNewEditPage.getParagraphText()).toEqual('Create a new Post');
    postNewEditPage.getNameInput().sendKeys('Bishop Post');
    postNewEditPage.getSummaryTextarea().sendKeys('Bishop summary');
    postNewEditPage.getDescriptionEditor().sendKeys('Bishop description');
    postNewEditPage.getCheckboxLabel('Employment').click();
    postNewEditPage.getCheckboxLabel('Volunteering').click();
    postNewEditPage.getOrganizationNameInput().clear();
    postNewEditPage.getOrganizationNameInput().sendKeys('Bielmar');
    postNewEditPage.selectLocation('Bielsko');
    postNewEditPage.getRadioButton('existingRelation', 'Employer').click();
    postNewEditPage.getExplanationTextarea().sendKeys('Recently hired');
    postNewEditPage.getCheckboxLabel('Research Student').click();
    postNewEditPage.getRadioButton('applyType', 'By visiting a web page').click();
    postNewEditPage.getApplyWebsiteInput().sendKeys('http://wyborcza.pl');
    postNewEditPage.getCheckboxLabel('No Closing Date').click();
    postNewEditPage.getApplyWebsiteInput().sendKeys(protractor.Key.ENTER);

    browser.wait(EC.presenceOf(postViewPage.getActiveTabItem()));
    postViewPage.assertPostView('Bishop Post',
      'Bishop summary', 'Bishop description', ['Employment', 'Volunteering'], true);

    browser2PostViewPage.openActivitiesPanel(1, 1);
    browser2PostViewPage.getActivityButton(browser2PostViewPage.getActivityItems().first()).click();
    browser2PostViewPage.assertPostView('Bishop Post',
      'Bishop summary', 'Bishop description', ['Employment', 'Volunteering'], true);
    expect(browser2PostViewPage.getActivitiesCountBadge().isPresent()).toBeFalsy();
    browser2.close();
    browser.forkedInstances['browser2'] = null;

    postViewPage.getLogoutButton().click();
  });

  it('should accept a post', () => {
    homePage.navigateTo();
    homePage.getLoginButton().click();
    authenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');

    homePage.openActivitiesPanel(1);
    homePage.getActivityButton(homePage.getActivityItems().first()).click();

    postViewPage.waitForLoaded();
    expect(postViewPage.getActionButtonLabels()).toEqual(['Review', 'Reject']);
    postViewPage.getActionButton('Review').click();

    // TODO assert value

    postNewEditPage.getNameInput().clear();
    postNewEditPage.getNameInput().sendKeys('Bishop2 Post');
    postNewEditPage.getSummaryTextarea().clear();
    postNewEditPage.getSummaryTextarea().sendKeys('Bishop2 summary');
    postNewEditPage.getDescriptionEditor().clear();
    postNewEditPage.getDescriptionEditor().sendKeys('Bishop2 description');
    postNewEditPage.getCheckboxLabel('Volunteering').click();
    postNewEditPage.getCheckboxLabel('Internship').click();
    postNewEditPage.getOrganizationNameInput().clear();
    postNewEditPage.getOrganizationNameInput().sendKeys('Żywiec');
    postNewEditPage.selectLocation('żywiec');
    postNewEditPage.getRadioButton('existingRelation', 'Collaborator').click();
    postNewEditPage.getExplanationTextarea().sendKeys('Recently collaborating');
    postNewEditPage.getCheckboxLabel('Master Student').click();
    postNewEditPage.getRadioButton('applyType', 'By submitting an application').click();
    postNewEditPage.getApplyEmailInput().sendKeys('email@test.prism.hr');

    expect(postEditPage.getActionButtonLabels()).toEqual(['Request Revision', 'Accept', 'Reject']);
    postEditPage.getActionButton('Accept').click();
    postEditPage.getSubmitButton().click();

    postViewPage.assertPostView('Bishop2 Post',
      'Bishop2 summary', 'Bishop2 description', ['Employment', 'Internship'], true);

    postViewPage.getLogoutButton().click();
  });
});

