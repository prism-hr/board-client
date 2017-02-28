import { BoardFrontendPage } from './app.po';

describe('board-frontend App', () => {
  let page: BoardFrontendPage;

  beforeEach(() => {
    page = new BoardFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('THE MARKETPLACE');
  });
});
