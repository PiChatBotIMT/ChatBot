import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppDrawer from "./components/side-bar/side-bar";

export default function App() {
  // Controle global do usuário
  const [user, setUser] = React.useState<{
    email: string;
    isAdmin: boolean;
  } | null>(null);

  return (
    <NavigationContainer>
      <AppDrawer
        isAdmin={user?.isAdmin ?? false}
        setUser={setUser}
        user={user}
      />
    </NavigationContainer>
  );
}
