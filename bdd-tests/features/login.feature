Feature: Login no sistema

  Como usuário do sistema
  Quero fazer login com meu e-mail e senha
  Para acessar meu ambiente conforme meu perfil

  Scenario: Usuário comum faz login com sucesso
    Given que o usuário está na tela de login
    When ele preenche e-mail válido e senha válida de usuário
    And clica no botão "Entrar"
    Then ele deve ser redirecionado para a tela inicial de usuário
    And deve ver as opções "Chatbot", "Cardápio" e "Histórico de Pedidos"

  Scenario: Admin faz login com sucesso
    Given que o admin está na tela de login
    When ele preenche e-mail válido e senha válida de admin
    And clica no botão "Entrar"
    Then ele deve ser redirecionado para a tela de administração
    And deve ver as opções "Pedidos" e "Gerenciar Cardápio"

  Scenario: Login com dados incorretos
    Given que o usuário está na tela de login
    When ele preenche e-mail ou senha incorretos
    And clica no botão "Entrar"
    Then ele deve ver uma mensagem de erro "E-mail ou senha inválidos"
    And permanece na tela de login