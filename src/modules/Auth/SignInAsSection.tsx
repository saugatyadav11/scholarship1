import { Box, Button, Center, Text } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

export const SignInAsSection = () => {
  return (
    <Box>
      <Center>
        <Button
          colorScheme="purple"
          mx="auto"
          onClick={() => {
            signIn('google', {
              callbackUrl: '/onboarding',
            });
          }}
        >
          Login with Google
        </Button>
      </Center>
      <Text
        color="gray.600"
        fontSize={{ base: '12px', md: '14px' }}
        mt={{ base: 2, md: 4 }}
        textAlign="center"
      >
        We use your Google account to let you login securely without passwords.
      </Text>
    </Box>
  );
};
