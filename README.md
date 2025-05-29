<div style="font-family: Arial, sans-serif; line-height: 1.6;">

  <h1>🤖 ChatBot – Projeto PII</h1>
  <h3>Repositório do grupo de Projeto Integrador Interdisciplinar (PII)</h3>
  <p>📍 <strong>3º Semestre - Sistemas de Informação - Instituto Mauá de Tecnologia</strong></p>

  <hr>

  <h2>📘 Sobre o Projeto</h2>
  <p>
    O objetivo deste projeto é desenvolver um <strong>ChatBot multiplataforma</strong> para atendimento em cantinas,
    integrando funcionalidades modernas como pedidos inteligentes, histórico personalizado e administração eficiente.
    <br>
    Este projeto é realizado pelo <strong>Instituto de Engenharia</strong> com apoio do <strong>Instituto Mauá de Tecnologia</strong>.
  </p>

  <hr>

  <h2>👥 Integrantes do Grupo</h2>
  <table border="1" cellspacing="0" cellpadding="8">
    <thead>
      <tr>
        <th>Nome</th>
        <th>RA</th>
        <th>Função</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Carol Emoto</td><td>22.00086-0</td><td>Desenvolvedora</td></tr>
      <tr><td>Gabriel Ferrassini</td><td>24.00918-0</td><td>Desenvolvedor</td></tr>
      <tr><td>Giovanna Albuquerque</td><td>24.01460-5</td><td>Desenvolvedora</td></tr>
      <tr><td>Isabella Passarelli</td><td>24.00038-8</td><td>Desenvolvedora</td></tr>
      <tr><td>Murilo Kaspar</td><td>24.01178-9</td><td>Desenvolvedor</td></tr>
    </tbody>
  </table>

  <hr>

  <h2>🛠️ Funcionalidades</h2>

  <h3>🤖 Interface de ChatBot</h3>
  <ul>
    <li>Conversação natural com comandos de texto</li>
    <li>Respostas contextuais baseadas no histórico</li>
    <li>Persistência de mensagens locais</li>
  </ul>

  <h3>🍔 Gerenciamento de Cardápio</h3>
  <ul>
    <li>Visualização completa de itens com preços e categorias</li>
    <li>Filtro por categoria (bebidas, doces, salgados etc.)</li>
    <li>Detalhamento completo de cada item</li>
  </ul>

  <h3>🛒 Sistema de Pedidos</h3>
  <ul>
    <li>Seleção e ajuste de itens no carrinho</li>
    <li>Observações personalizadas por item</li>
    <li>Cálculo automático de total</li>
    <li>Suporte a múltiplas formas de pagamento (dinheiro, cartão, PIX)</li>
  </ul>

  <h3>📊 Histórico de Pedidos</h3>
  <ul>
    <li>Exibição cronológica dos pedidos</li>
    <li>Detalhes completos de cada pedido</li>
    <li>Histórico separado por usuário</li>
  </ul>

  <h3>👤 Autenticação e Perfil</h3>
  <ul>
    <li>Registro e login de usuários</li>
    <li>Perfil com preferências salvas</li>
    <li>Painel exclusivo para administradores</li>
  </ul>

  <h3>🔄 Fluxo de Pedido Guiado</h3>
  <ul>
    <li>Etapas orientadas para o usuário</li>
    <li>Confirmações intermediárias para evitar erros</li>
    <li>Resumo final antes da conclusão</li>
  </ul>

  <h3>📱 Compatibilidade Multiplataforma</h3>
  <ul>
    <li>Interface responsiva e adaptável</li>
    <li>Suporte completo para mobile e desktop</li>
  </ul>

  <h3>⚙️ Funcionalidades Administrativas</h3>
  <ul>
    <li>Gerenciamento de cardápio (CRUD de itens)</li>
    <li>Acompanhamento de pedidos em tempo real</li>
    <li>Controle de contas e permissões</li>
  </ul>

  <h3>🔒 Segurança de Dados</h3>
  <ul>
    <li>Armazenamento seguro de informações</li>
    <li>Validação de entradas para prevenção de vulnerabilidades</li>
    <li>Sessões autenticadas com persistência</li>
  </ul>

  <hr>

  <h2>💻 Tecnologias Utilizadas</h2>

  <h3>Frontend</h3>
  <ul>
    <li><strong>Web:</strong> React.js</li>
    <li><strong>Mobile:</strong> React Native + Expo Go</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li><strong>Linguagem:</strong> Node.js</li>
    <li><strong>Banco de Dados:</strong> MongoDB (NoSQL)</li>
  </ul>
  <hr>

<h2>🚀 Como Executar o Projeto</h2>

<h3>📋 Pré-requisitos</h3>
<ul>
  <li>Node.js (v14.0.0 ou superior)</li>
  <li>NPM ou Yarn</li>
  <li>MongoDB (local ou Atlas)</li>
  <li>Expo CLI (para versão mobile)</li>
</ul>

<h3>⚙️ Configuração do Ambiente</h3>

<h4>1. Clone o repositório</h4>

```bash
git clone https://github.com/seu-usuario/chatbot-cantina.git
cd chatbot-cantina

```

# Instalar dependências do backend

cd backend
npm install

# Instalar dependências do frontend

cd ../src
npm install

# Configurando o .env

<h4>3. Configure as variáveis de ambiente</h4>
 <p>Crie um arquivo <code>.env</code>
  na pasta backend com as seguintes variáveis:</p>

```bash
PORT=5000
MONGODB_URI=sua_conexao_mongodb
JWT_SECRET=seu_secret_jwt
```

<h3>▶️ Executando a Aplicação</h3> 
<h4>Backend</h4>

```bash
cd backend
node index.js
```

<h4>Frontend Web</h4>

```bash
npm run start
```

## 🧪 Testes BDD

Este projeto utiliza testes BDD para validar as principais funcionalidades do sistema, como login e pedidos via chatbot.

### Funcionalidades testadas

- Login (usuário comum e admin)
- Realizar pedido via Chatbot

### Estrutura dos testes

- `bdd-tests/features/`: Cenários escritos em Gherkin (`.feature`)
- `bdd-tests/steps/`: Scripts de teste automatizados (mock/simulado, usando Cypress)

### Como executar os testes (Exemplo usando Cypress)

1. Instale as dependências do Cypress:
   ```bash
   npm install cypress
   ```
   </div>
