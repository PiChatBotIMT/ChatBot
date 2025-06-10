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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'monospace', // fonte tipo máquina de escrever, nativa
    

  },
  chatButton: {
    backgroundColor: '#fff',
    borderColor: '#FAA41F',
    borderWidth: 1.5,
    borderRadius: 40,
    paddingVertical: 20,
  paddingHorizontal: '10%',
    marginBottom: 15,
    shadowColor: '#FAA41F',      // sombra amarela
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,          // mais opaca
    shadowRadius: 12,             // mais espalhada
    elevation: 8, 
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'monospace', // fonte tipo máquina de escrever, nativa
    letterSpacing: -0.5, // diminui o espaçamento entre as letras


  },
card: {
  backgroundColor: '#fff',
  // borderColor: '#FAA41F',
  // borderWidth: 1.5,
  width: '28%', // exemplo para deixar mais quadrado
  borderRadius: 10,
  paddingVertical: 40,
  paddingHorizontal: '20%',
  marginVertical: 8,
  alignItems: 'center',
  shadowColor: '#FAA41F',      // sombra amarela
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,          // mais opaca
  shadowRadius: 12,             // mais espalhada
  elevation: 8,                // mais forte no Android
},
  cardIcon: {
    width: 26,
    height: 26,
    marginBottom: 8,
    
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace', // fonte tipo máquina de escrever, nativa
    letterSpacing: -0.5, // diminui o espaçamento entre as letras


  },
});
