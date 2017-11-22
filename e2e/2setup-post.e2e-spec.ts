import {browser} from 'protractor';
import {BoardViewPage, HomePage} from './app.po';

describe('board-frontend App', () => {
  const randomString = 'mo4h'; // browser.params.randomString;
  let homePage: HomePage;
  let boardViewPage: BoardViewPage;

  beforeAll(() => {
    console.log('Random string: ' + randomString);
  });

  beforeEach(() => {
    homePage = new HomePage();
    boardViewPage = new BoardViewPage();
  });

  it('should create new post', () => {
    browser.get('/' + 'bishop-burton-college/bishop2-' + randomString + '/career-opportunities');
    boardViewPage.assertBoardView('Career Opportunities from Bishop2 dep' + randomString,
      'Forum for partner organizations and staff to share career opportunities.',
      ['Employment', 'Internship', 'Volunteering'], false);

    // browser.forkNewDriverInstance()

  });
});

