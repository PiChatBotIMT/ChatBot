import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 15, marginBottom: 2 },
  cardItem: { fontSize: 14, marginLeft: 8 },
  noPedidos: { fontSize: 16, color: '#888', marginTop: 32 },
});

export default styles;