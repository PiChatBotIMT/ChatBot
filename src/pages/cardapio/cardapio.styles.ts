import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e6e6e6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#FF9800",
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
  },

  // Estilo para a linha de cards (wrapper para cada linha da FlatList)
  row: {
    justifyContent: "center", // Centraliza os cards horizontalmente
    width: "100%",
    flexWrap: "wrap",
  },

  card: {
    width: Platform.OS === "web" ? "18%" : "45%", // Um pouco menos que 20% ou 50% para dar espaço para margens

    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 5,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  itemDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 8,
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  editBtn: {
    color: "#1976D2",
    fontWeight: "bold",
    marginRight: 16,
  },
  removeBtn: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  addBtn: {
    backgroundColor: "#FF9800",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    fontSize: 15,
  },
  // Novos estilos a serem adicionados
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  requiredField: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  inputRequired: {
    borderColor: "#ffcccc",
    backgroundColor: "#fff8f8",
  },
  imagePickerButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  imagePickerText: {
    textAlign: "center",
    color: "#555",
  },
});

export default styles;
