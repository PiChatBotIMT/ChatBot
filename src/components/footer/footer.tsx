import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SocialMediaFooter = () => {
  // Função para abrir o link
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openLink('https://www.facebook.com')}
      >
        <FontAwesome name="facebook" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openLink('https://www.youtube.com')}
      >
        <FontAwesome name="youtube-play" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openLink('https://www.instagram.com')}
      >
        <FontAwesome name="instagram" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openLink('https://www.whatsapp.com')}
      >
        <FontAwesome name="whatsapp" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openLink('https://www.linkedin.com')}
      >
        <FontAwesome name="linkedin" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FAA41F',
  },
  iconButton: {
    width: 40, // Largura do botão
    height: 40, // Altura do botão
    borderRadius: 25, // Torna o botão redondo
    backgroundColor: 'rgba(225,225,225,0.2)', // Cor de fundo do botão
    justifyContent: 'center', // Centraliza o ícone verticalmente
    alignItems: 'center', // Centraliza o ícone horizontalmente
    marginHorizontal: 5, // Espaçamento entre os botões

    // Sombra para iOS
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra

    // Sombra para Android
    elevation: 5, // Elevação para criar sombra
  },
});

export default SocialMediaFooter;