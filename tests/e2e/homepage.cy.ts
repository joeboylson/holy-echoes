describe("Homepage Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the homepage successfully", () => {
    // Check that the header is visible
    cy.contains("Holy Echoes").should("be.visible");
    cy.contains("Traditional Catholic Prayers").should("be.visible");
  });

  it("should display category cards", () => {
    // Wait for categories to load and be visible
    cy.get('a[href^="/category/"]').should("exist");
  });

  it("should navigate to Favorites when clicked", () => {
    // Find and click the Favorites card
    cy.contains("Favorites").click();

    // Verify navigation
    cy.url().should("include", "/category/favorites");
  });

  it("should navigate to All Prayers when clicked", () => {
    // Find and click the All Prayers card
    cy.contains("All Prayers").click();

    // Verify navigation
    cy.url().should("include", "/category/all");
  });

  it("should navigate to category when a category card is clicked", () => {
    // Get all category cards and filter to find one that is not favorites or all
    cy.get('a[href^="/category/"]').then(($cards) => {
      // Filter to find non-special categories
      const otherCategories = $cards.filter((i, el) => {
        const href = el.getAttribute("href") || "";
        return !href.includes("favorites") && !href.includes("all");
      });

      // Only test if there are other categories besides Favorites and All Prayers
      if (otherCategories.length > 0) {
        const href = otherCategories.first().attr("href");
        cy.wrap(otherCategories.first()).click();

        // Verify we navigated to that category
        cy.url().should("include", href || "");
      } else {
        // Skip this test if only Favorites and All Prayers exist
        cy.log("No other categories found besides Favorites and All Prayers");
      }
    });
  });

  it("should display season featured prayers if available", () => {
    // Check if season section exists (it may not if no current season)
    cy.get("body").then(($body) => {
      if ($body.text().includes("Featured Prayers")) {
        cy.contains("Featured Prayers").should("be.visible");
      }
    });
  });
});
