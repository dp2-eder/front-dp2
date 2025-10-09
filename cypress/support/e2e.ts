// ***********************************************************
// This support file is processed and loaded automatically before your test files.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Import axe for accessibility testing
import 'cypress-axe'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Example of custom command or configuration
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('not.include', '/login')
  })
})

// Custom command for waiting for API calls
Cypress.Commands.add('waitForMenuLoad', () => {
  cy.intercept('GET', '/api/menu/items').as('getMenuItems')
  cy.wait('@getMenuItems')
})

// Add TypeScript declarations
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      waitForMenuLoad(): Chainable<void>
    }
  }
}

export {}
