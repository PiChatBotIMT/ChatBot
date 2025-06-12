import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Chatbot from "../chat/chatBot";
import styles from "./home.styles";
import Cardapio from "../cardapio/cardapio";
import HistoricoPedidos from "../historico-pedidos/historico";
import Login from "../login/login";
import Pedidos from "../visu-pedidos/pedidos";
import SocialMediaFooter from "../../components/footer/footer";
import { Ionicons } from "@expo/vector-icons";
import {
  CommonActions,
  useNavigation,
  NavigationProp,
  useRoute,
  useNavigationState,
  useFocusEffect,
} from "@react-navigation/native";

type RootStackParamList = {
  HomeMenu: undefined;
  Chatbot: undefined;
  Cardapio: undefined;
  HistoricoPedidos: undefined;
  Login: undefined;
  Pedidos: undefined;
};

const Stack = createStackNavigator();

const Breadcrumb = ({ navigation, route }) => {
  const routes = navigation.getState().routes;
  const currentRouteIndex = routes.findIndex((r) => r.name === route.name);

  if (currentRouteIndex <= 0) {
    return null; // Don't render anything on the home page
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "#ffffff",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("HomeMenu")}>
        <Text style={{ color: "#007BFF", fontSize: 14 }}>Home</Text>
      </TouchableOpacity>
      <Text style={{ marginHorizontal: 5, color: "#666" }}> {"/"} </Text>
      <Text style={{ fontWeight: "bold", fontSize: 14 }}>{route.name}</Text>
    </View>
  );
};
const HomeMenu: React.FC<{ navigation: any; isAdmin: boolean }> = ({
  navigation,
  isAdmin,
}) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image
          source={require("../../image/bot-icon.png")}
          style={styles.botIcon}
          resizeMode="contain"
        />

        <Text style={styles.welcomeText}>Bem-Vindo ao Restaurante</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("Chatbot")}
        >
          <Text style={styles.chatButtonText}>Como posso ajudar?</Text>
        </TouchableOpacity>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Cardapio")}
          >
            <Image
              source={require("../../image/cardapio(2).png")}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Cardápio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("HistoricoPedidos")}
          >
            <Image
              source={require("../../image/relogio.png")}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Histórico</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Pedidos")}
            >
              <Image
                source={require("../../image/pedido.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Pedidos</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export { HomeMenu };

const ScreenWithBreadcrumb = ({ children, navigation, route }) => {
  return (
    <View style={{ flex: 1 }}>
      <Breadcrumb navigation={navigation} route={route} />
      {children}
    </View>
  );
};

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<{
    email: string;
    isAdmin: boolean;
    nome?: string;
  } | null>(null);
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("@cantina_user_auth").then((data) => {
        if (data) setUser(JSON.parse(data));
        else setUser(null);
      });
    }, [])
  );

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@cantina_user_auth");
      setUser(null);
      navigation.navigate("HomeMenu");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  // Pegue o nome da rota ativa do stack
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes || typeof state.index !== "number") return "";
    const route = state.routes[state.index];
    return route?.name || "";
  });
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        id={undefined}
        initialRouteName="HomeMenu"
        screenOptions={({ navigation, route }) => ({
          headerLeft: () => {
            return (
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../image/logo-poliedro.png")}
                  style={{ width: 120, height: 70, resizeMode: "contain" }}
                />
                {route.name !== "HomeMenu" && (
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.goBack()}
                  ></TouchableOpacity>
                )}
              </View>
            );
          },
          headerTitle: () => null,

          headerRight: () =>
            user ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    color: "#f9f9f9",
                    fontSize: Platform.OS === "web" ? 16 : 12,
                    display: Platform.OS === "web" ? "flex" : "none",
                  }}
                >
                  Bem-vindo, {user.nome || "Usuário"}
                </Text>
                <Ionicons name="person-circle" size={24} color="#f9f9f9" />
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={handleLogout}
                >
                  <Text
                    style={{
                      color: "red",
                      fontSize: Platform.OS === "web" ? 16 : 14,
                    }}
                  >
                    Sair
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 15,
                }}
                onPress={() => navigation.navigate("Login")}
              >
                <Ionicons name="person-outline" size={24} color="#f9f9f9" />
                <Text style={{ color: "#f9f9f9", fontSize: 16, marginLeft: 5 }}>
                  Login
                </Text>
              </TouchableOpacity>
            ),
          headerStyle: {
            backgroundColor: "#FAA41F",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleAlign: "center",
          headerMode: "float",
          cardStyle: { backgroundColor: "#f5f5f5" },
        })}
      >
        <Stack.Screen name="HomeMenu" options={{}}>
          {(props) => (
            <HomeMenu
              {...props}
              isAdmin={user?.isAdmin ?? false}
              key={user?.isAdmin ? "admin" : "user"}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chatbot" options={{ title: "ChatBot" }}>
          {(props) => (
            <ScreenWithBreadcrumb {...props}>
              <Chatbot />
            </ScreenWithBreadcrumb>
          )}
        </Stack.Screen>

        <Stack.Screen name="Cardapio" options={{ title: "Cardapio" }}>
          {(props) => (
            <ScreenWithBreadcrumb {...props}>
              <Cardapio isAdmin={user?.isAdmin ?? false} />
            </ScreenWithBreadcrumb>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="HistoricoPedidos"
          options={{ title: "HistoricoPedidos" }}
        >
          {(props) => (
            <ScreenWithBreadcrumb {...props}>
              <HistoricoPedidos navigation={props.navigation} />
            </ScreenWithBreadcrumb>
          )}
        </Stack.Screen>

        <Stack.Screen name="Login" options={{ title: "Login" }}>
          {(props) => (
            <ScreenWithBreadcrumb {...props}>
              <Login
                {...props}
                setIsAdmin={(isAdmin: boolean, email: string, nome?: string) =>
                  setUser({ isAdmin, email, nome })
                }
              />
            </ScreenWithBreadcrumb>
          )}
        </Stack.Screen>

        <Stack.Screen name="Pedidos" options={{ title: "Pedidos (Admin)" }}>
          {(props) => (
            <ScreenWithBreadcrumb {...props}>
              <Pedidos />
            </ScreenWithBreadcrumb>
          )}
        </Stack.Screen>
      </Stack.Navigator>
      {/* Só mostra o footer se NÃO estiver no Chatbot */}
      {currentRouteName !== "Chatbot" && <SocialMediaFooter />}
    </View>
  );
};

export default Home;
