import React, { useCallback, useRef } from "react";
import { View, Image, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Yup from 'yup'

import LogoImg from "../../assets/logo.png";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/Feather";

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import getValidationErrors from "./../../utils/getValidationErrors";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation()

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail Obrigatório")
            .email("Digite um E-mail válido"),
          password: Yup.string().required("Senha Obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // await signIn({
        //   email: data.email,
        //   password: data.password,
        // });

        // history.push('/dashboard')
      } catch (error) {
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(error);
          formRef.current?.setErrors(validationErrors);
        }

        Alert.alert('Erro na autenticação','Erro ao fazer login, cheque as credenciais.' )
      }
    },
    []
  );

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
              <Title>Faça seu Logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
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

            <ForgotPassword>
              <ForgotPasswordText>Esqueci a senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
        <CreateAccountButton onPress={() => navigation.navigate("SignUp")}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </CreateAccountButton>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
