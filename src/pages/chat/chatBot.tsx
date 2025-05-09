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
    const [orderForm, setOrderForm] = useState({
        items: [],
        quantity: '',
        paymentMethod: '',
        description: '',
    }); // Formulário de pedido
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
const paymentOptions = ["Dinheiro", "Cartão", "Pix"];
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        if (isOrdering) {
            // Lógica para processar o formulário de pedido
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: (Date.now() + 1).toString(), text: 'Pedido enviado com sucesso!', sender: 'bot' },
            ]);
            // Enviar o pedido para a API
            fetch('http://localhost:5000/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderForm),
            })
                .then((response) => {
                    if (response.ok) {
                        Alert.alert('Sucesso', 'Pedido enviado com sucesso!');
                        setIsOrdering(false);
                        setOrderForm({ items: [], quantity: '', paymentMethod: '', description: '' });
                    } else {
                        throw new Error('Erro ao enviar o pedido.');
                    }
                })
                .catch((error) => {
                    Alert.alert('Erro', 'Não foi possível enviar o pedido. Tente novamente mais tarde.');
                });
        } else {
            switch (input) {
                case '1':
                    navigation.navigate('Cardapio');
                    break;
                case '2':
                    setIsOrdering(true);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Qual será o seu pedido?', sender: 'bot' },
                    ]);
                    break;
                case '3':
                    navigation.navigate('Histórico');
                    break;
                default:
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Opção inválida. Por favor, escolha 1, 2 ou 3.', sender: 'bot' },
                    ]);
            }
        }

        setInput(''); // Limpa o campo de entrada
    };

    const renderOrderForm = () => (
        <View style={styles.orderForm}>
            <Text style={styles.formLabel}>Selecione os itens:</Text>
            <TextInput
                style={styles.input}
                placeholder="Itens (ex: Pizza, Refrigerante)"
                value={orderForm.items.join(', ')}
                onChangeText={(text) => setOrderForm((prev) => ({ ...prev, items: text.split(', ') }))}
            />
            <Text style={styles.formLabel}>Quantidade:</Text>
            <TextInput
                style={styles.input}
                placeholder="Quantidade"
                keyboardType="numeric"
                value={orderForm.quantity}
                onChangeText={(text) => setOrderForm((prev) => ({ ...prev, quantity: text }))}
            />
            <Text style={styles.formLabel}>Método de pagamento:</Text>
            <View style={styles.pickerContainer}>
            <View>
  <TouchableOpacity
    style={styles.input}
    onPress={() => setShowPaymentOptions((prev) => !prev)}
  >
    <Text>
      {orderForm.paymentMethod || "Selecione o método de pagamento"}
    </Text>
  </TouchableOpacity>
  {showPaymentOptions && (
    <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}>
      {paymentOptions.map(option => (
        <TouchableOpacity
          key={option}
          style={{ padding: 10 }}
          onPress={() => {
            setOrderForm(prev => ({ ...prev, paymentMethod: option }));
            setShowPaymentOptions(false);
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>
        </View>
            <Text style={styles.formLabel}>Descrição (opcional):</Text>
            <TextInput
                style={styles.textArea}
                placeholder="Adicione uma descrição"
                multiline
                value={orderForm.description}
                onChangeText={(text) => setOrderForm((prev) => ({ ...prev, description: text }))}
            />
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: (Date.now() + 1).toString(), text: 'Enviando pedido...', sender: 'bot' },
                    ]);
                    handleSend();
                }}
            >
                <Text style={styles.submitButtonText}>Enviar Pedido</Text>
            </TouchableOpacity>
        </View>
    );

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
            {isOrdering && renderOrderForm()}
            {!isOrdering && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem..."
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default Chatbot;