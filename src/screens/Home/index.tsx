import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';
import CarDTO from '../../dtos/CatDTO';

import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/model/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList
} from './styles';

export const Home = () => {
    const [cars, setCars] = useState<ModelCar[]>([]);
    const [loading, setLoading] = useState(true);

    const netInfo = useNetInfo();
    const navigation = useNavigation();

    const handleCarDetails = (car: CarDTO) => {
        navigation.navigate('CarDetails', { car });
    }

    const offlineSynchronize = async () => {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const {data} = await api
                .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

                const { changes, latestVersion } = data;
                return { changes, timestamp: latestVersion }
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users;
                await api.post('/users/sync', user).catch(console.log);
            },
        });
    }

    useEffect(() => {
        let isMounted = true;
        
        const fetchCars = async () => {
            try {
                const carCollection = database.get<ModelCar>('cars');
                const data = await carCollection.query().fetch();

                if(isMounted){
                    setCars(data);
                }

            } catch (error) {
                console.log(error);

            } finally {
                if(isMounted){}
                setLoading(false);
            }
        }

        fetchCars();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect( () => {
        if(netInfo.isConnected === true){
            offlineSynchronize();
        }},[netInfo.isConnected])

    return(
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Header>
                <HeaderContent>
                    <Logo
                        width={RFValue(108)}
                        height={RFValue(12)}
                    />
                    {
                        !loading &&
                        <TotalCars>
                            Total de {cars.length} carros
                        </TotalCars>
                    }
                </HeaderContent>
            </Header>

            { loading ? <LoadAnimation /> : 
                <CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) =>
                        <Car
                            data={item}
                            onPress={() => handleCarDetails(item)} 
                        />
                    }
                />
            }
        </Container>
    );
}