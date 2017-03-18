import { AgricngPage } from './app.po';

describe('agricng App', function() {
  let page: AgricngPage;

  beforeEach(() => {
    page = new AgricngPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
