import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { CarDTO } from '../../dtos/CatDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

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
    About,
    Accessories,
    Footer
} from './styles';

interface Params {
    car: CarDTO;
}

export function CarDetails(){
    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params; 

    function handleConfirmRental() {
        navigation.navigate('Scheduling', { car })
    }

    function handleBack(){
        navigation.goBack();
    }

    return(
        <Container>
            <Header>
                <BackButton onPress={handleBack} />
            </Header>

            <CarImages>
                <ImageSlider
                    imageUrl={car.photos}
                />
            </CarImages>

            <Content>
                <ContentDetails>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.rent.period}</Period>
                        <Price>R$ {car.rent.price}</Price>
                    </Rent>
                </ContentDetails>

                <Accessories>
                    {
                        car.accessories.map(accessory => (
                            <Accessory
                                key={accessory.type}
                                name={accessory.name}
                                icon={getAccessoryIcon(accessory.type)}
                            />
                        ))
                    }
                </Accessories>

                <About>{car.about}</About>
            </Content>

            <Footer>
                <Button
                    title="Escolher periodo do aluguel"
                    onPress={handleConfirmRental}
                />
            </Footer>
        </Container>
    );
}