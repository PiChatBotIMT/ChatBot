import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import styles from './pedidos.style'

const API_URL = __DEV__ ? 'http://localhost:5000/pedidos' : 'http://SEU_IP:5000/pedidos'; // Troque SEU_IP se for físico

const PedidoCard = ({ pedido }: { pedido: any }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Pedido #{pedido._id.slice(-5)}</Text>
    <Text style={styles.cardSubtitle}>Data: {new Date(pedido.data).toLocaleString()}</Text>
    <Text style={styles.cardSubtitle}>Método de Pagamento: {pedido.metodoPagamento}</Text>
    <Text style={styles.cardSubtitle}>Total: R$ {pedido.total?.toFixed(2) ?? '--'}</Text>
    <Text style={styles.cardSubtitle}>Itens:</Text>
    {pedido.itens?.map((item: any, idx: number) => (
      <Text key={idx} style={styles.cardItem}>
        - {item.nome} ({item.quantidade}) {item.descricao ? `- ${item.descricao}` : ''}
      </Text>
    ))}
  </View>
);

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<{ _id: string; data: string; metodoPagamento: string; total: number; itens: { nome: string; quantidade: number; descricao?: string }[] }[]>(API_URL)
      .then(res => setPedidos(res.data.reverse()))
      .catch(() => setPedidos([]))
      .then(() => {}, () => {}).then(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007BFF" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pedidos Recebidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidos}>Nenhum pedido encontrado.</Text>
      ) : (
        pedidos.map(pedido => <PedidoCard key={pedido._id} pedido={pedido} />)
      )}
    </ScrollView>
  );
};



export default Pedidos;