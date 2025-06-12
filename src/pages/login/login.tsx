import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import styles from "./login.styles";
import { API_URL } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({
  navigation,
  setIsAdmin,
}: {
  navigation: any;
  setIsAdmin: (isAdmin: boolean, email: string, nome?: string) => void;
}) => {
  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_SENHA = "admin123";
  const USER_AUTH_KEY = "@cantina_user_auth";

  // Usar diretamente a configuração do API_URL do arquivo api.ts que já utiliza o meuIp.ts
  const apiBaseUrl = API_URL;

  console.log("Usando URL da API:", apiBaseUrl);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSuccessfulLogin = async (userData: any) => {
    try {
      const userAuthData = {
        userId: userData.userId || userData._id || userData.id,
        email: userData.email,
        name: userData.nome || userData.name,
        isAuthenticated: true,
        timestamp: new Date().toISOString(),
      };

      // Salvar no AsyncStorage
      await AsyncStorage.setItem(USER_AUTH_KEY, JSON.stringify(userAuthData));

      console.log("Dados de autenticação salvos com sucesso:", userAuthData);

      navigation.navigate("HomeMenu");
    } catch (error) {
      console.error("Erro ao salvar dados de autenticação:", error);
      showAlert("Erro", "Não foi possível salvar os dados de login.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!email || !senha) {
        showAlert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
        const adminData = {
          _id: "admin123", // ID fixo para o administrador
          email: ADMIN_EMAIL,
          nome: "Admin",
        };

        setIsAdmin(true, email, "Admin");

        await handleSuccessfulLogin(adminData);

        showAlert(
          "Bem-vindo, Admin!",
          "Login de administrador realizado com sucesso!",
          () => navigation.navigate("HomeMenu")
        );
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert("Erro", "Por favor, insira um email válido.");
        return;
      }

      setLoading(true);

      if (isLogin) {
        // Processo de login
        try {
          console.log(`Tentando fazer login em: ${apiBaseUrl}/login`);

          const response = await axios.post<{ nome: string; userId: string }>(
            `${apiBaseUrl}/login`,
            {
              email,
              senha,
            }
          );

          if (response.status === 200) {
            const { nome, userId } = response.data;
            await AsyncStorage.setItem(
              "@cantina_user_auth",
              JSON.stringify({
                isAuthenticated: true,
                name: nome,
                userId,
                email,
              })
            );
            setIsAdmin(false, email, nome);
            showAlert("Sucesso", "Login realizado com sucesso!", () =>
              handleSuccessfulLogin(response.data)
            );
          }
        } catch (error: any) {
          console.error("Erro ao fazer login:", error);
          if (error.response) {
            showAlert(
              "Erro",
              error.response.data.message || "Credenciais inválidas."
            );
          } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            showAlert(
              "Erro",
              "Não foi possível conectar ao servidor. Verifique sua conexão."
            );
          } else {
            // Erro ao configurar a requisição
            showAlert("Erro", "Ocorreu um erro ao processar sua solicitação.");
          }
        }
      } else {
        // Processo de registro
        // Validações adicionais para registro
        if (email === ADMIN_EMAIL) {
          showAlert("Erro", "Este email não pode ser utilizado para registro.");
          return;
        }

        if (!nome) {
          showAlert("Erro", "Por favor, digite seu nome.");
          return;
        }

        if (senha !== confirmarSenha) {
          showAlert("Erro", "As senhas não coincidem.");
          return;
        }

        try {
          console.log(`Tentando registrar em: ${apiBaseUrl}/registro`);

          const response = await axios.post(`${apiBaseUrl}/registro`, {
            email,
            senha,
            nome,
          });

          if (response.status === 201 || response.status === 200) {
            showAlert(
              "Sucesso",
              "Conta criada com sucesso! Faça login para continuar.",
              () => {
                setIsLogin(true);
                setSenha("");
                setConfirmarSenha("");
              }
            );
          }
        } catch (error: any) {
          console.error("Erro ao registrar:", error);
          if (error.response) {
            showAlert(
              "Erro",
              error.response.data.message ||
                "Não foi possível completar o registro."
            );
          } else if (error.request) {
            showAlert(
              "Erro",
              "Não foi possível conectar ao servidor. Verifique sua conexão."
            );
          } else {
            showAlert("Erro", "Ocorreu um erro ao processar sua solicitação.");
          }
        }
      }
    } catch (error: any) {
      console.error("Erro inesperado:", error);
      showAlert(
        "Erro",
        "Ocorreu um erro inesperado. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Registro"}</Text>
      <View style={styles.form}>
        {!isLogin && (
          <>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
              editable={!loading}
            />
          </>
        )}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Digite seu email"
          editable={!loading}
        />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Digite sua senha"
          editable={!loading}
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
              editable={!loading}
            />
          </>
        )}
        <TouchableOpacity
          style={[styles.buttonOrange, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? "Entrar" : "Cadastrar"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
        <Text style={[styles.switchText, loading && styles.textDisabled]}>
          {isLogin
            ? "Não tem uma conta? Crie uma!"
            : "Já tem uma conta? Faça login!"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
