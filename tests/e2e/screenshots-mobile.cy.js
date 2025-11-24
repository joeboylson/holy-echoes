describe('Mobile Page Screenshots', function () {
    beforeEach(function () {
        // Set viewport to mobile size (iPhone 12/13)
        cy.viewport(390, 844);
    });
    it('should capture mobile homepage screenshot', function () {
        cy.visit('/');
        cy.wait(2000); // Wait for content to load
        cy.screenshot('mobile-01-homepage', { capture: 'fullPage' });
    });
    it('should capture mobile Favorites page screenshot', function () {
        cy.visit('/');
        cy.contains('Favorites').click();
        cy.wait(2000);
        cy.screenshot('mobile-02-favorites-page', { capture: 'fullPage' });
    });
    it('should capture mobile All Prayers page screenshot', function () {
        cy.visit('/');
        cy.contains('All Prayers').click();
        cy.wait(2000);
        cy.screenshot('mobile-03-all-prayers-page', { capture: 'fullPage' });
    });
    it('should capture mobile Category page screenshot', function () {
        cy.visit('/');
        // Find a category that is not Favorites or All Prayers
        cy.get('a[href^="/category/"]').then(function ($cards) {
            var otherCategories = $cards.filter(function (i, el) {
                var href = el.getAttribute('href') || '';
                return !href.includes('favorites') && !href.includes('all');
            });
            if (otherCategories.length > 0) {
                cy.wrap(otherCategories.first()).click();
                cy.wait(2000);
                cy.screenshot('mobile-04-category-page', { capture: 'fullPage' });
            }
        });
    });
    it('should capture mobile Prayer page screenshot', function () {
        cy.visit('/');
        // Navigate to All Prayers first
        cy.contains('All Prayers').click();
        cy.wait(1000);
        // Click on the first prayer in the list
        cy.get('a[href*="/prayer/"]').first().click();
        cy.wait(2000);
        cy.screenshot('mobile-05-prayer-page', { capture: 'fullPage' });
    });
    it('should capture mobile Admin Login page screenshot', function () {
        cy.visit('/admin');
        cy.wait(1000);
        cy.screenshot('mobile-06-admin-login', { capture: 'fullPage' });
    });
    it('should capture mobile Configuration/Admin page screenshot (if accessible)', function () {
        cy.visit('/configuration');
        cy.wait(1000);
        cy.screenshot('mobile-07-configuration-page', { capture: 'fullPage' });
    });
});
