import React from 'react';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
    Container,
    Header,
    CarImages
} from './styles';

export function CarDetails(){
    return(
        <Container>
            <Header>
                <BackButton onPress={ () => {} } />
            </Header>

            <CarImages>
                <ImageSlider
                    imageUrl={['https://img2.gratispng.com/20180628/stg/kisspng-2018-audi-s5-3-0t-premium-plus-coupe-audi-rs5-2017-2018-audi-a5-coupe-5b35130451d959.0738564215302049323353.jpg']}
                />
            </CarImages>
        </Container>
    );
}