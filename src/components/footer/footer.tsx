import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SocialMediaFooter = () => {
  // Função para abrir o link
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.container}>
         <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://www.facebook.com/poliedrocolegio')}
        >
          <FontAwesome name="mortar-board" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://www.facebook.com/poliedrocolegio')}
        >
          <FontAwesome name="facebook" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://www.youtube.com/poliedroeducacao')}
        >
          <FontAwesome name="youtube-play" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://www.instagram.com/poliedrocolegio/')}
        >
          <FontAwesome name="instagram" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://wa.me/5511994771469')}
        >
          <FontAwesome name="whatsapp" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => openLink('https://www.linkedin.com/school/poliedroeducacao/')}
        >
          <FontAwesome name="linkedin" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cafeInfo}>
        Cafeteria Nova Geração - Unidade Vila Mariana{'\n'}
        Rua Madre Cabrini, 38 - Vila Mariana / São Paulo - Térreo - Fundos
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FAA41F',
    alignItems: 'center',
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FAA41F',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(225,225,225,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cafeInfo: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
});

export default SocialMediaFooter;