import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chatbot from '../chat/chatBot';
import styles from './home.styles';
import Cardapio from '../cardapio/cardapio';
import HistoricoPedidos from '../historico-pedidos/historico';
import Login from '../login/login';
import Pedidos from '../visu-pedidos/pedidos';

const Stack = createStackNavigator();


const HomeMenu: React.FC<{ navigation: any; isAdmin: boolean }> = ({ navigation, isAdmin }) => {    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem-Vindo ao Restaurante</Text>

            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('Chatbot')}>
                <Text style={styles.chatButtonText}>Como posso ajudar?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Cardapio')}>
                <Text style={styles.cardTitle}>Cardápio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HistoricoPedidos')}>
                <Text style={styles.cardTitle}>Histórico</Text>
            </TouchableOpacity>
            {isAdmin && (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pedidos')}>
                    <Text style={styles.cardTitle}>Pedidos (Admin)</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export { HomeMenu };


const Home: React.FC = () => {
    const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);

    // Carrega usuário salvo ao abrir o app
    useEffect(() => {
        AsyncStorage.getItem('user').then(data => {
            if (data) setUser(JSON.parse(data));
        });
    }, []);

    // Salva usuário no AsyncStorage sempre que mudar
    useEffect(() => {
        if (user) {
            AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
            AsyncStorage.removeItem('user');
        }
    }, [user]);

    // Função para logout
    const handleLogout = () => setUser(null);

    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined}
                initialRouteName="HomeMenu"
                screenOptions={({ navigation }) => ({
                    headerRight: () => (
                        user ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10, color: '#007BFF', fontSize: 16 }}>
                                    Bem-vindo{user.isAdmin ? ' (Admin)' : ''}, {user.email}
                                </Text>
                                <TouchableOpacity onPress={handleLogout}>
                                    <Text style={{ color: 'red', fontSize: 16 }}>Sair</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={{ color: '#007BFF', fontSize: 16 }}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                        )
                    ),
                })}
            >
               <Stack.Screen
    name="HomeMenu"
    options={{ title: 'Menu Principal' }}
>
    {props => (
        <HomeMenu
            {...props}
            isAdmin={user?.isAdmin ?? false}
            key={user?.isAdmin ? 'admin' : 'user'} // <-- força re-render ao trocar de usuário
        />
    )}
</Stack.Screen>
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
                    options={{ title: 'Login' }}
                >
                    {props => (
                        <Login
                            {...props}
                            setIsAdmin={(isAdmin: boolean, email: string) => setUser({ isAdmin, email })}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Pedidos"
                    component={Pedidos}
                    options={{ title: 'Pedidos (Admin)' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Home;