import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect
} from 'react';

import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User'

interface User {
    id: string;
    user_id: string;
    email: string;
    name: string;
    driver_license: string;
    avatar: string;
    token: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    updatedUser: (user: User) => Promise<void>;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextData>( {} as AuthContextData);

const AuthProvider = ({ children } : AuthProviderProps) => {
    const [data, setData] = useState<User>( {} as User );
    const [loading, setLoading] = useState(true);

    const signIn = async ({ email, password } : SignInCredentials) => {
        try{
            const response = await api.post('/sessions', {
                email,
                password
            });

            const { token, user } = response.data;
            api.defaults.headers.authorization = `Bearer ${token}`;

            const newUser = await database.write(async() => {
                const userCollection = await database.get<ModelUser>('users')
                    .create(( newUser ) => {
                        newUser.user_id = user.id,
                        newUser.name = user.name,
                        newUser.email = user.email
                        newUser.driver_license = user.driver_license
                        newUser.avatar = user.avatar
                        newUser.token = token
                    }
                );
            });
            
            setData({ ...user, token });

        } catch(error) {
            throw new Error(error)
        }   
    }

    const signOut = async () => {
        try {

            await database.write(async () => {
                const userSelected = database.get<ModelUser>('users').find(data.id);
                (await userSelected).destroyPermanently();
            });

            setData({} as User);
            
        } catch (error) {
            throw new Error(error);
        }
    }

    const updatedUser = async (user: User) => {
        try{
            const newUser = await database.write(async () => {
                const userSelected = database.get<ModelUser>('users').find(data.id);

                (await userSelected).update((userData) => {
                    userData.name = user.name,
                    userData.email = user.email,
                    userData.driver_license = user.driver_license,
                    userData.avatar = user.avatar
                });
            });


            setData(user);

        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        let isMounted = true;

        const loadUserData = async () => {
            try {
                const userCollection = database.get<ModelUser>('users');
                const response = await userCollection.query().fetch();

                if(response.length > 0){
                    const userData = response[0]._raw as unknown as User;
                    api.defaults.headers.authorization = `Bearer ${userData.token}`;

                    if(loading){
                        setData(userData);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.log(error);

            } finally {
                if(isMounted) {

                }
            }
        }

        loadUserData();

        return () => {
            setLoading(false);
        };
    }, []);

    return(
        <AuthContext.Provider
            value={{
                user: data,
                signIn,
                signOut,
                updatedUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };