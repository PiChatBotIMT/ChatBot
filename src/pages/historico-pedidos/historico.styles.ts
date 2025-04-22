import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    data: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itens: {
        fontSize: 14,
        marginBottom: 8,
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});
export default styles;  