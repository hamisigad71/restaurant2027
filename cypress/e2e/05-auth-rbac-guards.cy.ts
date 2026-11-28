describe("Workflow 5: Auth Persistence & RBAC Portal Guards", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("redirects unauthenticated staff routes to /login and persists role-guarded login across reloads", () => {
    // 1. Unauthenticated access to protected portal redirects to /login
    cy.visit("/admin/dashboard")
    cy.url().should("include", "/login")

    // 2. Quick Demo Login as Waiter via UI lands on /waiter/dashboard & persists across reload
    cy.contains("button", "Staff").click()
    cy.contains("button", "Waiter").click()
    cy.url().should("include", "/waiter/dashboard")
    cy.reload()
    cy.url().should("include", "/waiter/dashboard")

    // 3. Waiter cannot access Admin portal -> redirected to Waiter default portal
    cy.visit("/admin/dashboard")
    cy.url().should("include", "/waiter/dashboard")

    // 4. Cleaner and Security roles can access their respective portals
    cy.loginAs("cleaner")
    cy.visit("/cleaners")
    cy.url().should("include", "/cleaners")

    cy.loginAs("security")
    cy.visit("/security")
    cy.url().should("include", "/security")
    cy.contains("SecOps Center").should("be.visible")
  })
})
