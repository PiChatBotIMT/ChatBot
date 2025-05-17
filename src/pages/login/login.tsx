import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import styles from "./login.styles";
import { API_URL } from "../../config/api";

const Login = ({
  navigation,
  setIsAdmin,
}: {
  navigation: any;
  setIsAdmin: (isAdmin: boolean, email: string) => void;
}) => {
  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_SENHA = "admin123";
  // Para desenvolvimento, use diferentes URLs conforme o ambiente
  let apiBaseUrl = API_URL;
  if (__DEV__) {
    // Web
    // apiBaseUrl = 'http://localhost:5000';
    // Emulador Android
    // apiBaseUrl = 'http://10.0.2.2:5000';
    // Dispositivos físicos - use seu IP real na rede
    // apiBaseUrl = 'http://192.168.1.X:5000'; // Substitua X pelo seu número IP
  }

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Função para exibir alertas compatível com web e mobile
  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    if (Platform.OS === "web") {
      // Alerta para web
      window.alert(`${title}: ${message}`);
      // Executa a callback após o alerta
      if (onConfirm) onConfirm();
    } else {
      // Alerta nativo para iOS/Android
      Alert.alert(title, message, [{ text: "OK", onPress: onConfirm }]);
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Validação básica dos campos
      if (!email || !senha) {
        showAlert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
        setIsAdmin(true, email);
        showAlert(
          "Bem-vindo, Admin!",
          "Login de administrador realizado com sucesso!",
          () => navigation.navigate("HomeMenu")
        );
        return;
      }
      // ...login comum...
      setIsAdmin(false, email);

      // 2. Validação do formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert("Erro", "Por favor, insira um email válido.");
        return;
      }

      // 3. Validação específica para registro
      if (!isLogin) {
        if (senha !== confirmarSenha) {
          showAlert("Erro", "As senhas não coincidem.");
          return;
        }
      }

      // 4. Determinar o endpoint com base no modo (login ou registro)
      const endpoint = isLogin ? "/login" : "/registro";
      console.log(`Enviando requisição para ${endpoint} com email: ${email}`);

      // 5. Enviar a requisição para o backend
      console.log("Dados a serem enviados:", { email, senha });
      const response = await axios.post(`${apiBaseUrl}${endpoint}`, {
        email,
        senha,
      });

      console.log("Resposta do servidor:", response.data);

      // 6. Processar a resposta bem-sucedida
      if (isLogin) {
        // Login bem-sucedido
        console.log("Login bem-sucedido, exibindo alerta...");
        showAlert("Sucesso", "Login realizado com sucesso!", () => {
          console.log("Redirecionando para HomeMenu após login...");
          navigation.navigate("HomeMenu");
        });
      } else {
        // Registro bem-sucedido
        console.log("Registro bem-sucedido, exibindo alerta...");
        showAlert("Sucesso", "Usuário registrado com sucesso!", () => {
          console.log("Redirecionando para HomeMenu após registro...");
          navigation.navigate("HomeMenu");
        });
      }
    } catch (error: any) {
      // 7. Tratamento de erros
      console.error("Erro na requisição:", error);

      // Extrair a mensagem de erro do backend
      const errorMessage =
        error.response?.data?.error || "Erro ao processar a solicitação";

      // Exibir alerta de erro
      showAlert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Registro"}</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Digite seu email"
        />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Digite sua senha"
        />
        {!isLogin && (
          <>
            <Text style={styles.label}>Confirmar Senha:</Text>
            <TextInput
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              placeholder="Confirme sua senha"
            />
          </>
        )}
        <Button
          title={isLogin ? "Entrar" : "Cadastrar"}
          onPress={handleSubmit}
        />
      </View>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Não tem uma conta? Crie uma!"
            : "Já tem uma conta? Faça login!"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
