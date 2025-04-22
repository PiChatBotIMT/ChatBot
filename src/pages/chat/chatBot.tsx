import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import styles from './chatBot.styles';

type RootStackParamList = {
    HomeMenu: undefined;
    Chatbot: undefined;
    Cardapio: undefined;
    Histórico: undefined;
};

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Bem-vindo à cantina, segue as opções:\n1 - Consultar cardápio\n2 - Fazer pedido\n3 - Visualizar histórico de pedidos',
            sender: 'bot',
        },
    ]);
    const [input, setInput] = useState('');
    const [isOrdering, setIsOrdering] = useState(false); // Estado para controlar o fluxo de pedido
    const [selectedItems, setSelectedItems] = useState<{ nome: string; preco: number; quantidade: number }[]>([]); // Itens selecionados
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null); // Método de pagamento
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const menuItems = [
        { id: 1, nome: 'Pizza Margherita', preco: 25.0 },
        { id: 2, nome: 'Hambúrguer Clássico', preco: 18.5 },
        { id: 3, nome: 'Salada Caesar', preco: 15.0 },
        { id: 4, nome: 'Refrigerante', preco: 5.0 },
        { id: 5, nome: 'Sobremesa Brownie', preco: 10.0 },
    ];

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        if (isOrdering) {
            if (!paymentMethod) {
                // Escolha do método de pagamento
                if (input === '1') {
                    setPaymentMethod('Dinheiro');
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Pagamento selecionado: Dinheiro. Digite "Confirmar" para finalizar o pedido.', sender: 'bot' },
                    ]);
                } else if (input === '2') {
                    setPaymentMethod('Cartão');
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Pagamento selecionado: Cartão. Digite "Confirmar" para finalizar o pedido.', sender: 'bot' },
                    ]);
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Opção inválida. Escolha 1 para Dinheiro ou 2 para Cartão.', sender: 'bot' },
                    ]);
                }
            } else {
                // Finalizar pedido
                if (input.toLowerCase() === 'confirmar') {
                    const pedido = {
                        itens: selectedItems,
                        metodoPagamento: paymentMethod,
                        total: selectedItems.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
                    };

                    try {
                        const response = await fetch('http://localhost:5000/pedidos', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(pedido),
                        });

                        if (response.ok) {
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                { id: (Date.now() + 1).toString(), text: 'Pedido concluído com sucesso! Obrigado.', sender: 'bot' },
                            ]);
                            setIsOrdering(false);
                            setSelectedItems([]);
                            setPaymentMethod(null);
                        } else {
                            throw new Error('Erro ao salvar o pedido.');
                        }
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível concluir o pedido. Tente novamente mais tarde.');
                    }
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Digite "Confirmar" para finalizar o pedido.', sender: 'bot' },
                    ]);
                }
            }
        } else if (input === '2') {
            // Iniciar fluxo de pedido
            setIsOrdering(true);
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: (Date.now() + 1).toString(), text: 'Escolha os itens do menu digitando o número correspondente:', sender: 'bot' },
                ...menuItems.map((item) => ({
                    id: item.id.toString(),
                    text: `${item.id} - ${item.nome} (R$ ${item.preco.toFixed(2)})`,
                    sender: 'bot',
                })),
            ]);
        } else {
            // Outras opções
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: (Date.now() + 1).toString(), text: 'Opção inválida. Por favor, escolha 1, 2 ou 3.', sender: 'bot' },
            ]);
        }

        setInput(''); // Limpa o campo de entrada
    };

    const handleItemSelection = (itemId: number) => {
        const item = menuItems.find((menuItem) => menuItem.id === itemId);
        if (item) {
            setSelectedItems((prevItems) => [...prevItems, { ...item, quantidade: 1 }]);
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: (Date.now() + 1).toString(), text: `Item adicionado: ${item.nome} (R$ ${item.preco.toFixed(2)})`, sender: 'bot' },
                { id: (Date.now() + 2).toString(), text: 'Escolha mais itens ou digite "1" para Dinheiro ou "2" para Cartão.', sender: 'bot' },
            ]);
        } else {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: (Date.now() + 1).toString(), text: 'Item inválido. Escolha um item do menu.', sender: 'bot' },
            ]);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => {
                        if (isOrdering && !paymentMethod) {
                            handleItemSelection(Number(input));
                        } else {
                            handleSend();
                        }
                    }}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chatbot;