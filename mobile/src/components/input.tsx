import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base'

type InputProps = IInputProps & {
    errorMessage?: string | null
}

export default function Input({ errorMessage = null, isInvalid, ...rest }: InputProps) {
    const invalid = !!errorMessage || isInvalid;
    return (
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput
                bg='gray.700'
                h={14}
                px={4}
                borderWidth={0}
                fontSize='md'
                color='white'
                fontFamily='body'
                placeholderTextColor='gray.300'
                isInvalid={invalid}
                _invalid={{
                    borderWidth: 1,
                    borderColor: 'red.500'
                }}
                _focus={{
                    bg: 'gray.700',
                    borderWidth: 1,
                    borderColor: 'green.500'
                }}
                {...rest}
            />
            <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}