import { Platform } from 'react-native';

let serverIp = '10.0.2.2'; // IP padrão para emulador Android

try {
  const { SERVER_IP } = require('./meuIp');
  if (SERVER_IP) {
    serverIp = SERVER_IP;
  }
} catch (e) {
  console.warn('Arquivo meuIp.ts não encontrado, usando IP padrão para emuladores');
}

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }
  
  return `http://${serverIp}:5000`;
};

export const API_URL = getApiUrl();