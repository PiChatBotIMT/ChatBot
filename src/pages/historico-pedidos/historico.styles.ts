import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topBar: {
        backgroundColor: '#FEC240',
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    bottomBar: {
        backgroundColor: '#FEC240',
        height: 60,
    },
    breadcrumb: {
        fontSize: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    list: {
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.01,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#BBB',
    },
    data: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itens: {
        fontSize: 14,
        marginBottom: 5,
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default styles;