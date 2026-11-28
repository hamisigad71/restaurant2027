describe("Workflow 2: Waiter Service Floor -> Kitchen KDS -> Waiter Checkout -> Cleaners", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.resetAppState()
  })

  it("places a waiter-assisted order for Table 02, serves it in KDS, settles at Checkout with 16% VAT, and enqueues cleaning", () => {
    // 1. Waiter selects Table 02 on Service Floor and adds Calamari Fritti (KES 950)
    cy.loginAs("waiter")
    cy.visit("/waiter/service-floor")
    cy.contains("span", "02").parents(".group").first().click()

    cy.contains("Calamari Fritti")
      .closest("div.group")
      .within(() => {
        cy.contains("button", "Add to Order").click()
      })

    // Open cart popover (includes 16% VAT: 950 + 152 = KES 1,102) and click Place Order
    cy.contains("button", "KES 1,102").click()
    cy.contains("button", "Place Order").click()

    // 2. Kitchen KDS advances Table 2 order through cooking -> ready -> served
    cy.loginAs("kitchen")
    cy.visit("/kitchen/kds")
    cy.contains("T2").should("be.visible")

    const advanceTable2 = (label: string) => {
      cy.contains("div", "T2")
        .parents(".group")
        .first()
        .within(() => {
          cy.contains("button", label).click()
        })
    }

    advanceTable2("Start Cooking")
    advanceTable2("Mark Ready")
    advanceTable2("Mark Served")

    // 3. Waiter Checkout still shows Table 02 with 16% VAT (950 + 152 = KES 1,102) & settles it
    cy.loginAs("waiter")
    cy.visit("/waiter/checkout")
    cy.contains("Table 02").click()
    cy.contains("Calamari Fritti").should("be.visible")
    cy.contains("VAT (16%)").should("be.visible")
    cy.contains("KES 152").should("be.visible")
    cy.contains("KES 1,102").should("be.visible")
    cy.contains("button", "Post Settlement").click()
    cy.contains("Table 02").should("not.exist")

    // 4. Cleaners queue receives Table 02 and can clean it
    cy.loginAs("cleaner")
    cy.visit("/cleaners")
    cy.contains("Table 02").should("be.visible")
  })
})
