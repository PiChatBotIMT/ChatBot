describe("Pedido pelo Chatbot", () => {
  it("Pedido simples com sucesso", () => {
    cy.visit("/chatbot");
    cy.contains("1 - Consultar cardápio");
    cy.contains("2 - Fazer pedido");
    cy.contains("3 - Visualizar histórico de pedidos");
    cy.get('input[placeholder="Digite sua mensagem..."]').type("2");
    cy.contains("Enviar").click();
    cy.contains("Qual será o seu pedido?");

    // Preenche o formulário de pedido
    cy.get('input[placeholder="Itens (ex: Pizza, Refrigerante)"]').type(
      "X-Burger, Coca-Cola"
    );
    cy.get('input[placeholder="Quantidade"]').type("1");
    cy.get("input").contains("Selecione o método de pagamento").click();
    cy.contains("Dinheiro").click();
    cy.get('textarea[placeholder="Adicione uma descrição"]').type("Sem cebola");
    cy.contains("Enviar Pedido").click();

    cy.contains("Pedido enviado com sucesso!");
  });

  it("Pedido personalizado com sucesso", () => {
    cy.visit("/chatbot");
    cy.get('input[placeholder="Digite sua mensagem..."]').type("2");
    cy.contains("Enviar").click();
    cy.contains("Qual será o seu pedido?");

    cy.get('input[placeholder="Itens (ex: Pizza, Refrigerante)"]').type(
      "Pão, Hambúrguer, Queijo, Alface, Tomate, Água"
    );
    cy.get('input[placeholder="Quantidade"]').type("1");
    cy.get("input").contains("Selecione o método de pagamento").click();
    cy.contains("Pix").click();
    cy.get('textarea[placeholder="Adicione uma descrição"]').type(
      "Montar lanche personalizado"
    );
    cy.contains("Enviar Pedido").click();

    cy.contains("Pedido enviado com sucesso!");
  });

  it("Pedido com item indisponível", () => {
    cy.visit("/chatbot");
    cy.get('input[placeholder="Digite sua mensagem..."]').type("1");
    cy.contains("Enviar").click();
    // Simule que o item está indisponível (depende da lógica do seu bot)
    cy.get('input[placeholder="Digite sua mensagem..."]').type(
      "Suco de Laranja"
    );
    cy.contains("Enviar").click();
    cy.contains("Ops! Suco de Laranja está indisponível no momento.");
    cy.contains("Aqui estão outras opções disponíveis:");
  });
});
