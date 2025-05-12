import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// Telas de exemplo
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Profile Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Settings Screen</Text>
  </View>
);

// Configuração do Drawer Navigator
const Drawer = createDrawerNavigator();

const SideBar: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator id={undefined}
        screenOptions={{
          headerShown: true, // Mostra o cabeçalho
          drawerStyle: {
            backgroundColor: '#FAA41F', // Cor de fundo do menu lateral
            width: 240, // Largura do menu lateral
          },
          drawerActiveTintColor: '#fff', // Cor do texto ativo
          drawerInactiveTintColor: '#000', // Cor do texto inativo
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SideBar;