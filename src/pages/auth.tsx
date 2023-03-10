import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { unstable_getServerSession } from 'next-auth';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';

import { SignInAsSection } from '@/modules/Auth/SignInAsSection';

import { authOptions } from './api/auth/[...nextauth]';

const AuthPage = () => {
  return (
    <Flex
      bg="gray.50"
      direction={{ base: 'column', md: 'row' }}
      justifyContent={{ md: 'center' }}
      minH={{ base: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)' }}
      px={HORIZONTAL_PADDING}
      py={{ base: 10, md: '20' }}
    >
      <Box>
        <Heading
          color="gray.900"
          fontSize={{ base: '24px', md: '36px' }}
          mb="2"
          textAlign="center"
        >
          Register / Sign in to your account
        </Heading>

        <Text
          color="gray.600"
          fontSize={{ base: '14px', md: '20px' }}
          mb={{ base: 6, md: 8 }}
          textAlign="center"
        >
          If you don’t have an account, we’ll make one for you.
        </Text>
        <SignInAsSection />
      </Box>
    </Flex>
  );
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (session && !session.user.role) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default AuthPage;
