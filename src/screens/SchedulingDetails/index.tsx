import React from 'react';

import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import speedSvg from '../../assets/speed.svg';
import accelerationSvg from '../../assets/acceleration.svg';
import forceSvg from '../../assets/force.svg';
import gasolineSvg from '../../assets/gasoline.svg';
import exchangeSvg from '../../assets/exchange.svg';
import peopleSvg from '../../assets/people.svg';

import {
    Container,
    Header,
    CarImages,
    Content,
    ContentDetails,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal,
    Acessories,

    Footer
} from './styles';

export function SchedulingDetails(){
    const theme = useTheme();
    const navigation = useNavigation();

    function handleConfirmRental() {
        navigation.navigate('SchedulingComplete')
    }
    
    return(
        <Container>
            <Header>
                <BackButton onPress={ () => {} } />
            </Header>

            <CarImages>
                <ImageSlider
                    imageUrl={['data:image/jpeg;base64,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']}
                />
            </CarImages>

            <Content>
                <ContentDetails>
                    <Description>
                        <Brand>Lamborghini</Brand>
                        <Name>Huracan</Name>
                    </Description>

                    <Rent>
                        <Period>Ao dia</Period>
                        <Price>R$ 580</Price>
                    </Rent>
                </ContentDetails>

                <Acessories>
                    <Accessory name="380km/h" icon={speedSvg} />
                    <Accessory name="3.2s" icon={accelerationSvg} />
                    <Accessory name="800 HP" icon={forceSvg} />
                    <Accessory name="Gasolina" icon={gasolineSvg} />
                    <Accessory name="Auto" icon={exchangeSvg} />
                    <Accessory name="2 pessoas" icon={peopleSvg} />
                </Acessories>

                <RentalPeriod>
                    <CalendarIcon>
                        <Feather
                            name="calendar"
                            size={RFValue(24)}
                            color={theme.colors.shape}
                        />
                    </CalendarIcon>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>18/08/2021</DateValue>
                    </DateInfo>

                    <Feather
                        name="chevron-right"
                        size={RFValue(20)}
                        color={theme.colors.text}
                    />

                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue>20/08/2021</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>R$ 580 x3 diárias</RentalPriceQuota>
                        <RentalPriceTotal>R$ 2.900</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button
                    title="Alugar agora"
                    color={theme.colors.success}
                    onPress={handleConfirmRental}
                />
            </Footer>
        </Container>
    );
}