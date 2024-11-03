import { useEffect, useState } from 'react';
import { VStack, Image, Box, HStack, Text, ScrollView, useToast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';

import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg'

import ExerciseHeader from '@components/ExerciseHeader';
import Button from '@components/button';
import Loading from '@components/Loading';
import { tagHystoryUpdate } from 'src/notifications/notificationsTags';

type RouteParams = {
    exerciseId: string;
}

export default function Exercise() {
    const [sendingRegiter, setSendingRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    const toast = useToast();
    const route = useRoute();

    const { exerciseId } = route.params as RouteParams;

    function handleGoBack() {
        navigation.goBack();
    }

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/exercises/${exerciseId}`);
            setExercise(data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    }
    async function handleExerciseHistoryRegister() {
        try {
            setSendingRegister(true);
            await api.post(`/history`, { exercise_id: exerciseId });

            toast.show({
                title: 'Parabéns! Exercício registrado no seu histórico.',
                placement: 'top',
                bgColor: 'green.700'
            });

            const date = new Date;

            tagHystoryUpdate(date.toLocaleDateString())
            navigation.navigate('history');
        }
        catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível registrar o exercício, tente novamente';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {
            setSendingRegister(false);
        }
    }

    useEffect(() => {
        fetchExerciseDetails();
    }, [exerciseId]);

    return (
        <VStack flex={1}>
            <ExerciseHeader
                onPress={handleGoBack}
                title={exercise.name}
                group={exercise.group}
            />
            {isLoading ?
                <Loading />
                :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <VStack p={8}>
                        <Box rounded='lg' mb={3} overflow='hidden'>
                            <Image
                                w='full'
                                h={80}
                                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                                alt='Nome do exercício'
                                resizeMode='cover'
                                rounded='lg'
                            />
                        </Box>
                        <Box bg='gray.600' rounded='md' pb={4} px={4}>
                            <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
                                <HStack>
                                    <SeriesSvg />
                                    <Text color='gray.200' ml={2}>
                                        {exercise.series} séries
                                    </Text>
                                </HStack>
                                <HStack>
                                    <RepetitionsSvg />
                                    <Text color='gray.200' ml={2}>
                                        {exercise.repetitions} repetições
                                    </Text>
                                </HStack>
                            </HStack>
                            <Button
                                title='Marcar como realizado'
                                onPress={handleExerciseHistoryRegister}
                                isLoading={sendingRegiter}
                            />
                        </Box>
                    </VStack>
                </ScrollView>
            }
        </VStack>
    );
}
