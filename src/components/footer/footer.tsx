import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SocialMediaFooter = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="facebook" size={30} color="#4267B2" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="twitter" size={30} color="#1DA1F2" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="instagram" size={30} color="#E1306C" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  iconButton: {
    padding: 10,
  },
});

export default SocialMediaFooter;