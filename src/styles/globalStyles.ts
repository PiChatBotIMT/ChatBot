import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 20 : 10, // Diferenciação para web e mobile
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: width > 600 ? 24 : 16, // Ajusta o tamanho do texto com base na largura da tela
    color: '#333',
  },
});