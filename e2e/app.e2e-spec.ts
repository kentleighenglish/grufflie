import { GruffliePage } from './app.po';

describe('Grufflie App', function() {
  let page: GruffliePage;

  beforeEach(() => {
    page = new GruffliePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
