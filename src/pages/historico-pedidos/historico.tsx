import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/api";
import styles from "./historico.styles";

interface Pedido {
  _id: string;
  itens: Array<{
    nome: string;
    preco: number;
    quantidade: number;
    descricao: string;
  }>;
  total: number;
  data: string;
  metodoPagamento: string;
}

const HistoricoPedidos: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const USER_AUTH_KEY = "@cantina_user_auth";

  useEffect(() => {
    checkAuthAndLoadPedidos();
  }, []);

  const checkAuthAndLoadPedidos = async () => {
    setLoading(true);
    try {
      // Verificar se o usuário está autenticado
      const userDataString = await AsyncStorage.getItem(USER_AUTH_KEY);

      if (!userDataString) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);

      if (!userData || !userData.isAuthenticated) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Buscar pedidos do usuário logado
      const userId = userData.userId;
      await fetchPedidosUsuario(userId);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosUsuario = async (userId: string) => {
    try {
      let apiBaseUrl = API_URL;
      // Configuração da URL base para desenvolvimento
      if (__DEV__) {
        apiBaseUrl =
          Platform.OS === "web"
            ? "http://localhost:5000"
            : "http://10.0.2.2:5000";
      }

      const response = await axios.get<Pedido[]>(
        `${apiBaseUrl}/pedidos/usuario/${userId}`
      );

      if (response.status === 200) {
        // Organiza pedidos do mais recente para o mais antigo
        const pedidosOrdenados = response.data.sort(
          (a: Pedido, b: Pedido) =>
            new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        setPedidos(pedidosOrdenados);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de pedidos:", error);
      setPedidos([]);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };

  const renderPedido = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      <Text style={styles.data}>Data: {formatarData(item.data)}</Text>
      <Text style={styles.itens}>
        Itens:{" "}
        {item.itens.map((i) => `${i.nome} (${i.quantidade}x)`).join(", ")}
      </Text>
      <Text style={styles.metodoPagamento}>
        Pagamento: {item.metodoPagamento}
      </Text>
      <Text style={styles.total}>Total: {formatarValor(item.total)}</Text>
    </View>
  );

  const renderLoginMessage = () => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>
        Você precisa estar logado para visualizar seu histórico de pedidos.
      </Text>
      <TouchableOpacity
        style={styles.buttonOrange}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Pedidos</Text>

      {!isAuthenticated ? (
        renderLoginMessage()
      ) : pedidos.length === 0 ? (
        <Text style={styles.emptyText}>
          Você ainda não realizou nenhum pedido.
        </Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item._id}
          renderItem={renderPedido}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default HistoricoPedidos;
