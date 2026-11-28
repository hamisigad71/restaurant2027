import "./commands"

beforeEach(() => {
  cy.intercept("GET", "https://i.pinimg.com/**", { statusCode: 204, body: "" })
  cy.intercept("GET", "https://images.unsplash.com/**", { statusCode: 204, body: "" })
})
