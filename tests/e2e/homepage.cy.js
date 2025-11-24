describe("Homepage Navigation", function () {
    beforeEach(function () {
        cy.visit("/");
    });
    it("should load the homepage successfully", function () {
        // Check that the header is visible
        cy.contains("Holy Echoes").should("be.visible");
        cy.contains("Traditional Catholic Prayers").should("be.visible");
    });
    it("should display category cards", function () {
        // Wait for categories to load and be visible
        cy.get('a[href^="/category/"]').should("exist");
    });
    it("should navigate to Favorites when clicked", function () {
        // Find and click the Favorites card
        cy.contains("Favorites").click();
        // Verify navigation
        cy.url().should("include", "/category/favorites");
    });
    it("should navigate to All Prayers when clicked", function () {
        // Find and click the All Prayers card
        cy.contains("All Prayers").click();
        // Verify navigation
        cy.url().should("include", "/category/all");
    });
    it("should navigate to category when a category card is clicked", function () {
        // Get all category cards and filter to find one that is not favorites or all
        cy.get('a[href^="/category/"]').then(function ($cards) {
            // Filter to find non-special categories
            var otherCategories = $cards.filter(function (i, el) {
                var href = el.getAttribute("href") || "";
                return !href.includes("favorites") && !href.includes("all");
            });
            // Only test if there are other categories besides Favorites and All Prayers
            if (otherCategories.length > 0) {
                var href = otherCategories.first().attr("href");
                cy.wrap(otherCategories.first()).click();
                // Verify we navigated to that category
                cy.url().should("include", href || "");
            }
            else {
                // Skip this test if only Favorites and All Prayers exist
                cy.log("No other categories found besides Favorites and All Prayers");
            }
        });
    });
    it("should display season featured prayers if available", function () {
        // Check if season section exists (it may not if no current season)
        cy.get("body").then(function ($body) {
            if ($body.text().includes("Featured Prayers")) {
                cy.contains("Featured Prayers").should("be.visible");
            }
        });
    });
});
