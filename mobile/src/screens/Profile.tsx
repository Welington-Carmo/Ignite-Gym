import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import useAuth from '@hooks/useAuth';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'


import UserPhoto from '@components/UserPhoto';
import ScreensHeader from '@components/ScreensHeader';
import Input from '@components/input';
import Button from '@components/button';

const PHOTO_SIZE = 33;


type FormDataProps = {
    name: string;
    email: string;
    password?: string | null;
    old_password?: string | null;
    confirm_password?: string | null;
}

const profileSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome'),

    email: yup
        .string()
        .required(),

    old_password: yup.string().nullable(),

    password: yup
        .string()
        .min(8, 'A senha deve ter pelo menos 8 dígitos.')
        .nullable()
        .transform((value) => !!value ? value : null),

    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .when('password', {
            is: (Field: any) => Field,
            then: schema => schema
                .nullable()
                .required('Informe a confirmação da senha.')
                .transform((value) => !!value ? value : null)
        })
        .oneOf([yup.ref('password')], 'A confirmação de senha não confere.')
})

export default function Profile() {
    const [isUpdating, setIsUpdatng] = useState(false)
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });
    async function handleUserPhotoSelected() {
        setPhotoIsLoading(true);

        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) {
                return;
            }
            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {

                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }
                const fileEctension = photoSelected.assets[0].uri.split('.').pop()
                console.log(fileEctension);
                const photoFile = {
                    name: `${user.name}.${fileEctension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileEctension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    title: 'foto atualizada!',
                    placement: 'top',
                    bgColor: 'green.500'
                })
            }

        } catch (error) {
            console.log(error)
        } finally {
            setPhotoIsLoading(false)
        }
    }
    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdatng(true);

            const userUpdated = user;
            userUpdated.name = data.name

            await api.put('/users', data);
            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso.',
                placement: 'top',
                bgColor: 'green.500'
            });

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar as informações do perfil.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsUpdatng(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreensHeader title='Perfil' />
            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto
                                source={
                                    user.avatar
                                        ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                                        : defaultUserPhotoImg
                                }
                                alt="Foto do usuário"
                                size={PHOTO_SIZE}
                            />
                    }

                    <TouchableOpacity onPress={handleUserPhotoSelected}>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="E-mail"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />


                    <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Alterar senha
                    </Heading>
                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { onChange } }) => (
                            <Input
                                bg="gray.600"
                                placeholder="Confirme a nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    />
                    <Button
                        title="Atualizar"
                        mt={4}
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                    />

                </Center>
            </ScrollView>
        </VStack>
    );
}