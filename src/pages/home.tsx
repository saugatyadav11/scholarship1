import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { unstable_getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';

import { ScholarshipTabs } from '@/modules/User/ScholarshipTabs';
import { ApplicantTable } from '@/modules/User/ApplicantTable';

import { authOptions } from './api/auth/[...nextauth]';

const UserHomepage = () => {
  const { data: session, status } = useSession();

  return (
    <Box
      bg="gray.50"
      minH={{ base: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)' }}
      py={{ base: 6, md: 10 }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={3}
        justifyContent="space-between"
        maxW="1440px"
        mx="auto"
        px={HORIZONTAL_PADDING}
      >
        <Box>
          <Heading fontSize={{ base: '24px', md: '30px' }}>
            Welcome,{' '}
            {status === 'loading' ? (
              <Spinner color="purple.400" h="4" ml="2" w="4" />
            ) : (
              session.user.name
            )}
          </Heading>
          {status === 'loading' ? (
            <Spinner color="purple.400" h="4" mt={{ base: 1, md: 2 }} w="4" />
          ) : (
            <Text
              color="gray.600"
              fontSize={{ base: '14px', md: '18px' }}
              mt={{ base: 1, md: 2 }}
            >
              {session.user.role === 'student'
                ? 'Here are the scholarship available at the moment'
                : session.user.role === 'university-staff' &&
                  'Here are the applications at this moment'}
            </Text>
          )}
        </Box>
        <Flex gap={{ base: 2, md: '3' }}>
          <Button
            colorScheme="purple"
            size={{ base: 'sm', md: 'md' }}
            variant="outline"
          >
            Contact support
          </Button>
          <Button
            colorScheme="purple"
            size={{ base: 'sm', md: 'md' }}
            variant="outline"
          >
            Email us
          </Button>
        </Flex>
      </Flex>
      {status === 'loading' ? (
        <Center py="20">
          <Spinner color="purple.400" />
        </Center>
      ) : session.user.role === 'student' ? (
        <ScholarshipTabs />
      ) : (
        session.user.role === 'university-staff' && <ApplicantTable />
      )}
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  if (session && !session.user.role) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default UserHomepage;
