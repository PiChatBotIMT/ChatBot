import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Home({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>piSwen</Text>
        </View>
        
        <View style={styles.middleButtonsContainer}>
          <View style={styles.middleButtons}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>Browse</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to piSwen</Text>
        <Text style={styles.subtitle}>Your streaming platform for everything</Text>
        
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 piSwen. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    paddingVertical: Platform.OS === 'web' ? 15 : 20, // Mais espaço no celular
    paddingHorizontal: 20,
    // Adiciona margem superior apenas para dispositivos móveis
    marginTop: Platform.OS === 'web' ? 0 : 40,
    // Ajusta a altura do header especificamente para mobile
    height: Platform.OS === 'web' ? 'auto' : 70,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  middleButtonsContainer: {
    flex: 2,
    alignItems: 'center', // Centraliza na dimensão vertical
    justifyContent: 'center', // Centraliza na dimensão horizontal
  },
  middleButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Reduz a largura em dispositivos web para melhorar a centralização
    width: Platform.OS === 'web' ? '80%' : '100%',
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10, // Espaçamento uniforme entre botões
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', // Garante que o texto fique centralizado
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#333',
    padding: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  footerLink: {
    color: '#aaa',
    fontSize: 14,
  }
});