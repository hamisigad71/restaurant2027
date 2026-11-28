export type DemoRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "customer"
  | "cleaner"
  | "security"

const DEMO_USERS: Record<
  DemoRole,
  { id: string; name: string; email: string; role: DemoRole; restaurantId?: string }
> = {
  admin: {
    id: "admin-001",
    name: "James Mwangi",
    email: "admin@smartrestaurant.co.ke",
    role: "admin",
    restaurantId: "rest-001",
  },
  manager: {
    id: "mgr-001",
    name: "Grace Wanjiku",
    email: "manager@smartrestaurant.co.ke",
    role: "manager",
    restaurantId: "rest-001",
  },
  waiter: {
    id: "waiter-001",
    name: "Peter Ochieng",
    email: "waiter@smartrestaurant.co.ke",
    role: "waiter",
    restaurantId: "rest-001",
  },
  kitchen: {
    id: "kitchen-001",
    name: "Mary Akinyi",
    email: "kitchen@smartrestaurant.co.ke",
    role: "kitchen",
    restaurantId: "rest-001",
  },
  customer: {
    id: "cust-001",
    name: "Guest Customer",
    email: "guest@email.com",
    role: "customer",
  },
  cleaner: {
    id: "cl-001",
    name: "Facility Team",
    email: "cleaner@smartrestaurant.co.ke",
    role: "cleaner",
    restaurantId: "rest-001",
  },
  security: {
    id: "sec-001",
    name: "Security Chief",
    email: "security@smartrestaurant.co.ke",
    role: "security",
    restaurantId: "rest-001",
  },
}

declare global {
  namespace Cypress {
    interface Chainable {
      resetAppState(): Chainable<void>
      loginAs(role: DemoRole): Chainable<void>
      dismissWelcome(): Chainable<void>
    }
  }
}

Cypress.Commands.add("resetAppState", () => {
  cy.window({ log: false }).then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

Cypress.Commands.add("loginAs", (role: DemoRole) => {
  cy.window({ log: false }).then((win) => {
    win.sessionStorage.setItem("tabletap_auth_user", JSON.stringify(DEMO_USERS[role]))
  })
})

Cypress.Commands.add("dismissWelcome", () => {
  cy.contains(/Resto/i, { timeout: 25000 }).should("be.visible")
  cy.get("body").then(($body) => {
    if ($body.find("button:contains('Enjoy Experience')").length > 0) {
      cy.contains("button", "Enjoy Experience").click({ force: true })
    }
  })
})
