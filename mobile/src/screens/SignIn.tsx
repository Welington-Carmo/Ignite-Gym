import { VStack, Image, Text, Center, Heading, ScrollView, Box, useToast, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import useAuth from '@hooks/useAuth'
import { AppError } from '@utils/AppError';

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png';

import Input from '@components/input';
import Button from '@components/button';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
    email: string;
    password: string;
}

export default function SignIn() {
    const [isLoading, setIsloading] = useState(false);

    const { signIn } = useAuth();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    async function handleSignIn({ email, password }: FormData) {
        try {
            setIsloading(true);
            await signIn(email, password);

        } catch (error) {
            const isAppError = error instanceof AppError

            const title = isAppError ? error.message : 'Não foi possível entrar, tente novamente mais tarde'
            setIsloading(false);
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    function handleNewAccount() {
        navigation.navigate('SignUp');
    }
    return (

        <VStack flex={1}>
            <Image
                source={BackgroundImg}
                alt='pessoas treinando'
                position='absolute'
                resizeMode='stretch'
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <Box flex={1} px={10} pb={16}>
                    <Center my={24}>
                        <LogoSvg />
                        <Text color='gray.100' fontSize='sm'>
                            Treine sua mente e o seu corpo
                        </Text>
                    </Center>
                    <Center>
                        <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
                            Acesse sua conta
                        </Heading>
                        <Controller
                            control={control}
                            name='email'
                            rules={{ required: 'Informe o e-mail' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder='E-mail'
                                    keyboardType='email-address'
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.email?.message}
                                    autoCapitalize='none'
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='password'
                            rules={{ required: 'Informe a senha' }}
                            render={({ field: { onChange } }) => (
                                <Input
                                    placeholder='Senha'
                                    secureTextEntry
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Button
                            title='Acessar'
                            onPress={handleSubmit(handleSignIn)}
                            isLoading={isLoading}
                        />
                    </Center>
                    <Center mt={24}>
                        <Text color='gray.100' fontSize='sm' marginBottom={3} fontFamily='body'>
                            Ainda não tem acesso?
                        </Text>
                        <Button
                            title='Criar conta'
                            variant='outline'
                            onPress={handleNewAccount}
                        />
                    </Center>
                </Box>
            </ScrollView >
        </VStack>

    );
}