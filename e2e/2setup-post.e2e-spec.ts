import {browser, by, protractor} from 'protractor';
import {AuthenticationDialog, HomePage} from './app.po';
import {BoardViewPage, PostEditPage, PostNewPage, PostsPage, PostViewPage} from './resource.po';

const EC = browser.ExpectedConditions;

describe('board-frontend App', () => {
  let homePage: HomePage;
  let boardViewPage: BoardViewPage;
  let authenticationDialog: AuthenticationDialog;
  let postViewPage: PostViewPage;
  let postsPage: PostsPage;
  let postNewPage: PostNewPage;
  let postEditPage: PostEditPage;

  beforeAll(() => {
  });

  beforeEach(() => {
    homePage = new HomePage(browser);
    boardViewPage = new BoardViewPage(browser);
    authenticationDialog = new AuthenticationDialog(browser);
    postViewPage = new PostViewPage(browser);
    postsPage = new PostsPage(browser);
    postNewPage = new PostNewPage(browser);
    postEditPage = new PostEditPage(browser);
  });

  it('should create new post', () => {
    browser.get('/bishop-burton-college/bishop2/career-opportunities');
    boardViewPage.assertBoardView('Career Opportunities from Bishop2 dep',
      'Forum for partner organizations and staff to share career opportunities.',
      ['Employment', 'Internship', 'Volunteering'], false);

    const browser2 = browser.forkNewDriverInstance(true);
    const browser2EC = browser2.ExpectedConditions;
    const browser2BoardViewPage = new BoardViewPage(browser2);
    const browser2PostViewPage = new PostViewPage(browser2);
    const browser2AuthenticationDialog = new AuthenticationDialog(browser2);

    browser2BoardViewPage.getLoginButton().click();
    browser2AuthenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');
    browser2.wait(EC.presenceOf(browser2BoardViewPage.getDoNotShowAgainButton()));
    browser2BoardViewPage.getDoNotShowAgainButton().click();

    boardViewPage.getNewPostButton().click();
    authenticationDialog.performRegistration('post-admin@test.prism.hr', 'Post Admin', 'Bishop',
      '1secret1');

    browser.wait(EC.urlContains('/newPost'));
    expect(postNewPage.getParagraphText()).toEqual('Create a new Post');
    postNewPage.getNameInput().sendKeys('Bishop Post');
    postNewPage.getSummaryTextarea().sendKeys('Bishop summary');
    postNewPage.getDescriptionEditor().sendKeys('Bishop description');
    postNewPage.getCheckboxLabel('Employment').click();
    postNewPage.getCheckboxLabel('Volunteering').click();
    postNewPage.getOrganizationNameInput().clear();
    postNewPage.getOrganizationNameInput().sendKeys('Bielmar');
    postNewPage.getLocationInput().clear();
    postNewPage.getLocationInput().sendKeys('Bielsko');
    browser.wait(EC.presenceOf(postNewPage.getLocationAutocomplete().element(by.tagName('ul'))));
    postNewPage.getLocationAutocomplete().all(by.tagName('li')).get(0).click();
    browser.wait(EC.presenceOf(postNewPage.getLocationAutocomplete('ng-valid')));
    postNewPage.getRadioButton('Employer').click();
    postNewPage.getExplanationTextarea().sendKeys('Recently hired');
    postNewPage.getCheckboxLabel('Master Student').click();
    postNewPage.getCheckboxLabel('Research Student').click();
    postNewPage.getRadioButton('By visiting a web page').click();
    postNewPage.getApplyWebsiteInput().sendKeys('http://wyborcza.pl');
    postNewPage.getCheckboxLabel('No Closing Date').click();
    postNewPage.getApplyWebsiteInput().sendKeys(protractor.Key.ENTER);

    browser.wait(EC.presenceOf(postViewPage.getActiveTabItem()));
    postViewPage.assertPostView('Bishop Post',
      'Bishop summary', 'Bishop description', ['Employment', 'Volunteering'], true);

    browser2PostViewPage.openActivitiesPanel(1);
    browser2PostViewPage.getActivityButton(browser2PostViewPage.getActivityItems().first()).click();
    browser2PostViewPage.assertPostView('Bishop Post',
      'Bishop summary', 'Bishop description', ['Employment', 'Volunteering'], true);
    expect(browser2PostViewPage.getActivitiesCountBadge().isPresent()).toBeFalsy();
    browser2.close();

    postViewPage.getLogoutButton().click();
  });

  it('should accept a post', () => {
    homePage.navigateTo();
    homePage.getLoginButton().click();
    authenticationDialog.performLogin('admin2@test.prism.hr', '1secret1');

    browser.wait(EC.presenceOf(homePage.getActivitiesButton()));
    homePage.getActivitiesButton().click();
    homePage.getActivityItems().first().click();

    expect(postViewPage.getActionButtonLabels()).toEqual(['Review', 'Reject']);
    postViewPage.getActionButton('Review').click();

    // TODO assert value

    postNewPage.getNameInput().clear();
    postNewPage.getNameInput().sendKeys('Bishop2 Post');
    postNewPage.getSummaryTextarea().clear();
    postNewPage.getSummaryTextarea().sendKeys('Bishop2 summary');
    postNewPage.getDescriptionEditor().clear();
    postNewPage.getDescriptionEditor().sendKeys('Bishop2 description');
    postNewPage.getCheckboxLabel('Volunteering').click();
    postNewPage.getCheckboxLabel('Internship').click();
    postNewPage.getOrganizationNameInput().clear();
    postNewPage.getOrganizationNameInput().sendKeys('Żywiec');
    postNewPage.getLocationInput().clear();
    postNewPage.getLocationInput().sendKeys('żywiec');
    browser.wait(EC.presenceOf(postNewPage.getLocationAutocomplete().element(by.tagName('ul'))));
    postNewPage.getLocationAutocomplete().all(by.tagName('li')).get(0).click();
    // browser.wait(EC.presenceOf(postNewPage.getLocationAutocomplete('ng-valid')));
    postNewPage.getRadioButton('Collaborator').click();
    postNewPage.getExplanationTextarea().sendKeys('Recently collaborating');
    postNewPage.getCheckboxLabel('Master Student').click();
    postNewPage.getRadioButton('By submitting an application').click();
    postNewPage.getApplyEmailInput().sendKeys('email@test.prism.hr');

    expect(postEditPage.getActionButtonLabels()).toEqual(['Request Revision', 'Accept', 'Reject']);
    postEditPage.getActionButton('Accept').click();
    postEditPage.getSubmitButton().click();

    postViewPage.waitForLoaded();
    postViewPage.assertPostView('Bishop2 Post',
      'Bishop2 summary', 'Bishop2 description', ['Employment', 'Internship'], true);

    postViewPage.getLogoutButton().click();
  });

  it('should edit a post', () => {
    homePage.navigateTo();
    homePage.getLoginButton().click();
    authenticationDialog.performLogin('post-admin@test.prism.hr', '1secret1');

    browser.wait(EC.presenceOf(postsPage.getDoItAgainButton()));
    postsPage.getDoItAgainButton().click();
    postsPage.getPostsButton().click();
    postsPage.waitForLoaded();
    postsPage.getPostTitleUrl('Bishop2 Post').click();

    browser.wait(EC.presenceOf(postViewPage.getTabItem('Edit')));
    postViewPage.getTabItem('Edit').click();
  });
});

