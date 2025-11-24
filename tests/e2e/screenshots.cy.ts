describe('Page Screenshots', () => {
  it('should capture homepage screenshot', () => {
    cy.visit('/');
    cy.wait(2000); // Wait for content to load
    cy.screenshot('01-homepage', { capture: 'fullPage' });
  });

  it('should capture Favorites page screenshot', () => {
    cy.visit('/');
    cy.contains('Favorites').click();
    cy.wait(2000);
    cy.screenshot('02-favorites-page', { capture: 'fullPage' });
  });

  it('should capture All Prayers page screenshot', () => {
    cy.visit('/');
    cy.contains('All Prayers').click();
    cy.wait(2000);
    cy.screenshot('03-all-prayers-page', { capture: 'fullPage' });
  });

  it('should capture Category page screenshot', () => {
    cy.visit('/');
    // Find a category that is not Favorites or All Prayers
    cy.get('a[href^="/category/"]').then(($cards) => {
      const otherCategories = $cards.filter((i, el) => {
        const href = el.getAttribute('href') || '';
        return !href.includes('favorites') && !href.includes('all');
      });

      if (otherCategories.length > 0) {
        cy.wrap(otherCategories.first()).click();
        cy.wait(2000);
        cy.screenshot('04-category-page', { capture: 'fullPage' });
      }
    });
  });

  it('should capture Prayer page screenshot', () => {
    cy.visit('/');
    // Navigate to All Prayers first
    cy.contains('All Prayers').click();
    cy.wait(1000);

    // Click on the first prayer in the list
    cy.get('a[href*="/prayer/"]').first().click();
    cy.wait(2000);
    cy.screenshot('05-prayer-page', { capture: 'fullPage' });
  });

  it('should capture Admin Login page screenshot', () => {
    cy.visit('/admin');
    cy.wait(1000);
    cy.screenshot('06-admin-login', { capture: 'fullPage' });
  });

  it('should capture Configuration/Admin page screenshot (if accessible)', () => {
    cy.visit('/configuration');
    cy.wait(1000);
    cy.screenshot('07-configuration-page', { capture: 'fullPage' });
  });
});
