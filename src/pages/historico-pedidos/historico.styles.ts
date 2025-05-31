import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  data: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  itens: {
    fontSize: 14,
    marginBottom: 8,
  },
  metodoPagamento: {
    fontSize: 14,
    marginBottom: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f4511e",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 24,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  buttonOrange: {
    backgroundColor: "#f4511e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
