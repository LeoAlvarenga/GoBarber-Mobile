import "react-native-gesture-handler";

import React from "react";
import { View, Text, StatusBar } from "react-native";

import Routes from "./routes";
import { NavigationContainer } from "@react-navigation/native";
import AppProvider from "./hooks";

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#312e28" />
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: "#312e38" }}>
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
