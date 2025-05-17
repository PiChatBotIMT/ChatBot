import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome } from '@expo/vector-icons';
import HomeMenu from '../../pages/home/home'; // Crie um componente só para o conteúdo da Home
import Profile from '../../pages/profile/profile'; // Exemplo de tela
import Settings from '../../pages/settings/settings'; // Exemplo de tela

const Drawer = createDrawerNavigator();

const AppDrawer: React.FC = () => (
  <Drawer.Navigator
  id={undefined}
    screenOptions={{
      headerShown: true,
      drawerStyle: {
        backgroundColor: '#FAA41F',
        width: 240,
      },
      drawerActiveTintColor: '#fff',
      drawerInactiveTintColor: '#000',
      drawerLabelStyle: {
        fontSize: 16,
      },
    }}
  >
    <Drawer.Screen
      name="Home"
      component={HomeMenu}
      options={{
        drawerIcon: ({ color, size }) => (
          <FontAwesome name="home" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={Profile}
      options={{
        drawerIcon: ({ color, size }) => (
          <FontAwesome name="user" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={Settings}
      options={{
        drawerIcon: ({ color, size }) => (
          <FontAwesome name="cog" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default AppDrawer;