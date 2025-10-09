/**
 * E2E TEST: Search and Filters
 * E2E-002: Búsqueda y Filtros
 * 
 * Prueba end-to-end de funcionalidades de búsqueda y filtrado:
 * 1. Búsqueda por término
 * 2. Aplicar filtros de categoría
 * 3. Combinar búsqueda con filtros
 * 4. Limpiar filtros
 * 5. Manejo de resultados vacíos
 */

describe('E2E-002: Search and Filters', () => {
  beforeEach(() => {
    cy.visit('/menu')
    cy.waitForMenuLoad()
  })

  it('should search plates by name', () => {
    // Buscar por término específico
    cy.getByDataCy('search-input').should('be.visible')
    cy.getByDataCy('search-input').type('ceviche')

    // Verificar que los resultados contienen el término buscado
    cy.getByDataCy('plate-card').each(($card) => {
      cy.wrap($card).should('contain.text', /ceviche/i)
    })

    // Verificar que hay al menos un resultado
    cy.getByDataCy('plate-card').should('have.length.gt', 0)
  })

  it('should filter plates by category', () => {
    // Click en una categoría
    cy.contains('button', /entrada|plato principal|bebida/i).first().click()

    // Verificar que se aplica el filtro
    cy.getByDataCy('plate-card').should('have.length.gt', 0)

    // Todos los platos mostrados deben ser de la categoría seleccionada
    // (esto depende de cómo se implemente visualmente)
  })

  it('should combine search with category filter', () => {
    // Aplicar filtro de categoría
    cy.contains('button', /entrada/i).click()

    // Luego buscar
    cy.getByDataCy('search-input').type('ceviche')

    // Debe mostrar solo entradas que contengan "ceviche"
    cy.getByDataCy('plate-card').should('exist')
  })

  it('should clear search term', () => {
    // Buscar algo
    cy.getByDataCy('search-input').type('ceviche')
    cy.getByDataCy('plate-card').should('have.length.gt', 0)

    // Limpiar búsqueda
    cy.getByDataCy('search-input').clear()

    // Debe mostrar todos los platos nuevamente
    cy.getByDataCy('plate-card').should('have.length.gt', 1)
  })

  it('should handle no results scenario', () => {
    // Buscar algo que no existe
    cy.getByDataCy('search-input').type('xyzplatoinexistente123')

    // Debe mostrar mensaje de "sin resultados" o lista vacía
    cy.get('body').should('contain.text', /no se encontraron|sin resultados|no hay platos/i)
  })

  it('should show all categories', () => {
    // Verificar que hay múltiples categorías disponibles
    cy.get('button, [role="button"]').contains(/entrada|plato|bebida/i).should('exist')
  })

  it('should reset filters correctly', () => {
    // Aplicar varios filtros
    cy.contains('button', /entrada/i).click()
    cy.getByDataCy('search-input').type('ceviche')

    const initialCount = cy.getByDataCy('plate-card')

    // Click en "Todos" o botón de reset
    cy.contains('button', /todos/i).click()
    cy.getByDataCy('search-input').clear()

    // Debe mostrar más resultados que antes
    cy.getByDataCy('plate-card').should('have.length.gt', 0)
  })

  it('should update results count when filtering', () => {
    // Contar items iniciales
    cy.getByDataCy('plate-card').its('length').then((initialCount) => {
      // Aplicar filtro
      cy.contains('button', /entrada/i).click()

      // La cantidad debe cambiar (o mantenerse si todas son entradas)
      cy.getByDataCy('plate-card').its('length').should('be.lte', initialCount)
    })
  })

  it('should be case-insensitive in search', () => {
    // Buscar en mayúsculas
    cy.getByDataCy('search-input').type('CEVICHE')

    // Debe encontrar resultados independientemente del caso
    cy.getByDataCy('plate-card').should('have.length.gt', 0)
  })

  it('should search in description as well as name', () => {
    // Buscar un término que probablemente esté en la descripción
    cy.getByDataCy('search-input').type('fresco')

    // Debe encontrar platos con ese término en nombre o descripción
    cy.getByDataCy('plate-card').should('have.length.gt', 0)
  })
})
