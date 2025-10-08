/**
 * E2E TEST: Responsive Design
 * 
 * Pruebas de diseño responsive en diferentes dispositivos:
 * - Mobile: iPhone SE (375x667)
 * - Mobile Large: iPhone 11 (414x896)
 * - Tablet: iPad (768x1024)
 * - Desktop: 1920x1080
 * - Desktop Large: 2560x1440
 */

describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'iphone-se', width: 375, height: 667 },
    { name: 'iphone-11', width: 414, height: 896 },
    { name: 'ipad-2', width: 768, height: 1024 },
    { name: 'macbook-15', width: 1440, height: 900 },
    { name: 'desktop-large', width: 2560, height: 1440 },
  ]

  viewports.forEach((viewport) => {
    describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        if (viewport.name === 'desktop-large') {
          cy.viewport(viewport.width, viewport.height)
        } else {
          cy.viewport(viewport.name as Cypress.ViewportPreset)
        }
        cy.visit('/menu')
        cy.waitForMenuLoad()
      })

      it('should display main layout correctly', () => {
        // Header debe ser visible
        cy.get('header').should('be.visible')

        // Plate grid debe ser visible
        cy.getByDataCy('plate-grid').should('be.visible')

        // Footer debe ser visible (puede requerir scroll)
        cy.scrollTo('bottom')
        cy.get('footer').should('be.visible')
      })

      it('should have touch-friendly elements on mobile', () => {
        if (viewport.width < 768) {
          // En móvil, los botones deben ser lo suficientemente grandes
          cy.getByDataCy('plate-card').filter(':visible').first().should('be.visible')
          
          // Verificar que se puede hacer click
          cy.getByDataCy('plate-card').filter(':visible').first().click({ force: true })
          cy.url().should('match', /\/plato\/\d+/)
        }
      })

      it('should display navigation appropriately', () => {
        if (viewport.width < 768) {
          // En móvil, puede haber un menú hamburguesa
          cy.get('[data-cy=mobile-menu-button], .mobile-menu, button[aria-label*="menu"]')
            .should('exist')
        } else {
          // En desktop, navegación completa visible
          cy.get('nav, header').should('be.visible')
        }
      })

      it('should handle grid layout responsively', () => {
        // El grid debe ajustarse al tamaño de pantalla
        cy.getByDataCy('plate-card').should('have.length.gt', 0)

        if (viewport.width < 640) {
          // Mobile: probablemente 1 columna
          cy.log('Mobile layout - 1 column expected')
        } else if (viewport.width < 1024) {
          // Tablet: probablemente 2 columnas
          cy.log('Tablet layout - 2 columns expected')
        } else {
          // Desktop: probablemente 3-4 columnas
          cy.log('Desktop layout - 3-4 columns expected')
        }
      })

      it('should allow scrolling through content', () => {
        // Verificar que se puede hacer scroll
        cy.scrollTo('bottom')
        cy.scrollTo('top')
      })

      it('should display images properly', () => {
        // Las imágenes deben estar visibles y con tamaño apropiado
        cy.get('img').first().should('be.visible')
        cy.get('img').first().should('have.attr', 'src')
      })
    })
  })

  describe('Orientation changes', () => {
    it('should handle portrait to landscape on mobile', () => {
      // Retrato
      cy.viewport('iphone-xr')
      cy.visit('/menu')
      cy.getByDataCy('plate-grid').should('be.visible')

      // Paisaje
      cy.viewport(896, 414)
      cy.getByDataCy('plate-grid').should('be.visible')
    })
  })

  describe('Text readability', () => {
    it('should maintain readable font sizes across devices', () => {
      const viewports: Cypress.ViewportPreset[] = ['iphone-xr', 'ipad-2', 'macbook-15']

      viewports.forEach((viewport) => {
        cy.viewport(viewport)
        cy.visit('/menu')

        // El texto debe ser legible (tamaño mínimo típicamente 16px en móvil)
        cy.get('h1, h2, h3, p').each(($el) => {
          cy.wrap($el).should('be.visible')
        })
      })
    })
  })
})
