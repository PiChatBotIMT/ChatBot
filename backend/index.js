const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

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

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta  http://localhost:${PORT}`);
});