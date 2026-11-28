describe("Workflow 1: Customer QR Order -> Kitchen KDS -> Billing -> Admin Payments -> Cleaners -> Floor/Security", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("carries a customer dine-in order across all operational portals without losing the served bill", () => {
    // 1. Customer opens QR menu for Table 4
    cy.visit("/customer/4")
    cy.dismissWelcome()

    // Add Truffle Burrata (KSh 1,200) -> 16% VAT = 192 -> Total = 1,392
    cy.contains("Truffle Burrata")
      .closest("div.group")
      .within(() => {
        cy.contains("button", "Add to Tray").click()
      })

    cy.contains("button", "View Order").click()
    cy.contains("button", "Confirm Order").click()
    cy.contains(/Preparing Order|Bill Ready/i).should("be.visible")

    // 2. Kitchen KDS receives and advances Table 4 order -> cooking -> ready -> served
    cy.loginAs("kitchen")
    cy.visit("/kitchen/kds")
    cy.contains("T4").should("be.visible")

    const advanceTable4 = (label: string) => {
      cy.contains("div", "T4")
        .parents(".group")
        .first()
        .within(() => {
          cy.contains("button", label).click()
        })
    }

    advanceTable4("Start Cooking")
    advanceTable4("Mark Ready")
    advanceTable4("Mark Served")

    // 3. Customer Billing still shows the served unpaid order with 16% VAT + 10% default tip & settles it
    cy.visit("/customer/4/billing")
    cy.contains("Truffle Burrata").should("be.visible")
    cy.contains("VAT (16%)").should("be.visible")
    cy.contains("KSh 1,200").should("be.visible")
    cy.contains("KSh 192").should("be.visible")
    cy.contains("KSh 120").should("be.visible")
    cy.contains("Confirm & Pay").should("contain.text", "1,512").click()
    cy.contains("Payment successful!").should("be.visible")

    // 4. Admin Payments sees the completed KSh 1,512 payment
    cy.loginAs("admin")
    cy.visit("/admin/payments")
    cy.contains("KES 1,512").should("be.visible")

    // 5. Cleaners portal receives Table 04 in cleaning queue and marks it clean
    cy.loginAs("cleaner")
    cy.visit("/cleaners")
    cy.contains("Table 04")
      .closest('[data-slot="card"]')
      .within(() => {
        cy.contains("button", "Mark as Clean").click()
      })
    cy.wait(500)
    cy.contains("Table 04").should("not.exist")

    // 6. Table 4 is back to Available on QR Menu and Security loads cleanly
    cy.loginAs("manager")
    cy.visit("/customer/qr-menu")
    cy.contains("Table 4")
      .closest(".group")
      .should("contain.text", "Available")

    cy.loginAs("security")
    cy.visit("/security")
    cy.contains("SecOps Center").should("be.visible")
  })
})
