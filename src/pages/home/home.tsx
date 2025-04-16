import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Tela2 from '../tela2/tela2';
import styles from './home.styles'; 

const Stack = createStackNavigator();

const HomeMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu Principal</Text>
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Tela2')} // Navega para Tela2
                >
                    <Text style={styles.cardTitle}>Ir para o cardápio</Text>
                    <Text style={styles.cardDescription}>Veja o cardápio disponível</Text>
                </TouchableOpacity>
                {/* Adicionar mais cards aqui para outras telas */}
            </View>
        </View>
    );
};

const Home: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeMenu" id={undefined}>
                <Stack.Screen
                    name="HomeMenu"
                    component={HomeMenu}
                    options={{ title: 'Menu Principal' }}
                />
                <Stack.Screen
                    name="Tela2"
                    component={Tela2}
                    options={{ title: 'Tela 2' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};



export default Home;