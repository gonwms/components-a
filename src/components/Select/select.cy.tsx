/// <reference types="Cypress" />

import Select from './Select';

beforeEach(() => {
   cy.viewport(1280, 720)
})

it('uses custom text for the button label', () => {
   const options = ['queso', 'salsa']
   const name = 'hola'

   cy.mount(<Select options={options} title={name} />)

   cy.get('[data-testid="header"] p').should('have.text', name).click()

   cy.get('[data-testid="options"] p').each((option, i) => {
      cy.wrap(option).should('have.text', options[i])
   })
})
