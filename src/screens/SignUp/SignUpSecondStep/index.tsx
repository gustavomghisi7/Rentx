import React, { useState } from 'react';
import { Alert } from 'react-native';

import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { api } from '../../../services/api';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';

import {
    Container,
    Header,
    Steps,
    Title,
    SubTitle,
    Form,
    FormTitle
} from './styles';

interface Params {
    user: {
        name: string;
        email: string;
        driverLicense: string;
    }
}

export const SignUpSecondStep = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme();

    const { user } = route.params as Params;

    function handleBack() {
        navigation.goBack();
    }

    const handleRegister = async () => {
        if(!password || !passwordConfirm){
            return Alert.alert('Informe a senha e a confirmação');
        }

        if(password != passwordConfirm){
            return Alert.alert('As senhas não são iguais');
        }

        //Enviar e-mail para api cadastrar
        await api.post('/users', {
            name: user.name,
            email: user.email,
            driver_license: user.driverLicense,
            password,
        })
        .then( () => {
            //Chamar a tela de cadastrado
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'SignIn',
                title: 'Conta Criada!',
                message: `Agora é só fazer o login\ne aproveitar.`
            });
        })
        .catch( (error) => {
            console.log(error)
            Alert.alert('Opa', 'Não foi possível cadastrar');
        });
    }

    return(
        <KeyboardAvoidingView
            behavior="position"
            enabled
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <BackButton onPress={handleBack} />
                        <Steps>
                            <Bullet />
                            <Bullet active />
                        </Steps>
                    </Header>

                    <Title>
                        Crie sua{'\n'}
                        conta
                    </Title>

                    <SubTitle>
                        Faça seu cadastro de{'\n'}
                        forma rápida e fácil.
                    </SubTitle>

                    <Form>
                        <FormTitle>2. Senha</FormTitle>

                        <PasswordInput
                            iconName="lock"
                            placeholder="Senha"
                            onChangeText={setPassword}
                            value={password}
                        />
                        <PasswordInput
                            iconName="lock"
                            placeholder="Repetir Senha"
                            onChangeText={setPasswordConfirm}
                            value={passwordConfirm}
                        />
                    </Form>

                    <Button
                        color={theme.colors.success}
                        title="Cadastrar"
                        enabled={true}
                        onPress={handleRegister}
                    />

                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}