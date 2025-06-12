import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import styles from "./cardapio.styles";
import axios from "axios";
import { API_URL } from "../../config/api";
import * as ImagePicker from "expo-image-picker";
type CardapioItem = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

const Cardapio = ({ isAdmin }: { isAdmin: boolean }) => {
  const [items, setItems] = useState<CardapioItem[]>([]);
  const [editItem, setEditItem] = useState<CardapioItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const numColumns = Platform.OS === "web" ? 5 : 2;

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      if (onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [{ text: "OK", onPress: onConfirm }]);
    }
  };

  const formatarPreco = (value: number) => {
    if (!value && value !== 0) return "";

    const valueStr = value.toFixed(2).replace(".", ",");

    return valueStr;
  };

  const pickImage = async () => {
    // Solicita permissão
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão negada", "Você precisa permitir acesso às fotos.");
      return;
    }

    // Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };
  useEffect(() => {
    console.log(`Tentando carregar cardápio de: ${API_URL}/cardapio`);

    axios
      .get<CardapioItem[]>(`${API_URL}/cardapio`)
      .then((res) => {
        console.log("Dados do cardápio recebidos:", res.data.length, "itens");
        setItems(res.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar cardápio:", error);

        // Mostrar detalhes mais específicos do erro
        if (error.response) {
          // O servidor respondeu com um status de erro
          console.error(
            "Resposta de erro:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          console.error(
            "Sem resposta do servidor. Detalhes:",
            JSON.stringify(error.request)
          );
        } else {
          // Erro na configuração da requisição
          console.error("Erro na configuração:", error.message);
        }

        showAlert(
          "Erro",
          `Não foi possível carregar o cardápio: ${error.message}`
        );
      });
  }, []);
  const removerItem = (id: string) => {
    if (Platform.OS === "web") {
      // No web, não tem confirmação customizada, só um alert simples
      if (window.confirm("Deseja remover este item?")) {
        axios
          .delete(`${API_URL}/cardapio/${id}`)
          .then(() => setItems(items.filter((i) => i._id !== id)))
          .catch((err) => {
            console.log("Erro ao remover:", err.response?.data || err.message);
            window.alert("Erro ao remover o item");
          });
      }
    } else {
      Alert.alert("Remover", "Deseja remover este item?", [
        { text: "Cancelar" },
        {
          text: "Remover",
          onPress: () => {
            axios
              .delete(`${API_URL}/cardapio/${id}`)
              .then(() => setItems(items.filter((i) => i._id !== id)))
              .catch((err) => {
                console.log(
                  "Erro ao remover:",
                  err.response?.data || err.message
                );
                Alert.alert("Erro", "Não foi possível remover o item");
              });
          },
        },
      ]);
    }
  };
  // Função para abrir o modal de edição
  const abrirEdicao = (item: CardapioItem) => {
    setEditItem({ ...item });
    setModalVisible(true);
  };

  // Função para salvar edição
  const salvarEdicao = async () => {
    if (!editItem) return;
    try {
      const formData = new FormData();
      formData.append("name", editItem.name);
      formData.append("description", editItem.description);
      formData.append("price", String(editItem.price));

      // Handle image upload
      if (selectedImage) {
        if (selectedImage.uri && selectedImage.uri.startsWith("data:image")) {
          // Se é base64, envia como string
          formData.append("imageBase64", selectedImage.uri);
        } else if (Platform.OS === "web") {
          // Para web, anexa o arquivo diretamente
          formData.append("image", selectedImage);
        } else {
          // Para plataformas nativas
          formData.append("image", {
            uri: selectedImage.uri,
            type: selectedImage.type || "image/jpeg",
            name: selectedImage.fileName || "image.jpg",
          } as any);
        }
      }

      let res;
      if (editItem._id) {
        // Editando item existente
        res = await axios.put<CardapioItem>(
          `${API_URL}/cardapio/${editItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setItems(items.map((i) => (i._id === editItem._id ? res.data : i)));
      } else {
        // Criando novo item
        res = await axios.post<CardapioItem>(`${API_URL}/cardapio`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setItems([...items, res.data]);
      }

      setModalVisible(false);
      setEditItem(null);
      setSelectedImage(null);
    } catch (error) {
      console.error(
        "Erro ao salvar item:",
        error.response?.data || error.message
      );
      showAlert("Erro", "Não foi possível salvar as alterações");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardápio</Text>
      {isAdmin && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditItem({
              _id: "",
              name: "",
              description: "",
              price: 0,
              image: "",
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>Adicionar Item</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          item._id ? `item-${item._id}` : `temp-item-${index}`
        }
        numColumns={numColumns}
        renderItem={({ item }) => {
          const imageUri = item.image
            ? `${API_URL}${item.image}`
            : require("../../image/no-image.png");

          return (
            <View style={styles.card}>
              <Image
                source={
                  typeof imageUri === "string" ? { uri: imageUri } : imageUri
                }
                style={styles.image}
                onError={(e) =>
                  console.log("Erro ao carregar imagem:", e.nativeEvent.error)
                }
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemPrice}>
                R${" "}
                {item.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              {isAdmin && (
                <View style={styles.adminActions}>
                  <TouchableOpacity onPress={() => abrirEdicao(item)}>
                    <Text style={styles.editBtn}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (item._id) removerItem(item._id);
                    }}
                  >
                    <Text style={styles.removeBtn}>Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Modal de edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "90%",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              {editItem?._id ? "Editar Item" : "Novo Item"}
            </Text>

            {/* Campo Nome com indicador de obrigatório */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Nome <Text style={styles.requiredField}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !editItem?.name && styles.inputRequired]}
                value={editItem?.name}
                onChangeText={(text) =>
                  setEditItem({ ...editItem!, name: text })
                }
                placeholder="Nome do item"
              />
            </View>

            {/* Campo Descrição (opcional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={styles.input}
                value={editItem?.description}
                onChangeText={(text) =>
                  setEditItem({ ...editItem!, description: text })
                }
                placeholder="Descrição do item"
                multiline={true}
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Preço <Text style={styles.requiredField}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  editItem?.price === 0 && styles.inputRequired,
                ]}
                value={
                  editItem?.price === 0
                    ? ""
                    : formatarPreco(editItem?.price ?? 0)
                }
                onChangeText={(text) => {
                  // Remove tudo exceto números
                  const numericOnly = text.replace(/[^\d]/g, "");

                  // Converte para formato centavos
                  const priceInCents = parseInt(numericOnly) || 0;

                  // Converte centavos para reais (dividindo por 100)
                  const priceInReais = priceInCents / 100;

                  // Atualiza o state
                  setEditItem({
                    ...editItem!,
                    price: priceInReais,
                  });
                }}
                placeholder="0,00"
                keyboardType={Platform.OS === "web" ? "default" : "numeric"}
              />
            </View>
            {/* Preview de imagem existente */}
            {!selectedImage && editItem?.image && (
              <Image
                source={{ uri: `${API_URL}${editItem.image}` }}
                style={{ width: 80, height: 80, marginBottom: 10 }}
                onError={(e) =>
                  console.log(
                    "Preview image failed to load:",
                    e.nativeEvent.error
                  )
                }
              />
            )}

            {/* Botão para selecionar imagem */}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => {
                if (!selectedImage) pickImage();
              }}
              disabled={!!selectedImage}
            >
              <Text style={styles.imagePickerText}>
                {selectedImage ? "Imagem selecionada" : "Selecionar imagem"}
              </Text>
            </TouchableOpacity>

            {/* Preview da imagem selecionada */}
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{ width: 80, height: 80, marginBottom: 10 }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#D32F2F",
                    padding: 6,
                    borderRadius: 6,
                    alignSelf: "flex-start",
                    marginBottom: 10,
                  }}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={{ color: "#fff" }}>Remover imagem</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Indicador de campos obrigatórios */}
            <Text
              style={{
                fontSize: 12,
                color: "#777",
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              <Text style={styles.requiredField}>*</Text> Campos obrigatórios
            </Text>

            {/* Botões de ação */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ marginRight: 20, color: "#888" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={salvarEdicao}
                disabled={!editItem?.name || editItem?.price <= 0}
                style={{
                  opacity: !editItem?.name || editItem?.price <= 0 ? 0.5 : 1,
                }}
              >
                <Text style={{ color: "#1976D2", fontWeight: "bold" }}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cardapio;
