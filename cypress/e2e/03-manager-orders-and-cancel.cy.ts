describe("Workflow 3: Manager Order Oversight & Cancellation Sync", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("cancels a live customer order from Manager Orders, removing it from Waiter Checkout", () => {
    // 1. Place order for Table 7 from Customer portal
    cy.visit("/customer/7")
    cy.dismissWelcome()
    cy.contains("Samosa (4pcs)")
      .closest("div.group")
      .within(() => {
        cy.contains("button", "Add to Tray").click()
      })
    cy.contains("button", "View Order").click()
    cy.contains("button", "Confirm Order").click()
    cy.contains(/Order sent to kitchen|Preparing Order|Bill Ready/i).should("be.visible")

    // 2. Manager Orders sees T7 live order and cancels it
    cy.loginAs("manager")
    cy.visit("/manager/orders")
    cy.contains("td", "T7")
      .closest("tr")
      .within(() => {
        cy.get("button").last().click()
      })
    cy.contains('[role="menuitem"]', "Cancel Order").click()
    cy.contains("td", "T7").closest("tr").should("contain.text", "cancelled")

    // 3. Waiter Checkout does not show Table 7 as an unpaid active bill
    cy.loginAs("waiter")
    cy.visit("/waiter/checkout")
    cy.contains("Table 07").should("not.exist")
  })
})
