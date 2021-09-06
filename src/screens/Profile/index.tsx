import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNetInfo } from '@react-native-community/netinfo';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import { useAuth } from '../../hooks/auth';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PasswordInput } from '../../components/PasswordInput';

import {
    Container,
    Header,
    HeaderTop,
    HeaderTitle,
    LogoutButton,
    PhotoContainer,
    Photo,
    PhotoButton,
    Content,
    Options,
    Option,
    OptionTitle,
    Section
} from './styles';

export const Profile = () => {
    const { user, signOut, updatedUser } = useAuth();
    const netInfo = useNetInfo();

    const theme = useTheme();
    const navigation = useNavigation();

    const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.name);
    const [driverLicense, setDriverLicense] = useState(user.driver_license);

    const handleBack = () => {
        navigation.goBack();
    }

    const handleOptionChange = (optionSelected: 'dataEdit' | 'passwordEdit') => {
        if(netInfo.isConnected === false && optionSelected === 'passwordEdit'){
            Alert.alert('Você está Offline', 'Para mudar a senha, conecte-se a internet');
        } else {
            setOption(optionSelected);
        }
    }

    const handleSelectAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        });

        if(result.cancelled){
            return;
        }

        if(result.uri){
            setAvatar(result.uri);
        }
    }

    const handleProfileUpdate = async () => {
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string()
                .required('CNH é obrigatório.'),
                name: Yup.string()
                .required('Nome é obrigatório')
            });

            const data = { name, driverLicense };
            await schema.validate(data);

            await updatedUser({
                id: user.id,
                user_id: user.user_id,
                email: user.email, 
                name,
                driver_license: driverLicense,
                avatar,
                token: user.token
            });

            Alert.alert('Perfil Atualizado!')

        } catch(error) {
            if(error instanceof Yup.ValidationError){
                Alert.alert('Opa', error.message);
            } else {
                Alert.alert('Não foi possivel atualizar o Perfil');
            }
            
        }
    }

    const handleSingOut = async () => {
        Alert.alert(
            'Tem certeza?',
            'Se você sair, irá precisar de internet para conectar-se novamente.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: 'Confirmar',
                    onPress: () => signOut()
                }
            ]
        )
    }

    return(
        <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <HeaderTop>
                            <BackButton
                                color={theme.colors.shape}
                                onPress={handleBack}
                            />
                            <HeaderTitle>Editar Perfil</HeaderTitle>
                            <LogoutButton onPress={handleSingOut}>
                                <Feather
                                    name="power"
                                    size={24}
                                    color={theme.colors.shape}
                                />
                            </LogoutButton>
                        </HeaderTop>

                        <PhotoContainer>
                            { !!avatar && <Photo source={{ uri: avatar }} /> }
                            <PhotoButton onPress={handleSelectAvatar}>
                                <Feather
                                    name="camera"
                                    size={24}
                                    color={theme.colors.shape}
                                />
                            </PhotoButton>
                        </PhotoContainer>
                    </Header>

                    <Content style={{ marginBottom: useBottomTabBarHeight() }}>
                        <Options>
                            <Option
                                active={option === 'dataEdit'}
                                onPress={() => handleOptionChange('dataEdit')}
                            >
                                <OptionTitle active={option === 'dataEdit'}>
                                    Dados
                                </OptionTitle>
                            </Option>
                            <Option
                                active={option === 'passwordEdit'}
                                onPress={() => handleOptionChange('passwordEdit')}
                            >
                                <OptionTitle active={option === 'passwordEdit'}>
                                    Trocar Senha
                                </OptionTitle>
                            </Option>
                        </Options>

                        {
                            option === 'dataEdit' ? 
                            <Section>
                                <Input
                                    iconName="user"
                                    placeholder="Nome"
                                    autoCorrect={false}
                                    defaultValue={user.name}
                                    onChangeText={setName}
                                />
                                <Input
                                    iconName="mail"
                                    editable={false}
                                    defaultValue={user.email}
                                />
                                <Input
                                    iconName="credit-card"
                                    placeholder="CNH"
                                    keyboardType="numeric"
                                    defaultValue={user.driver_license}
                                    onChangeText={setDriverLicense}
                                />
                            </Section>
                            :
                            <Section>
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Senha atual"
                                />
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Nova Senha"
                                />
                                <PasswordInput
                                    iconName="lock"
                                    placeholder="Digite Novamente"
                                />
                            </Section>
                        }

                        <Button
                            title="Salvar alterações"
                            onPress={handleProfileUpdate}
                        />
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}