import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import {
    Container,
    IconContainer,
    InputText,
    ChangePassVisibilityButton
} from './styles';

interface Props extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export const PasswordInput = ({
    iconName,
    value,
    ...rest
} : Props ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const theme = useTheme();

    const handlePasswordVisibilityChange = () => {
        setIsPasswordVisible(prevState => !prevState);
    }

    const handleInputFocus = () => {
        setIsFocused(true);
    }

    const handleInputBlur = () => {
        setIsFocused(false);
        setIsFilled(!!value);
    }

    return (
        <Container>
            <IconContainer isFocused={isFocused}>
                <Feather
                    name={iconName}
                    size={24}
                    color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_datail}
                />
            </IconContainer>

            <InputText
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                isFocused={isFocused}
                secureTextEntry={isPasswordVisible}
                autoCorrect={false}
                {...rest}
            />

            <ChangePassVisibilityButton onPress={handlePasswordVisibilityChange}>
                <IconContainer isFocused={isFocused}>
                    <Feather
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={24}
                        color={theme.colors.text_datail}
                    />
                </IconContainer>
            </ChangePassVisibilityButton>
        </Container>
    );
}