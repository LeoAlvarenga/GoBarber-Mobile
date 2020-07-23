import React, { useCallback, useRef } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";

import LogoImg from "../../assets/logo.png";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/Feather";

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import getValidationErrors from "./../../utils/getValidationErrors";
import api from "../../services/api";

interface SignInFormData {
  email: string;
  password: string;
  name: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required("Nome Obrigatório"),
        email: Yup.string()
          .required("E-mail Obrigatório")
          .email("Digite um E-mail válido"),
        password: Yup.string().required("Senha Obrigatória").min(6, 'A senha deve conter pelo menos 6 caracteres'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      api.post('/users', data)

      Alert.alert(
        'Cadastro Realizado com sucesso!',
        'Você já pode realizar Login na aplicação.'
      )

      navigation.navigate("SignIn")
    } catch (error) {
      console.log(error);
      if (error instanceof Yup.ValidationError) {
        const validationErrors = getValidationErrors(error);
        console.log(validationErrors)
        formRef.current?.setErrors(validationErrors);
      }

      Alert.alert(
        "Erro no cadastro",
        'Ocorreu um erro ao realizar cadastro, tente novamente mais tarde',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={LogoImg} />
            <View>
              <Title>Criar uma conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
          </Container>
        </ScrollView>
        <BackToSignInButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" />
          <BackToSignInButtonText>Voltar para Logon</BackToSignInButtonText>
        </BackToSignInButton>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
