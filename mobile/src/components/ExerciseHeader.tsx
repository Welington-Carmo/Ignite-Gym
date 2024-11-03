import { VStack, Icon, HStack, Heading, Text } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Feather } from '@expo/vector-icons'

import Bodysvg from '@assets/body.svg'

type ExerciseHeaderProps = TouchableOpacityProps & {
    title: string,
    group: string,
}

export default function ExerciseHeader({ title, group, ...rest }: ExerciseHeaderProps) {
    return (
        <VStack px={8} bg='gray.600' pt={12}>
            <TouchableOpacity {...rest}>
                <Icon
                    as={Feather}
                    name='arrow-left'
                    color='green.500'
                    size={6}
                />
                <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
                    <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
                        {title}
                    </Heading>

                    <HStack alignItems='center'>
                        <Bodysvg />
                        <Text color='gray.200' ml={1} textTransform='capitalize'>
                            {group}
                        </Text>
                    </HStack>
                </HStack>
            </TouchableOpacity>
        </VStack>
    )
}