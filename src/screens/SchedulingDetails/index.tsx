import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import CarDTO from '../../dtos/CatDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';

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
    Accessories,
    Footer
} from './styles';

interface Params {
    car: CarDTO;
    dates: string[];
}

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}

export const SchedulingDetails = () => {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
    const [loading, setLoading] = useState(true);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const netInfo = useNetInfo();

    const { car, dates } = route.params as Params; 

    const rentTotal = Number(dates.length * car.price)

    const handleConfirmRental = async () => {
        setLoading(true);

        await api.post('schedules_byuser', {
            user_id: 1,
            car_id: car.id,
            start_date: new Date (dates[0]),
            end_date: new Date (dates[dates.length - 1]),
            total: rentTotal
        }).then( () => {
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'Home',
                title: 'Carro alugado',
                message: `Agora voc?? s?? precisa ir\na concession??ria da RENTX\npegar o seu autom??vel.`,
            })
        })
        .catch( () => {
            setLoading(true);
            Alert.alert('N??o foi poss??vel confirmar o agendamento')
        })
    }

    function handleBack(){
        navigation.goBack();
    }

    useEffect( () => {
        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date (dates[0])), 'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date (dates[dates.length -1])), 'dd/MM/yyyy'),
        })
    }, [])

    useEffect(() => { 
        const fetchCarUpdated = async () => {
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }

        if(netInfo.isConnected === true){
            fetchCarUpdated()
        }
    }, [netInfo.isConnected])
    
    return(
        <Container>
            <Header>
                <BackButton onPress={handleBack} />
            </Header>

            <CarImages>
                <ImageSlider
                    imagesUrl = {
                        !!carUpdated.photos ? 
                        carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                    }
                />
            </CarImages>

            <Content>
                <ContentDetails>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </ContentDetails>

                <Accessories>
                    {
                        car.accessories.map(item => (
                            <Accessory
                                key={item.type}
                                name={item.name}
                                icon={getAccessoryIcon(item.type)}
                            />
                        ))
                        
                    }
                </Accessories>

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
                        <DateValue>{rentalPeriod.startFormatted}</DateValue>
                    </DateInfo>

                    <Feather
                        name="chevron-right"
                        size={RFValue(20)}
                        color={theme.colors.text}
                    />

                    <DateInfo>
                        <DateTitle>AT??</DateTitle>
                        <DateValue>{rentalPeriod.endFormatted}</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>{`R$ ${car.price} x${dates.length} di??rias`}</RentalPriceQuota>
                        <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button
                    title="Alugar agora"
                    color={theme.colors.success}
                    onPress={handleConfirmRental}
                    enabled={loading}
                    loading={!loading}
                />
            </Footer>
        </Container>
    );
}