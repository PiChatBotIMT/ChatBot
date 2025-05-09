const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',  // Em ambiente de produção, especifique as origens permitidas
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));app.use(bodyParser.json());

// Conexão com o MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Pedido
const PedidoSchema = new mongoose.Schema({
    itens: [
        {
            nome: String,
            preco: Number,
            quantidade: Number,
            descricao: String,
        },
    ],
    metodoPagamento: String,
    total: Number,
    data: { type: Date, default: Date.now },
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

// Rotas
app.get('/', (req, res) => {
    res.send('API do Chatbot está funcionando!');
});

// Rota para criar um pedido
app.post('/pedidos', async (req, res) => {
    try {
        const novoPedido = new Pedido(req.body);
        const pedidoSalvo = await novoPedido.save();
        res.status(201).json(pedidoSalvo);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar o pedido' });
    }
});

// Rota para listar todos os pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar os pedidos' });
    }
});
// Modelo de Usuário
const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

app.post('/registro', async (req, res) => {
    console.log('Requisição de registro recebida:', req.body);
    console.log('Headers:', req.headers);
    
    const { email, senha } = req.body || {};
    
    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha);
    
    if (!email || !senha) {
        console.log('Email ou senha ausentes');
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            console.log('Usuário já existe:', email);
            return res.status(400).json({ error: 'Usuário já existe' });
        }
        
        const novoUsuario = new Usuario({ email, senha });
        await novoUsuario.save();
        console.log('Usuário registrado com sucesso:', email);
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});
// Rota para login
app.post('/login', async (req, res) => {
    console.log('Requisição de login recebida:', req.body);
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email, senha });
        if (!usuario) {
            console.log(`Login falhou para email: ${email}`);
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }
        console.log(`Login bem-sucedido para email: ${email}`);
        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (err) {
        console.error('Erro no processamento do login:', err);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta  http://localhost:${PORT}`);
});