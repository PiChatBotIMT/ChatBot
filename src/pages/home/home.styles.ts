import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  botIcon: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  chatButton: {
    backgroundColor: '#fff',
    borderColor: '#f9a825',
    borderWidth: 1.5,
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 150,
    marginBottom: 15,
  shadowColor: '#FAA41F',      // sombra amarela
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,          // mais opaca
  shadowRadius: 8,             // mais espalhada
  elevation: 8, 
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
card: {
  backgroundColor: '#fff',
  width: '28%', // exemplo para deixar mais quadrado
  borderRadius: 10,
  paddingVertical: 40,
  paddingHorizontal: 8,
  marginVertical: 8,
  alignItems: 'center',
  shadowColor: '#FAA41F',      // sombra amarela
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,          // mais opaca
  shadowRadius: 8,             // mais espalhada
  elevation: 8,                // mais forte no Android
},
  cardIcon: {
    width: 26,
    height: 26,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
});
