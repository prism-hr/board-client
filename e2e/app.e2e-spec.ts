import { BoardFrontendPage } from './app.po';

describe('board-frontend App', function() {
  let page: BoardFrontendPage;

  beforeEach(() => {
    page = new BoardFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
