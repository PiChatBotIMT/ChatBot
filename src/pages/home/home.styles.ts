import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

// Ajusta tamanhos baseados na plataforma e tamanho da tela
const isWeb = Platform.OS === "web";
const cardSize = isWeb ? 160 : width < 380 ? width * 0.38 : 150;
const iconSize = isWeb ? 60 : width < 380 ? 50 : 55;

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingBottom: 80, // Adiciona espaço para o footer
  },
  botIcon: {
    width: isWeb ? 200 : 150,
    height: isWeb ? 200 : 150,
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  chatButton: {
    backgroundColor: "#FAA41F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: isWeb ? 800 : "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    width: cardSize,
    height: cardSize,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#FAA41F",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardIcon: {
    width: iconSize,
    height: iconSize,
    marginBottom: 15,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
