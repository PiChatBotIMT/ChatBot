import React from 'react';
import { View, Text, FlatList, Platform } from 'react-native';
import styles from './historico.styles';

interface Pedido {
  id: string;
  data: string;
  itens: string[];
  total: string;
}

const pedidos: Pedido[] = [
  { id: '1', data: '2023-10-01', itens: ['Coxinha', 'Suco'], total: 'R$ 15,00' },
  { id: '2', data: '2023-10-02', itens: ['Pão de Queijo', 'Café'], total: 'R$ 10,00' },
  { id: '3', data: '2023-10-03', itens: ['Sanduíche', 'Refrigerante'], total: 'R$ 20,00' },
];

const HistoricoPedidos: React.FC = () => {
  const renderPedido = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      <Text style={styles.data}>Dia {item.data}</Text>
      <Text style={styles.itens}>Itens pedidos:</Text>
      <View style={styles.itemList}>
        {item.itens.map((i, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itens}>• {i}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.total}>Total: {item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.breadcrumb}>
          {Platform.OS === 'web' ? 'Home' : ''}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Histórico de Pedidos</Text>
        <Text style={styles.subtitle}>
          Aqui você pode visualizar o histórico dos pedidos
        </Text>

        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
          }
        />
      </View>
    </View>
  );
};

export default HistoricoPedidos;