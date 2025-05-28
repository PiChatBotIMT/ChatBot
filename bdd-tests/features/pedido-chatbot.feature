Feature: Realizar pedido via chatbot

  Como aluno usuário do sistema
  Quero fazer um pedido de lanche pelo chatbot
  Para que meu pedido seja enviado ao restaurante do colégio

  Scenario: Usuário faz um pedido simples com sucesso
    Given que o usuário acessa o chatbot
    When o chatbot exibe o cardápio
    And o usuário escolhe "X-Burger" e "Coca-Cola"
    And confirma o pedido
    Then o sistema registra o pedido com sucesso
    And exibe a mensagem "Pedido realizado! Retire no balcão em breve."

  Scenario: Usuário monta seu próprio lanche e faz pedido
    Given que o usuário acessa o chatbot
    When o chatbot oferece a opção "Montar seu próprio lanche"
    And o usuário escolhe "Pão + Hambúrguer + Queijo + Alface + Tomate"
    And adiciona uma "Água"
    And confirma o pedido
    Then o sistema registra o pedido com sucesso
    And exibe a mensagem "Pedido realizado! Retire no balcão em breve."

  Scenario: Pedido com item indisponível
    Given que o usuário acessa o chatbot
    When o chatbot exibe o cardápio
    And o usuário tenta pedir "Suco de Laranja"
    And o item está indisponível
    Then o chatbot responde "Ops! Suco de Laranja está indisponível no momento."
    And oferece as opções alternativas do cardápio