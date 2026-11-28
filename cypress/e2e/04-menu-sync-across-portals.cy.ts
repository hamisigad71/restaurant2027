describe("Workflow 4: Menu Management & Availability Sync Across Portals", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("syncs 86'd availability and newly added items from Admin Menu to Manager, Waiter & Customer", () => {
    cy.loginAs("admin")
    cy.visit("/admin/menu")

    // 1. Toggle Truffle Burrata to Hidden (86'd)
    cy.contains("h3", "Truffle Burrata")
      .closest("div.group")
      .within(() => {
        cy.contains("button", "Visible").click()
        cy.contains("button", "Hidden").should("be.visible")
      })

    // 2. Verify Waiter Menu reflects 86'd status
    cy.loginAs("waiter")
    cy.visit("/waiter/menu")
    cy.contains("h3", "Truffle Burrata")
      .closest("div.group")
      .within(() => {
        cy.contains("button", "Mark 86'd").should("be.visible")
      })

    // 3. Verify Manager Menu reflects 86'd status
    cy.loginAs("manager")
    cy.visit("/manager/menu")
    cy.contains("h3", "Truffle Burrata")
      .closest("div.group")
      .within(() => {
        cy.contains("86'd").should("be.visible")
      })

    // 4. Add a new menu item in Admin Menu and verify Customer Menu renders it
    cy.loginAs("admin")
    cy.visit("/admin/menu")
    cy.contains("button", "Add Item").click()
    cy.get("#name").type("Cypress Grilled Platter")
    cy.get("#description").type("E2E test signature platter")
    cy.get("#price").clear().type("1500")
    cy.contains("button", "Create").click()
    cy.contains("h3", "Cypress Grilled Platter").should("be.visible")

    cy.visit("/customer/4")
    cy.dismissWelcome()
    cy.contains("Cypress Grilled Platter").should("be.visible")
  })
})
