// ***********************************************
// This file contains custom commands and overrides for Cypress
// ***********************************************

// Custom command examples
Cypress.Commands.add('getByDataCy', (selector: string) => {
  return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('findByDataCy', (selector: string) => {
  return cy.find(`[data-cy=${selector}]`)
})

// Add to cart helper
Cypress.Commands.add('addPlateToCart', (plateIndex = 0) => {
  cy.getByDataCy('plate-card').eq(plateIndex).click()
  cy.getByDataCy('plate-modal').should('be.visible')
  cy.getByDataCy('add-to-cart-btn').click()
  cy.getByDataCy('toast-success').should('be.visible')
})

// TypeScript declarations
declare global {
  namespace Cypress {
    interface Chainable {
      getByDataCy(selector: string): Chainable<JQuery<HTMLElement>>
      findByDataCy(selector: string): Chainable<JQuery<HTMLElement>>
      addPlateToCart(plateIndex?: number): Chainable<void>
    }
  }
}

export {}
