describe("Workflow 6: Customer Summons & Cross-Portal Navigation Integrity", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("routes customer call alerts to Waiter Dashboard for resolution and loads customer billing without 404s", () => {
    // 1. Customer on Table 5 opens menu and navigates to billing via Bill & Pay
    cy.visit("/customer/5")
    cy.dismissWelcome()
    cy.contains("a, button", "Bill & Pay").click({ force: true })
    cy.url().should("include", "/customer/5/billing")

    // 2. Seed a pending customer summon alert in tabletap_summons and resolve it in Waiter Dashboard
    cy.window().then((win) => {
      const alerts = [
        {
          id: "sum-e2e-5",
          staffId: 0,
          staffName: "Table 5 Guest",
          tableId: "5",
          isCustomerCall: true,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ]
      win.localStorage.setItem("tabletap_summons", JSON.stringify(alerts))
    })

    cy.loginAs("waiter")
    cy.visit("/waiter/dashboard")
    cy.contains("Table 5").should("be.visible")
    cy.contains("Customer is requesting assistance").should("be.visible")
    cy.contains("button", "Resolve").click()
    cy.contains("Customer is requesting assistance").should("not.exist")
  })
})
