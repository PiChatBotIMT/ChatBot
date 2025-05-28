import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import styles from "./chatBot.styles";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  HomeMenu: undefined;
  Chatbot: undefined;
  Cardapio: undefined;
  Histórico: undefined;
  Login: undefined;
};

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoria?: string;
};

type SelectedItem = MenuItem & {
  quantity: number;
};

// Estados do fluxo de pedido
type OrderStep =
  | "idle"
  | "selecting_items"
  | "adding_description"
  | "confirm_total"
  | "selecting_payment"
  | "final_confirmation";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Bem-vindo à cantina, segue as opções:\n1 - Consultar cardápio\n2 - Fazer pedido\n3 - Visualizar histórico de pedidos",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [orderStep, setOrderStep] = useState<OrderStep>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const paymentOptions = ["Dinheiro", "Cartão", "Pix"];
  const flatListRef = useRef<FlatList>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const CHAT_STORAGE_KEY = "@cantina_chat_messages";
  const ORDER_ITEMS_KEY = "@cantina_selected_items";
  const ORDER_DESCRIPTION_KEY = "@cantina_order_description";
  const ORDER_STEP_KEY = "@cantina_order_step";
  const PAYMENT_METHOD_KEY = "@cantina_payment_method";

  useEffect(() => {
    fetchMenuItems();
    loadChatHistory();
  }, []);

  // Efeito para salvar o estado do chat sempre que ele mudar
  useEffect(() => {
    if (messages.length > 1) {
      // Não salvar apenas a mensagem inicial
      saveChatState();
    }
  }, [messages, selectedItems, orderDescription, orderStep, paymentMethod]);

  // Rolar automaticamente para o final da lista quando novas mensagens forem adicionadas
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Função para carregar o histórico de chat
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);

      // Carregar mensagens
      const savedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      // Carregar itens selecionados
      const savedItems = await AsyncStorage.getItem(ORDER_ITEMS_KEY);
      if (savedItems) {
        setSelectedItems(JSON.parse(savedItems));
      }

      // Carregar descrição do pedido
      const savedDescription = await AsyncStorage.getItem(
        ORDER_DESCRIPTION_KEY
      );
      if (savedDescription) {
        setOrderDescription(savedDescription);
      }

      // Carregar etapa do pedido
      const savedStep = await AsyncStorage.getItem(ORDER_STEP_KEY);
      if (savedStep) {
        setOrderStep(savedStep as OrderStep);
      }

      // Carregar método de pagamento
      const savedPaymentMethod = await AsyncStorage.getItem(PAYMENT_METHOD_KEY);
      if (savedPaymentMethod) {
        setPaymentMethod(savedPaymentMethod);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar o estado atual do chat
  const saveChatState = async () => {
    try {
      // Salvar mensagens
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));

      // Salvar itens selecionados se houver algum
      if (selectedItems.length > 0) {
        await AsyncStorage.setItem(
          ORDER_ITEMS_KEY,
          JSON.stringify(selectedItems)
        );
      }

      // Salvar descrição se existir
      if (orderDescription) {
        await AsyncStorage.setItem(ORDER_DESCRIPTION_KEY, orderDescription);
      }

      // Salvar etapa atual
      await AsyncStorage.setItem(ORDER_STEP_KEY, orderStep);

      // Salvar método de pagamento se existir
      if (paymentMethod) {
        await AsyncStorage.setItem(PAYMENT_METHOD_KEY, paymentMethod);
      }
    } catch (error) {
      console.error("Erro ao salvar estado do chat:", error);
    }
  };

  // Função para limpar o estado ao completar um pedido
  const clearChatState = async () => {
    try {
      await AsyncStorage.removeItem(ORDER_ITEMS_KEY);
      await AsyncStorage.removeItem(ORDER_DESCRIPTION_KEY);
      await AsyncStorage.removeItem(ORDER_STEP_KEY);
      await AsyncStorage.removeItem(PAYMENT_METHOD_KEY);
      // Não removemos o histórico de mensagens, apenas os outros estados
    } catch (error) {
      console.error("Erro ao limpar estado do pedido:", error);
    }
  };

  // Buscar itens do cardápio ao montar o componente
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Rolar automaticamente para o final da lista quando novas mensagens forem adicionadas
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/cardapio");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error("Falha ao buscar cardápio");
      }
    } catch (error) {
      console.error("Erro ao buscar cardápio:", error);
      addBotMessage(
        "Não foi possível carregar o cardápio. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addBotMessage = (text: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString(), text, sender: "bot" },
    ]);
  };

  const getTotalOrderValue = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    switch (orderStep) {
      case "idle":
        processInitialCommand(input);
        break;
      case "adding_description":
        setOrderDescription(input);
        showOrderTotal();
        break;
      default:
        // Adicionar uma mensagem genérica do bot em outros estados
        addBotMessage("Por favor, complete o processo atual usando os botões.");
    }

    setInput(""); // Limpa o campo de entrada
  };

  const processInitialCommand = (command: string) => {
    switch (command) {
      case "1":
        navigation.navigate("Cardapio");
        break;
      case "2":
        startOrderProcess();
        break;
      case "3":
        navigation.navigate("Histórico");
        break;
      default:
        addBotMessage("Opção inválida. Por favor, escolha 1, 2 ou 3.");
    }
  };

  const startOrderProcess = async () => {
    try {
      setIsLoading(true);
      // Certifique-se de que temos os itens do cardápio
      if (menuItems.length === 0) {
        await fetchMenuItems();
      }

      addBotMessage(
        "Por favor, selecione os itens do cardápio que deseja pedir:"
      );
      setOrderStep("selecting_items");
    } catch (error) {
      addBotMessage("Ocorreu um erro ao iniciar seu pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSelection = (item: MenuItem) => {
    setSelectedItems((prevItems) => {
      // Verificar se o item já está selecionado
      const existingItem = prevItems.find((i) => i._id === item._id);

      if (existingItem) {
        // Se já existe, aumentar a quantidade
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Se não existe, adicionar com quantidade 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    setSelectedItems((prevItems) => {
      if (newQuantity === 0) {
        // Remover o item se a quantidade for zero
        return prevItems.filter((item) => item._id !== itemId);
      }

      // Atualizar a quantidade do item
      return prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const confirmItemSelection = () => {
    if (selectedItems.length === 0) {
      addBotMessage("Por favor, selecione pelo menos um item para continuar.");
      return;
    }

    const itemsList = selectedItems
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    addBotMessage(
      `Você selecionou:\n${itemsList}\n\nDeseja adicionar alguma observação ao seu pedido? (ex: sem cebola, bem passado, etc)`
    );
    setOrderStep("adding_description");
  };

  const showOrderTotal = () => {
    const total = getTotalOrderValue();

    addBotMessage(
      `Resumo do pedido:\n${selectedItems
        .map(
          (item) =>
            `${item.quantity}x ${item.name} - ${formatCurrency(
              item.price * item.quantity
            )}`
        )
        .join("\n")}\n${
        orderDescription ? `\nObservação: ${orderDescription}\n` : "\n"
      }\nTotal: ${formatCurrency(
        total
      )}\n\nPor favor, escolha o método de pagamento:`
    );

    setOrderStep("selecting_payment");
  };

  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);

    const total = getTotalOrderValue();

    addBotMessage(
      `Método de pagamento selecionado: ${method}\n\nResumo final do pedido:\n${selectedItems
        .map(
          (item) =>
            `${item.quantity}x ${item.name} - ${formatCurrency(
              item.price * item.quantity
            )}`
        )
        .join("\n")}\n${
        orderDescription ? `\nObservação: ${orderDescription}` : ""
      }\n\nTotal: ${formatCurrency(total)}\n\nConfirma o envio do pedido?`
    );

    setOrderStep("final_confirmation");
  };

  const submitOrder = async () => {
    try {
      setIsLoading(true);
      addBotMessage("Enviando seu pedido...");

      const orderData = {
        itens: selectedItems.map((item) => ({
          nome: item.name,
          preco: item.price,
          quantidade: item.quantity,
          descricao: item.description,
        })),
        metodoPagamento: paymentMethod,
        total: getTotalOrderValue(),
        descricao: orderDescription,
      };

      const response = await fetch("http://localhost:5000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        addBotMessage(
          "Pedido enviado com sucesso! Você pode acompanhar seu pedido no histórico."
        );

        // Reset order state
        setSelectedItems([]);
        setOrderDescription("");
        setPaymentMethod("");
        setOrderStep("idle");

        // Limpar o estado do pedido no AsyncStorage
        await clearChatState();

        // Show initial menu again
        setTimeout(() => {
          addBotMessage(
            "O que você deseja fazer agora?\n1 - Consultar cardápio\n2 - Fazer pedido\n3 - Visualizar histórico de pedidos"
          );
        }, 1000);
      } else {
        throw new Error("Erro ao enviar o pedido");
      }
    } catch (error) {
      addBotMessage(
        "Não foi possível enviar o pedido. Por favor, tente novamente mais tarde."
      );
      setOrderStep("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async () => {
    addBotMessage(
      "Pedido cancelado. O que você deseja fazer agora?\n1 - Consultar cardápio\n2 - Fazer pedido\n3 - Visualizar histórico de pedidos"
    );
    setSelectedItems([]);
    setOrderDescription("");
    setPaymentMethod("");
    setOrderStep("idle");

    // Limpar o estado do pedido no AsyncStorage
    await clearChatState();
  };

  const renderMenuItemSelector = () => (
    <View style={styles.orderForm}>
      <Text style={styles.formTitle}>Selecione os itens do cardápio:</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <ScrollView
          style={styles.menuScrollContainer}
          nestedScrollEnabled={true}
        >
          <View style={styles.menuItemsContainer}>
            {menuItems.map((item) => (
              <View key={item._id} style={styles.menuItemCard}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuItemPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>
                <View style={styles.menuItemActions}>
                  <TouchableOpacity
                    style={styles.itemButton}
                    onPress={() => handleItemSelection(item)}
                  >
                    <Text style={styles.itemButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {selectedItems.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Itens selecionados:</Text>
              {selectedItems.map((item) => (
                <View key={item._id} style={styles.selectedItemRow}>
                  <Text style={styles.selectedItemName}>{item.name}</Text>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemTotal}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalText}>
                  Total: {formatCurrency(getTotalOrderValue())}
                </Text>
              </View>
            </>
          )}

          <View style={styles.formButtonsRow}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={cancelOrder}
            >
              <Text style={styles.formButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.formButton, styles.confirmButton]}
              onPress={confirmItemSelection}
            >
              <Text style={styles.formButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );

  const renderPaymentSelection = () => (
    <View style={styles.orderForm}>
      <ScrollView nestedScrollEnabled={true}>
        <Text style={styles.formTitle}>Método de Pagamento</Text>
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.paymentOption,
              paymentMethod === option && styles.paymentOptionSelected,
            ]}
            onPress={() => selectPaymentMethod(option)}
          >
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === option && styles.paymentOptionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOrderConfirmation = () => (
    <View style={styles.orderForm}>
      <ScrollView nestedScrollEnabled={true}>
        <Text style={styles.formTitle}>Confirmar Pedido</Text>
        <Text style={styles.confirmationText}>
          Você confirma o envio do seu pedido no valor de{" "}
          {formatCurrency(getTotalOrderValue())}?
        </Text>

        <View style={styles.formButtonsRow}>
          <TouchableOpacity
            style={[styles.formButton, styles.cancelButton]}
            onPress={cancelOrder}
          >
            <Text style={styles.formButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.formButton, styles.confirmButton]}
            onPress={submitOrder}
          >
            <Text style={styles.formButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderAddDescription = () => (
    <View style={styles.orderForm}>
      <ScrollView nestedScrollEnabled={true}>
        <Text style={styles.formTitle}>Observações do Pedido</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Adicione observações ao seu pedido (opcional)"
          multiline
          value={input}
          onChangeText={setInput}
        />
        <View style={styles.formButtonsRow}>
          <TouchableOpacity
            style={[styles.formButton, styles.cancelButton]}
            onPress={() => {
              setInput("");
              showOrderTotal();
            }}
          >
            <Text style={styles.formButtonText}>Pular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.formButton, styles.confirmButton]}
            onPress={handleSend}
          >
            <Text style={styles.formButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderCurrentOrderStep = () => {
    switch (orderStep) {
      case "selecting_items":
        return renderMenuItemSelector();
      case "selecting_payment":
        return renderPaymentSelection();
      case "final_confirmation":
        return renderOrderConfirmation();
      case "adding_description":
        return renderAddDescription();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.chatSection}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContainer}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
        </View>
      )}

      {renderCurrentOrderStep()}

      {orderStep === "idle" && (
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
