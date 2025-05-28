const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "*", // Em ambiente de produção, especifique as origens permitidas
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Conexão com o MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

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

const Pedido = mongoose.model("Pedido", PedidoSchema);

// Rotas
app.get("/", (req, res) => {
  res.send("API do Chatbot está funcionando!");
});

// Rota para criar um pedido
app.post("/pedidos", async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    const pedidoSalvo = await novoPedido.save();
    res.status(201).json(pedidoSalvo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar o pedido" });
  }
});

// Rota para listar todos os pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os pedidos" });
  }
});
// Modelo de Usuário
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: { type: String },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.post("/registro", async (req, res) => {
  console.log("Requisição de registro recebida:", req.body);
  console.log("Headers:", req.headers);

  const { email, senha, nome } = req.body || {};

  console.log("Email recebido:", email);
  console.log("Senha recebida:", senha);
  console.log("Nome recebido:", nome);

  if (!email || !senha) {
    console.log("Email ou senha ausentes");
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      console.log("Usuário já existe:", email);
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const novoUsuario = new Usuario({ email, senha, nome });
    await novoUsuario.save();
    console.log("Usuário registrado com sucesso:", email);
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});
// Rota para login
app.post("/login", async (req, res) => {
  console.log("Requisição de login recebida:", req.body);
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email, senha });
    if (!usuario) {
      console.log(`Login falhou para email: ${email}`);
      return res.status(400).json({ error: "Credenciais inválidas" });
    }
    console.log(`Login bem-sucedido para email: ${email}`);
    res.status(200).json({
      message: "Login bem-sucedido",
      nome: usuario.nome, // Return the user's name
    });
  } catch (err) {
    console.error("Erro no processamento do login:", err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});
// Modelo de Item do Cardápio
const CardapioItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  categoria: String,
});

const CardapioItem = mongoose.model("CardapioItem", CardapioItemSchema);

// Rota para listar todos os itens do cardápio
app.get("/cardapio", async (req, res) => {
  try {
    console.log("Requisição para listar cardápio recebida");
    const itens = await CardapioItem.find();
    console.log("Enviando", itens.length, "itens do cardápio");
    res.json(itens);
  } catch (err) {
    console.error("Erro ao listar cardápio:", err);
    res.status(500).json({ error: "Erro ao listar os itens do cardápio" });
  }
});

const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const salvarImagemBase64 = (imagemBase64) => {
  // Verifica se a imagem é base64
  if (!imagemBase64 || !imagemBase64.startsWith("data:image")) {
    return null;
  }

  // Extrai tipo e dados da imagem
  const matches = imagemBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }

  // Obtém o tipo de imagem e os dados
  const tipo = matches[1];
  const dados = Buffer.from(matches[2], "base64");

  // Gera um nome de arquivo
  const extensao = tipo.split("/")[1];
  const nomeArquivo = `${Date.now()}.${extensao}`;
  const caminho = path.join("uploads", nomeArquivo);

  // Salva a imagem no sistema de arquivos
  fs.writeFileSync(caminho, dados);

  return `/uploads/${nomeArquivo}`;
};

app.post("/cardapio", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, imageBase64 } = req.body;
    console.log("Creating new menu item:", { name, description, price });
    console.log("File received via multer:", req.file);
    console.log(
      "Base64 image received:",
      imageBase64 ? "Yes (data omitted for brevity)" : "No"
    );

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    // Tenta primeiro usar a imagem do multer, depois o base64
    let image = "";
    if (req.file) {
      // Se tem arquivo via multer, usa ele
      image = `/uploads/${req.file.filename}`;
    } else if (imageBase64) {
      // Se tem imagem base64, salva ela
      image = salvarImagemBase64(imageBase64);
    }

    console.log("Image path to save:", image);

    const novoItem = new CardapioItem({
      name,
      description,
      price: Number(price),
      image,
    });

    const salvo = await novoItem.save();
    console.log("Item saved successfully:", salvo);
    res.status(201).json(salvo);
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    res.status(500).json({ error: "Erro ao adicionar item" });
  }
});

app.put("/cardapio/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, imageBase64 } = req.body;
    console.log(`Updating item ${req.params.id}:`, {
      name,
      description,
      price,
    });
    console.log("File received via multer:", req.file);
    console.log(
      "Base64 image received:",
      imageBase64 ? "Yes (data omitted for brevity)" : "No"
    );

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    const updateData = { name, description, price: Number(price) };

    // Tenta primeiro usar a imagem do multer, depois o base64
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageBase64) {
      updateData.image = salvarImagemBase64(imageBase64);
    }

    if (updateData.image) {
      console.log("New image path:", updateData.image);
    }

    const atualizado = await CardapioItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    console.log("Item updated successfully:", atualizado);
    res.status(200).json(atualizado);
  } catch (err) {
    console.error("Erro ao editar item:", err);
    res.status(500).json({ error: "Erro ao editar item" });
  }
});

// Remover item do cardápio
app.delete("/cardapio/:id", async (req, res) => {
  try {
    const removido = await CardapioItem.findByIdAndDelete(req.params.id);
    if (!removido) {
      return res.status(404).json({ error: "Item não encontrado" });
    }
    res.status(200).json({ message: "Item removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover item:", err);
    res.status(500).json({ error: "Erroea ao remover item" });
  }
});

// Rota para criar item com imagem

// Iniciar o servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);

  // Mostra os IPs disponíveis para acesso
  const { networkInterfaces } = require("os");
  const nets = networkInterfaces();

  console.log(`Acesso local: http://localhost:${PORT}`);
  console.log("Endereços para acesso de dispositivos móveis:");

  // Lista todos os IPs disponíveis
  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      // Mostra apenas endereços IPv4 e não-internos
      if (net.family === "IPv4" && !net.internal) {
        console.log(`- http://${net.address}:${PORT} (${name})`);
      }
    });
  });
});
