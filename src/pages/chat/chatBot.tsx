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
  ImageBackground,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import styles from "./chatBot.styles";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../../config/meuIp"; // Importa o IP dinâmico

type RootStackParamList = {
  HomeMenu: undefined;
  Chatbot: undefined;
  Cardapio: undefined;
  HistoricoPedidos: undefined;
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

function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: generateUniqueId(),
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const CHAT_STORAGE_KEY = "@cantina_chat_messages";
  const ORDER_ITEMS_KEY = "@cantina_selected_items";
  const ORDER_DESCRIPTION_KEY = "@cantina_order_description";
  const ORDER_STEP_KEY = "@cantina_order_step";
  const PAYMENT_METHOD_KEY = "@cantina_payment_method";

  // Adicione um contador de tentativas
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    fetchMenuItems();
    loadChatHistory();
    checkAuthentication();
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

  const checkAuthentication = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("@cantina_user_auth");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setIsAuthenticated(userData && userData.isAuthenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
    }
  };

  // Função para carregar o histórico de chat
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);

      // Carregar mensagens
      const savedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        // Garante que todas as mensagens tenham IDs únicos
        const parsed = JSON.parse(savedMessages);
        const ids = new Set();
        const fixedMessages = parsed.map((msg: any) => {
          let id = msg.id;
          // Se não tem id ou já existe, gera um novo
          if (!id || ids.has(id)) {
            id = generateUniqueId();
          }
          ids.add(id);
          return { ...msg, id };
        });
        setMessages(fixedMessages);
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

  const getApiBaseUrl = () => {
    if (Platform.OS === "web") {
      return "http://localhost:5000";
    } else {
      // Em dispositivos reais, use o IP da sua máquina na rede local
      return `http://${SERVER_IP}:5000`;
    }
  };

  // Modifique também a função fetchMenuItems para melhor tratamento de erros:

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);

      const apiBaseUrl = getApiBaseUrl();
      console.log("Tentando buscar cardápio de:", `${apiBaseUrl}/cardapio`);

      // Adicione um timeout para evitar que a solicitação fique pendente por muito tempo
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

      const response = await fetch(`${apiBaseUrl}/cardapio`, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      clearTimeout(timeoutId); // Limpa o timeout se a solicitação for concluída

      if (response.ok) {
        const data = await response.json();
        console.log(`Cardápio carregado com sucesso: ${data.length} itens`);
        setMenuItems(data);
      } else {
        console.error("Erro ao buscar cardápio. Status:", response.status);
        throw new Error(`Falha ao buscar cardápio: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Erro ao buscar cardápio:",
        error.message || "Erro desconhecido"
      );

      // Mensagem mais informativa para o usuário
      let errorMessage = "Não foi possível carregar o cardápio.";

      if (error.name === "AbortError") {
        errorMessage += "A solicitação expirou. Verifique sua conexão.";
      } else if (
        error.message &&
        error.message.includes("Network request failed")
      ) {
        errorMessage +=
          "Verifique sua conexão de rede ou o servidor pode estar indisponível.";
      } else {
        errorMessage += "Tente novamente mais tarde.";
      }

      addBotMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchAttempts < maxAttempts) {
      fetchMenuItems().catch(() => {
        setFetchAttempts((prev) => prev + 1);
      });
    } else if (fetchAttempts === maxAttempts && menuItems.length === 0) {
      addBotMessage(
        "Não foi possível carregar o cardápio após múltiplas tentativas. Por favor, verifique sua conexão ou tente novamente mais tarde."
      );
    }
  }, [fetchAttempts]);

  const retryFetchingMenu = () => {
    setFetchAttempts(0);
    fetchMenuItems();
  };

  const addBotMessage = (text: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: generateUniqueId(), text, sender: "bot" },
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

    if (!isAuthenticated) {
      addBotMessage("Você precisa estar logado para usar o chat.");
      return;
    }

    const userMessage = {
      id: generateUniqueId(),
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
        addBotMessage("Por favor, complete o processo atual usando os botões.");
    }

    setInput(""); // Limpa o campo de entrada
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
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
        navigation.navigate("HistoricoPedidos");
        break;
      default:
        addBotMessage("Opção inválida. Por favor, escolha 1, 2 ou 3.");
    }
  };

  const startOrderProcess = async () => {
    try {
      setIsLoading(true);

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
      const existingItem = prevItems.find((i) => i._id === item._id);

      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    setSelectedItems((prevItems) => {
      if (newQuantity === 0) {
        return prevItems.filter((item) => item._id !== itemId);
      }

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

      const userDataString = await AsyncStorage.getItem("@cantina_user_auth");
      if (!userDataString) {
        addBotMessage(
          "Você precisa estar logado para fazer um pedido. Redirecionando para login..."
        );

        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);

        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      const userName = userData.name || userData.nome;

      console.log("Dados do usuário:", userData);

      if (!userId) {
        console.error("ID do usuário não encontrado nos dados de autenticação");
        addBotMessage(
          "Erro ao identificar seu usuário. Por favor, faça login novamente."
        );

        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);

        return;
      }

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
        usuarioId: userId,
        nomeUsuario: userName, // <-- adicione aqui
      };

      console.log("Dados do pedido a enviar:", orderData);

      const apiBaseUrl = getApiBaseUrl();

      const response = await fetch(`${apiBaseUrl}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log("Resposta da API:", response.status, responseData);

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
        console.error("Erro na resposta da API:", responseData);
        throw new Error(responseData.error || "Erro ao enviar o pedido");
      }
    } catch (error) {
      console.error("Exceção ao enviar pedido:", error);
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
            {menuItems.map((item, index) => (
              <View
                key={`menu-item-${item._id || index}`}
                style={styles.menuItemCard}
              >
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
              {selectedItems.map((item, index) => (
                <View
                  key={`selected-item-${item._id || index}`}
                  style={styles.selectedItemRow}
                >
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
        {paymentOptions.map((option, index) => (
          <TouchableOpacity
            key={`payment-${option}`}
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
    <ImageBackground
      source={require("../../image/background-chat.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
                  item.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage,
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
          <>
            {isAuthenticated ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChangeText={setInput}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                >
                  <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loginWarningContainer}>
                <Text style={styles.loginWarningText}>
                  Você precisa estar logado para usar o chat.
                </Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={navigateToLogin}
                >
                  <Text style={styles.loginButtonText}>Fazer Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Chatbot;
