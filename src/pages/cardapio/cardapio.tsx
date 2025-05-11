import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import styles from './cardapio.styles'; // Importando o arquivo de estilos
import Footer from '../../components/footer/footer';
const Cardapio: React.FC = () => {
    const items = [
        { id: 1, name: 'Pizza Margherita', price: 25.0 },
        { id: 2, name: 'Hambúrguer Clássico', price: 18.5 },
        { id: 3, name: 'Salada Caesar', price: 15.0 },
        { id: 4, name: 'Refrigerante', price: 5.0 },
        { id: 5, name: 'Sobremesa Brownie', price: 10.0 },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cardápio</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
                    </View>
                )}
            />
            <View>
                <Footer />
            </View>
        </View>
    );
};



export default Cardapio;