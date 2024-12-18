import { Text, Pressable, IPressableProps } from 'native-base';

type GroupProps = IPressableProps & {
    name: string;
    isActive: boolean;
}

export default function Group({ name, isActive, ...rest }: GroupProps) {
    return (
        <Pressable
            mr={3}
            w={24}
            h={10}
            bg='gray.600'
            rounded='md'
            justifyContent='center'
            alignItems='center'
            overflow='hidden'
            {...rest}
            isPressed={isActive}
            _pressed={{
                borderWidth: 1,
                borderColor: 'green.500'
            }}
        >
            <Text
                color={isActive ? 'green.500' : 'gray.200'}
                textTransform='uppercase'
                fontSize='xs'
                fontWeight='bold'
            >
                {name}
            </Text>
        </Pressable>
    );
}