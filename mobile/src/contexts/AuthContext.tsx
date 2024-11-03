import { createContext, ReactNode, useEffect, useState } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { tagHystoryUpdate, tagUserInfoCreate } from "src/notifications/notificationsTags";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO,
    authToken: string,
    signIn: (email: string, password: string) => Promise<void>,
    signOut: () => Promise<void>,
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>,
    isLoadingUserStorageData: boolean
};

type AuthContextProviderProps = {
    children: ReactNode,
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export default function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [authToken, setAuthToken] = useState('');
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(false);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
        setAuthToken(token);
    }
    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true);

            await storageUserSave(userData);
            await storageAuthTokenSave({ token, refresh_token });
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(true);
        }
    }


    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password })

            if (data.user && data.token && data.refresh_token) {
                setIsLoadingUserStorageData(true);

                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)

                userAndTokenUpdate(data.user, data.token);
            }
        }
        catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }
    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet();
            const { token } = await storageAuthTokenGet();

            if (userLogged && token) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }
    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            setAuthToken('');
            await storageUserRemove();
            await storageAuthTokenRemove();
            tagUserInfoCreate();
            tagHystoryUpdate();
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }
    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        loadUserData();
    }, [])

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);
        return () => {
            subscribe();
        }
    }, [signOut])

    return (
        <AuthContext.Provider value={{
            user,
            authToken,
            signIn,
            signOut,
            updateUserProfile,
            isLoadingUserStorageData
        }}>
            {children}
        </AuthContext.Provider>
    )
}
