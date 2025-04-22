import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Obtém a largura da tela
const CARD_SIZE = width * 0.2; // Define o tamanho do card como 40% da largura da tela

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cardContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap', // Permite que os cards quebrem linha em telas menores
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        width: CARD_SIZE, 
        height: CARD_SIZE,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
});

export default styles;