import { TouchableOpacity } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'

import useAuth from '@hooks/useAuth';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import UserPhoto from '@components/UserPhoto';
import { api } from '@services/api';

export default function HomeHeader() {
    const { user, signOut } = useAuth();

    return (
        <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>
            <UserPhoto
                source={
                    user.avatar
                        ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                        : defaultUserPhotoImg
                }
                alt='imagem do usuário'
                size={16}
                mr={4}
            />
            <VStack flex={1}>
                <Text color='gray.100' fontSize='md'>
                    olá
                </Text>

                <Heading color='gray.100' fontSize='md' fontFamily='heading'>
                    {user.name}
                </Heading>
            </VStack>

            <TouchableOpacity
                onPress={signOut}
            >
                <Icon
                    as={MaterialIcons}
                    name='logout'
                    color='gray.200'
                    size={7}
                />
            </TouchableOpacity>
        </HStack>
    )
}