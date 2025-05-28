describe("Login Feature", () => {
  it("Usuário comum faz login com sucesso", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Digite seu email"]').type("usuario@teste.com");
    cy.get('input[placeholder="Digite sua senha"]').type("senha123");
    cy.contains("Entrar").click();
    cy.url().should("include", "/home");
    cy.contains("Chatbot");
    cy.contains("Cardápio");
    cy.contains("Histórico de Pedidos");
  });

  it("Admin faz login com sucesso", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Digite seu email"]').type("admin@admin.com");
    cy.get('input[placeholder="Digite sua senha"]').type("admin123");
    cy.contains("Entrar").click();
    cy.url().should("include", "/home");
    cy.contains("Pedidos");
    cy.contains("Gerenciar Cardápio");
  });

  it("Login com dados incorretos", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Digite seu email"]').type("usuario@teste.com");
    cy.get('input[placeholder="Digite sua senha"]').type("senhaerrada");
    cy.contains("Entrar").click();
    cy.contains("E-mail ou senha inválidos");
    cy.url().should("include", "/login");
  });
});
