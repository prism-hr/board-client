import {browser, by, protractor} from 'protractor';
import {AuthenticationDialog, BoardViewPage, GenericPage, HomePage, PostNewPage} from './app.po';

describe('board-frontend App', () => {
  let homePage: HomePage;
  let boardViewPage: BoardViewPage;
  let genericPage: GenericPage;
  let authenticationDialog: AuthenticationDialog;

  beforeAll(() => {
  });

  beforeEach(() => {
    homePage = new HomePage(browser);
    boardViewPage = new BoardViewPage(browser);
    genericPage = new GenericPage(browser);
    authenticationDialog = new AuthenticationDialog(browser);

  });

  it('should create new post', () => {
    browser.get('/bishop-burton-college/bishop2/career-opportunities');
    boardViewPage.assertBoardView('Career Opportunities from Bishop2 dep',
      'Forum for partner organizations and staff to share career opportunities.',
      ['Employment', 'Internship', 'Volunteering'], false);

    const browser2 = browser.forkNewDriverInstance(true);
    const browser2EC = browser2.ExpectedConditions;
    const browser2BoardViewPage = new BoardViewPage(browser2);
    const browser2AuthenticationDialog = new AuthenticationDialog(browser2);
    const browser2PostNewPage = new PostNewPage(browser2);

    browser2BoardViewPage.getNewPostButton().click();
    browser2AuthenticationDialog.performRegistration('post-admin@test.prism.hr', 'Post Admin', 'Bishop',
      '1secret1');

    browser2.wait(browser2EC.urlContains('/newPost'));

    expect(browser2PostNewPage.getParagraphText()).toEqual('Create a new Post');

    browser2PostNewPage.getNameInput().sendKeys('Bishop Post');
    browser2PostNewPage.getSummaryTextarea().sendKeys('Bishop summary');
    browser2PostNewPage.getDescriptionEditor().sendKeys('Bishop description');
    browser2PostNewPage.getCheckboxLabel('Employment').click();
    browser2PostNewPage.getCheckboxLabel('Volunteering').click();
    browser2PostNewPage.getOrganizationNameInput().clear();
    browser2PostNewPage.getOrganizationNameInput().sendKeys('Bielmar');
    browser2PostNewPage.getLocationInput().clear();
    browser2PostNewPage.getLocationInput().sendKeys('Bielsko');
    browser2.wait(browser2EC.presenceOf(browser2PostNewPage.getLocationAutocomplete().element(by.tagName('ul'))));
    browser2PostNewPage.getLocationAutocomplete().all(by.tagName('li')).get(0).click();
    browser2.wait(browser2EC.presenceOf(browser2PostNewPage.getLocationAutocomplete('ng-valid')));
    browser2PostNewPage.getRadioButton('Employer').click();
    browser2PostNewPage.getExplanationTextarea().sendKeys('Recently hired');
    browser2PostNewPage.getCheckboxLabel('Master Student').click();
    browser2PostNewPage.getCheckboxLabel('Research Student').click();
    browser2PostNewPage.getRadioButton('By visiting a web page').click();
    browser2PostNewPage.getApplyWebsiteInput().sendKeys('http://wyborcza.pl');
    browser2PostNewPage.getCheckboxLabel('No Closing Date').click();
    browser2PostNewPage.getApplyWebsiteInput().sendKeys(protractor.Key.ENTER);
  });
});

