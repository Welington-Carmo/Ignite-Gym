import { Center, Heading } from "native-base";

type ScreensHeaderProps = {
    title: string;
}

export default function ScreensHeader({ title }: ScreensHeaderProps) {
    return (
        <Center bg='gray.600' pb={6} pt={16}>
            <Heading color='gray.100' fontSize='xl' fontFamily='heading'>
                {title}
            </Heading>
        </Center>
    );
}