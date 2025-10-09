/**
 * E2E TEST: Complete Customer Flow
 * E2E-001: Flujo Completo del Comensal
 * 
 * Prueba end-to-end del journey completo de un cliente:
 * 1. Acceder desde QR (simulado con parámetro mesa)
 * 2. Ver página de bienvenida
 * 3. Navegar al menú
 * 4. Explorar categorías
 * 5. Ver platos filtrados
 * 6. Abrir modal/detalle de plato
 * 7. Agregar al carrito
 * 8. Verificar carrito
 */

describe('E2E-001: Complete Customer Flow', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('should complete full customer journey from QR to cart', () => {
    // 1. Acceder desde QR (simular con parámetro mesa)
    cy.visit('/menu?mesa=5')
    
    // Verificar que la página carga correctamente
    cy.url().should('include', '/menu')
    cy.url().should('include', 'mesa=5')

    // 2. Verificar elementos principales del menú
    cy.getByDataCy('page-container').should('be.visible')
    
    // Esperar a que carguen los items del menú
    cy.waitForMenuLoad()

    // 3. Verificar que hay categorías disponibles
    cy.get('button, [role="button"]').contains(/entrada|plato|bebida/i).should('exist')

    // 4. Ver grid de platos (esperar a que sea visible)
    cy.getByDataCy('plate-grid').should('be.visible')
    cy.getByDataCy('plate-card').should('have.length.gt', 0)

    // 5. Click en el primer plato visible para ver detalles
    cy.getByDataCy('plate-card').filter(':visible').first().click({ force: true })

    // Verificar que navega a la página de detalle
    cy.url().should('match', /\/plato\/\d+/)

    // Verificar que se muestran los detalles del plato
    cy.get('h1').should('exist')
    cy.contains(/ingredientes|alérgenos|descripción/i).should('exist')

    // 6. Click en "Ordene Ahora" para personalizar
    cy.contains('button', /ordene ahora/i).click()

    // Debe navegar a la página de personalización
    cy.url().should('include', '/personalizar')

    // 7. Agregar al carrito
    cy.getByDataCy('add-to-cart-btn').should('be.visible')
    cy.getByDataCy('add-to-cart-btn').click()

    // 8. Verificar que se agrega al carrito
    // Puede mostrar un toast de éxito
    cy.contains(/agregado|éxito|carrito/i, { timeout: 5000 }).should('exist')

    // 9. Navegar al carrito
    cy.visit('/carrito')

    // Verificar que el carrito contiene el item
    cy.getByDataCy('cart-item').should('have.length', 1)

    // Verificar que se muestra el total
    cy.contains(/total|s\//i).should('exist')
  })

  it('should maintain cart state across page reloads', () => {
    // Agregar un item al carrito
    cy.visit('/menu')
    cy.waitForMenuLoad()
    
    cy.getByDataCy('plate-card').filter(':visible').first().click({ force: true })
    cy.url().should('match', /\/plato\/\d+/)
    
    cy.contains('button', /ordene ahora/i).click()
    cy.getByDataCy('add-to-cart-btn').click()

    // Verificar localStorage tiene el carrito
    cy.window().then((win) => {
      const cart = win.localStorage.getItem('cart')
      expect(cart).to.not.be.null
      const parsedCart = JSON.parse(cart!)
      expect(parsedCart).to.have.length(1)
    })

    // Recargar la página
    cy.reload()

    // El carrito debe persistir
    cy.visit('/carrito')
    cy.getByDataCy('cart-item').should('have.length', 1)
  })

  it('should allow adding multiple items to cart', () => {
    cy.visit('/menu')
    cy.waitForMenuLoad()

    // Agregar primer item
    cy.getByDataCy('plate-card').eq(0).click()
    cy.contains('button', /ordene ahora/i).click()
    cy.getByDataCy('add-to-cart-btn').click()

    // Volver al menú
    cy.visit('/menu')

    // Agregar segundo item
    cy.getByDataCy('plate-card').filter(':visible').eq(1).click({ force: true })
    cy.contains('button', /ordene ahora/i).click()
    cy.getByDataCy('add-to-cart-btn').click()

    // Verificar carrito
    cy.visit('/carrito')
    cy.getByDataCy('cart-item').should('have.length', 2)
  })

  it('should update item quantity in cart', () => {
    cy.visit('/menu')
    cy.waitForMenuLoad()
    
    // Agregar item
    cy.getByDataCy('plate-card').filter(':visible').first().click({ force: true })
    cy.contains('button', /ordene ahora/i).click()
    cy.getByDataCy('add-to-cart-btn').click()

    // Ir al carrito
    cy.visit('/carrito')

    // Incrementar cantidad
    cy.getByDataCy('increase-quantity-btn').first().click()

    // Verificar que la cantidad cambió
    cy.getByDataCy('item-quantity').first().should('contain', '2')
  })

  it('should remove item from cart', () => {
    cy.visit('/menu')
    cy.waitForMenuLoad()
    
    // Agregar item
    cy.getByDataCy('plate-card').filter(':visible').first().click({ force: true })
    cy.contains('button', /ordene ahora/i).click()
    cy.getByDataCy('add-to-cart-btn').click()

    // Ir al carrito
    cy.visit('/carrito')

    // Eliminar item
    cy.getByDataCy('remove-item-btn').first().click()

    // Verificar que el carrito está vacío
    cy.contains(/carrito está vacío|no hay items/i).should('exist')
  })
})
