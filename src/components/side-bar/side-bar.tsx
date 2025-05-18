import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import HomeMenu from "../../pages/home/home";
import Cardapio from "../../pages/cardapio/cardapio";
import HistoricoPedidos from "../../pages/historico-pedidos/historico";
import Chatbot from "../../pages/chat/chatBot";
import Login from "../../pages/login/login";
import Pedidos from "../../pages/visu-pedidos/pedidos";

type User = { email: string; isAdmin: boolean } | null;

const Drawer = createDrawerNavigator();

const AppDrawer: React.FC<{
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  user: User;
}> = ({ isAdmin, setUser, user }) => {
  return (
    <Drawer.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#FAA41F",
          width: 240,
        },
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#000",
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
        name="Cardapio"
        component={Cardapio}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="file" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Historico de Pedidos"
        component={HistoricoPedidos}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chatbot"
        component={Chatbot}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="comment" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      {/* Adicione a tela de Pedidos apenas se for admin */}
      {isAdmin ? (
        <Drawer.Screen
          name="Pedidos"
          component={Pedidos}
          options={{
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />
      ) : null}
    </Drawer.Navigator>
  );
};

export default AppDrawer;
