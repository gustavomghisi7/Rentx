import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

import CarDTO from '../../dtos/CatDTO';
import { Car as ModelCar } from '../../database/model/Car';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';
import { api } from '../../services/api';

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo
} from './styles';

interface Params {
    car: ModelCar;
}

export const CarDetails = () => {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params;

    const netInfo = useNetInfo();
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler( event => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyleAnimation = useAnimatedStyle( () => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            ),
        }
    });

    const sliderCarsStyleAnimation = useAnimatedStyle( () => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    });

    function handleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }

    function handleBack(){
        navigation.goBack();
    }

    useEffect(() => {
        const fetchCarUpdated = async () => {
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }

        if(netInfo.isConnected === true){
            fetchCarUpdated()
        }
    }, [netInfo.isConnected]);

    return(
        <Container>
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />
            <Animated.View
                style={[headerStyleAnimation]}
            >
                <Header>
                    <BackButton onPress={handleBack} />
                </Header>

                <Animated.View style={sliderCarsStyleAnimation}>
                    <CarImages>
                        <ImageSlider
                            imagesUrl={
                                !!carUpdated.photos ? 
                                carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                            }
                        />
                    </CarImages>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>
                            R$ { netInfo.isConnected === true ? car.price : '...' }
                        </Price>
                    </Rent>
                </Details>

                {
                    carUpdated.accessories && 
                    <Accessories>
                        {
                            carUpdated.accessories.map(item => (
                                <Accessory
                                    key={item.type}
                                    name={item.name}
                                    icon={getAccessoryIcon(item.type)}
                                />
                            ))
                        }
                    </Accessories>
                }

                <About>
                    {car.about}
                </About>
            </Animated.ScrollView>

            <Footer>
                <Button
                    title="Escolher periodo do aluguel"
                    onPress={handleConfirmRental}
                    enabled={netInfo.isConnected === true}
                />

                {
                    netInfo.isConnected === false &&
                    <OfflineInfo>
                        Conecte-se a internet para ver mais detalhes e agendar seu carro
                    </OfflineInfo>
                }
            </Footer>
        </Container>
    );
}