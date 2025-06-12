import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { API_URL } from "../../config/api";
import styles from "./pedidos.style";

// Componente de cartão de pedido
const PedidoCard = ({ pedido }: { pedido: any }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Pedido #{pedido._id.slice(-5)}</Text>

    {/* Nome do usuário */}
    <View style={styles.cardLine}>
      <Text style={styles.cardLabel}>Cliente:</Text>
      <Text style={styles.cardValue}>
        {pedido.nomeUsuario || "Não informado"}
      </Text>
    </View>

    <View style={styles.cardLine}>
      <Text style={styles.cardLabel}>Data:</Text>
      <Text style={styles.cardValue}>
        {new Date(pedido.data).toLocaleString()}
      </Text>
    </View>
    <View style={styles.cardLine}>
      <Text style={styles.cardLabel}>Método de Pagamento:</Text>
      <Text style={styles.cardValue}>{pedido.metodoPagamento}</Text>
    </View>
    <View style={styles.cardLine}>
      <Text style={styles.cardLabel}>Total:</Text>
      <Text style={styles.cardValue}>
        R$ {pedido.total?.toFixed(2) ?? "--"}
      </Text>
    </View>
    <View style={styles.cardLine}>
      <Text style={styles.cardLabel}>Itens:</Text>
    </View>
    {pedido.itens?.map((item: any, idx: number) => (
      <Text key={idx} style={styles.cardItem}>
        {item.nome} ({item.quantidade}){" "}
        {item.descricao ? `| ${item.descricao}` : ""}
      </Text>
    ))}
  </View>
);

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Usando API_URL da configuração centralizada
  const PEDIDOS_ENDPOINT = `${API_URL}/pedidos`;

  useEffect(() => {
    console.log(`Buscando pedidos no endpoint: ${PEDIDOS_ENDPOINT}`);

    axios
      .get<
        {
          _id: string;
          data: string;
          metodoPagamento: string;
          total: number;
          itens: { nome: string; quantidade: number; descricao?: string }[];
        }[]
      >(PEDIDOS_ENDPOINT)
      .then((res) => {
        setPedidos(res.data.reverse());
        console.log(`${res.data.length} pedidos encontrados`);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar pedidos:", error);
        setPedidos([]);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#007BFF" />
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pedidos Recebidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidos}>Nenhum pedido encontrado.</Text>
      ) : (
        pedidos.map((pedido) => <PedidoCard key={pedido._id} pedido={pedido} />)
      )}
    </ScrollView>
  );
};

export default Pedidos;
