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
import { launchImageLibrary } from "react-native-image-picker";
import { API_URL } from "../../config/api";

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

  const pickImage = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  useEffect(() => {
    axios
      .get<CardapioItem[]>(`${API_URL}/cardapio`)
      .then((res) => setItems(res.data))
      .catch(() => showAlert("Erro", "Não foi possível carregar o cardápio"));
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
      if (editItem._id) {
        // Edição
        if (selectedImage) {
          // Se selecionou nova imagem, envie via FormData
          const formData = new FormData();
          formData.append("name", editItem.name);
          formData.append("description", editItem.description);
          formData.append("price", String(editItem.price));
          formData.append("image", {
            uri: selectedImage.uri,
            type: selectedImage.type,
            name: selectedImage.fileName || "image.jpg",
          } as any);
          const res = await axios.put<CardapioItem>(
            `${API_URL}/cardapio/${editItem._id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          setItems(items.map((i) => (i._id === editItem._id ? res.data : i)));
        } else {
          // Não selecionou nova imagem, envie JSON normal
          await axios.put(`${API_URL}/cardapio/${editItem._id}`, editItem);
          setItems(items.map((i) => (i._id === editItem._id ? editItem : i)));
        }
      } else {
        // Criação de novo item
        const formData = new FormData();
        formData.append("name", editItem.name);
        formData.append("description", editItem.description);
        formData.append("price", String(editItem.price));
        if (selectedImage) {
          formData.append("image", {
            uri: selectedImage.uri,
            type: selectedImage.type,
            name: selectedImage.fileName || "image.jpg",
          } as any);
        }
        const res = await axios.post<CardapioItem>(
          `${API_URL}/cardapio`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setItems([...items, res.data]);
      }
      setModalVisible(false);
      setEditItem(null);
      setSelectedImage(null);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar as alterações");
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
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => {
          console.log("Renderizando item:", item);
          return (
            <View style={styles.card}>
              <Image
                source={{ uri: `${API_URL}${item.image}` }}
                style={styles.image}
              />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
              {isAdmin && (
                <View style={styles.adminActions}>
                  <TouchableOpacity onPress={() => abrirEdicao(item)}>
                    <Text style={styles.editBtn}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removerItem(item._id)}>
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
              Editar Item
            </Text>
            <TextInput
              style={styles.input}
              value={editItem?.name}
              onChangeText={(text) => setEditItem({ ...editItem!, name: text })}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={editItem?.description}
              onChangeText={(text) =>
                setEditItem({ ...editItem!, description: text })
              }
              placeholder="Descrição"
            />
            <TextInput
              style={styles.input}
              value={editItem?.price.toString()}
              onChangeText={(text) =>
                setEditItem({ ...editItem!, price: Number(text) })
              }
              placeholder="Preço"
              keyboardType="numeric"
            />
            {!selectedImage && editItem?.image && (
              <Image
                source={{ uri: editItem.image }}
                style={{ width: 80, height: 80, marginBottom: 10 }}
              />
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                // Só permite selecionar se não houver imagem selecionada
                if (!selectedImage) pickImage();
              }}
              disabled={!!selectedImage}
            >
              <Text>
                {selectedImage ? "Imagem selecionada" : "Selecionar imagem"}
              </Text>
            </TouchableOpacity>
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
              <TouchableOpacity onPress={salvarEdicao}>
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
