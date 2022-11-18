/// <reference types="Cypress" />

//CONST
const mock = [
   {
      orden: '1',
      id: '000096',
      projects: 'Blue',
      client: 'Oyondu',
      status: 'draft',
   },
   {
      orden: '2',
      id: '000097',
      projects: 'green',
      client: 'Jetpulse',
      status: 'pending',
   },
   {
      orden: '3',
      id: '000098',
      projects: 'red',
      client: 'Cogibox',
      status: 'paid',
   },
]
const mockKeys = Object.keys(mock[0])

beforeEach(() => {
   cy.viewport(1280, 720)
})

describe('Table', () => {
   beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.intercept('get', '/API/invoices.json', {
         statusCode: 200,
         body: mock,
      })
   })

   it('Should render columns count equal to "mock" + 2', () => {
      const totalColumns = mockKeys.length + 2

      cy.get('table th').should('have.length', totalColumns)
   })

   it('Should render a total of N rows * (N columns + 2)', () => {
      const totalTD = mock.length * (mockKeys.length + 2)

      cy.get('tbody td').should('have.length', totalTD)
   })

   it('Should render the correct table headings', () => {
      cy.get('thead th').each((heding, i) => {
         if (i === 0) {
            cy.wrap(heding).should('contain.html', '<input type="checkbox">')
         } else if (i === mockKeys.length + 1) {
            cy.wrap(heding).should('contain.text', 'delete')
         } else {
            cy.wrap(heding).should('have.text', mockKeys[i - 1])
         }
      })
   })

   it('Should render the correct table data', () => {
      const firstColumData = Object.values(mock[0])
      const secondColumData = Object.values(mock[1])

      cy.get('tbody tr')
         .eq(0)
         .within(() => {
            cy.get('td').each((cell, i) => {
               if (i !== 0 && i !== mockKeys.length + 1) {
                  cy.wrap(cell).should('have.text', firstColumData[i - 1])
               }
            })
         })
      cy.get('tbody tr')
         .eq(1)
         .within(() => {
            cy.get('td').each((cell, i) => {
               if (i !== 0 && i !== mockKeys.length + 1) {
                  cy.wrap(cell).should('have.text', secondColumData[i - 1])
               }
            })
         })
   })
   it('should select multiples rows holding shift', () => {
      cy.get('table input[type="checkbox"]').then((checkbox) => {
         cy.wrap(checkbox).eq(1).click()
         cy.wrap(checkbox).eq(3).click({ shiftKey: true })
      })
      cy.get('table input[type="checkbox"]').each((cb) => {
         cy.wrap(cb).should('be.checked')
      })
   })
   it('should unselect multiples rows holding shift', () => {
      cy.get('table input[type="checkbox"]').then((checkbox) => {
         cy.wrap(checkbox).eq(1).click()
         cy.wrap(checkbox).eq(3).click({ shiftKey: true })
         cy.wrap(checkbox).eq(1).click()
         cy.wrap(checkbox).eq(3).click({ shiftKey: true })
      })
      cy.get('table input[type="checkbox"]').each((cb) => {
         cy.wrap(cb).should('not.be.checked') // NO SIRVE ESTO
      })
   })
})

describe('test dropwdown', () => {
   it('should have ddName', () => {
      const ddName = /salsa/i

      cy.get('[data-testid=dropdown]').within(() => {
         cy.get('[data-testid=header] p').invoke('text').should('match', ddName)
      })
   })

   it('should have options', () => {
      const ddOptions = [
         'Lorem ipsum',
         'dolor sit amet',
         'consectetur',
         'adipisicing',
      ]

      cy.get('[data-testid=dropdown]')
         .click()
         .within(() => {
            cy.get('[data-testid=options] p').each((op, i) => {
               cy.wrap(op).should('have.text', ddOptions[i])
            })
         })
   })

   it('should filter options', () => {
      cy.get('[data-testid=dropdown]').within(() => {
         cy.get('[data-testid=options] p').should('have.length', 4)
         cy.get('input').type('d')
         cy.get('[data-testid=options] p').should('have.length', 2)
      })
   })
})
