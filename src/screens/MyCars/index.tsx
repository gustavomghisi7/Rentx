import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/model/Car';
import { api } from '../../services/api';
import { LoadAnimation } from '../../components/LoadAnimation';
import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate
} from './styles';

interface DataProps{
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}

export const MyCars = () => {
    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);
    const isFocus = useIsFocused();

    const theme = useTheme();
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect( () => {
        const fetchCars = async () => {
            try {
                const response = await api.get(`/rentals`);
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })

                setCars(dataFormatted);
            } catch (error) {
                console.log(error);
        
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [isFocus]);


    return (
        <Container>
            <Header>
                <StatusBar
                    barStyle="light-content"
                    translucent
                    backgroundColor="transparent"
                />
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />

                <Title>
                    Seus agendamentos{'\n'}
                    estão aqui.
                </Title>

                <SubTitle>
                    Conforto, segurança e praticidade.
                </SubTitle>
            </Header>

            { loading ? <LoadAnimation /> : 
                <Content>
                    <Appointments>
                        <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                        <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                    </Appointments>

                    <FlatList
                        data={cars}
                        keyExtractor={item => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) => (
                            <CarWrapper>
                                <Car data={item.car} />
                                <CarFooter>
                                    <CarFooterTitle>Periodo</CarFooterTitle>
                                    <CarFooterPeriod>
                                        <CarFooterDate>{item.start_date}</CarFooterDate>
                                            <AntDesign
                                                name="arrowright"
                                                size={20}
                                                color={theme.colors.title}
                                                style={{ marginHorizontal: 11}}
                                            />
                                        <CarFooterDate>{item.end_date}</CarFooterDate>
                                    </CarFooterPeriod>
                                </CarFooter>
                            </CarWrapper>
                        )}
                    />
                </Content> 
            } 
        </Container>
    );
}