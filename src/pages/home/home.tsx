import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import Chatbot from '../chat/chatBot';
import styles from './home.styles';
import Cardapio from '../cardapio/cardapio';
import HistoricoPedidos from '../historico-pedidos/historico';
import Login from '../login/login'; // Importando a tela de login

const Stack = createStackNavigator();

const HomeMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Chatbot')}
                >
                    <Text style={styles.cardTitle}>Ir para o chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('HistoricoPedidos')}
                >
                    <Text style={styles.cardTitle}>Ir para o historico de pedidos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Cardapio')}
                >
                    <Text style={styles.cardTitle}>Ir para o cardapio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Home: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined}
                initialRouteName="HomeMenu"
                screenOptions={({ navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity
                            style={{ marginRight: 15 }}
                            onPress={() => navigation.navigate('Login')} // Navega para a tela de login
                        >
                            <Text style={{ color: '#007BFF', fontSize: 16 }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    ),
                })}
            >
                <Stack.Screen
                    name="HomeMenu"
                    component={HomeMenu}
                    options={{ title: 'Menu Principal' }}
                />
                <Stack.Screen
                    name="Chatbot"
                    component={Chatbot}
                    options={{ title: 'ChatBot' }}
                />
                <Stack.Screen
                    name="Cardapio"
                    component={Cardapio}
                    options={{ title: 'Cardapio' }}
                />
                <Stack.Screen
                    name="HistoricoPedidos"
                    component={HistoricoPedidos}
                    options={{ title: 'HistoricoPedidos' }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ title: 'Login' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Home;