import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Routes from './routes/routes';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Routes />
    </>
  );
}