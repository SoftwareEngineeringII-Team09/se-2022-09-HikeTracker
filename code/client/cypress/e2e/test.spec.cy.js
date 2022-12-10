describe('Coverage test', () => {

    it('Tests coverage', () => {
        cy.visit('/coverage');
        cy.get('button').contains("Test coverage").click();
    });
});