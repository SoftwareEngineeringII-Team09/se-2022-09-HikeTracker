describe('Coverage test', () => {

    it('Tests coverage', () => {
        cy.visit('/coverage2');
        cy.get('button').contains("Test coverage").click();
    });
});