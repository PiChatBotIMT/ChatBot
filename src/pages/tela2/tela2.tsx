import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Tela2: React.FC = () => {
    const menuItems = [
        { name: 'Pizza Margherita', description: 'Tomato, mozzarella, and basil', price: 'R$25.00' },
        { name: 'Spaghetti Carbonara', description: 'Pasta with eggs, cheese, pancetta, and pepper', price: 'R$30.00' },
        { name: 'Caesar Salad', description: 'Romaine lettuce, croutons, and Caesar dressing', price: 'R$20.00' },
        { name: 'Grilled Salmon', description: 'Served with vegetables and lemon sauce', price: 'R$40.00' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cardápio</Text>
            <FlatList
                data={menuItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    menuItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Tela2;