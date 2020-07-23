import React from 'react';
import AuthRotes from './auth.routes';
import { useAuth } from './../hooks/auth';
import AppRoutes from './app.routes';
import { View, ActivityIndicator } from 'react-native';

const Routes: React.FC = () => {
  const { user, isLoading } = useAuth()

  if(isLoading) {
    return(
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={"large"} color="#999" />
      </View>
    )
  }

  return user ? <AppRoutes /> : <AuthRotes />;
}

export default Routes;