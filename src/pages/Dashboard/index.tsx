import React from "react";
import { View } from "react-native";
import { useAuth } from "../../hooks/auth";
import Button from "../../components/Button";

// import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex:1, justifyContent: "center"}}>
      <Button onPress={signOut}>Sair</Button>
    </View>
  );
};

export default Dashboard;
