import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import api from "../services/api";

interface SignInCredencials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredencials): Promise<void>;
  signOut(): void;
  isLoading: boolean;
}

interface AuthState {
  token: string;
  user: object;
}

//create the context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

//creates the provider of auth data
export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet(["@GoBarber:token","@GoBarber:user"]);

      if(token[1] && user[1]) {
          setData({token: token[1], user: JSON.parse(user[1])})
      }

      setIsLoading(false)
    }

    loadStorageData();
  },[]);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("sessions", {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ["@GoBarber:token", token],
      ["@GoBarber:user", JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(["@GoBarber:token", "@GoBarber:user"]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
