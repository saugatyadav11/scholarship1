import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { unstable_getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { reloadSession } from '@/common/reloadSession';

import { RoleChoosingSection } from '@/modules/OnBoarding/RoleChoosingSection';

import { authOptions } from './api/auth/[...nextauth]';

const OnboardingPage = () => {
  const { data: session, status } = useSession();

  const [selectedSignInOption, setSelectedSignInOption] = useState<
    'university-staff' | 'student'
  >();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const toast = useToast();

  const router = useRouter();

  const sendData = async (apiUrl, method, formData) => {
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data || 'Something went wrong';
    }

    return data;
  };

  const label = {
    'university-staff': 'University staff',
    student: 'Student',
  };

  const handleSubmit = async () => {
    if (!selectedSignInOption) {
      toast({
        title: 'Please select the role.',
        description: 'Click on your desired role to select the role.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (status !== 'authenticated') {
      return;
    }

    setIsSubmitting(true);

    try {
      await sendData('/api/user/set-role', 'POST', {
        role: selectedSignInOption,
      });
      setIsSubmitting(false);
      toast({
        title: 'Role added.',
        description:
          "We've added role your account for you. Please wait. redirecting....",
        status: 'success',
        duration: 5000,
      });
      setSelectedSignInOption(undefined);
      setIsSubmittedSuccessfully(true);
      reloadSession();
      router.push('/home');
    } catch (error) {
      toast({
        title: 'Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setSelectedSignInOption(undefined);
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      bg="gray.50"
      minH={{ base: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)' }}
      py={{ base: 6, md: 10 }}
    >
      <Flex
        alignItems="center"
        direction={{ base: 'column', md: 'row' }}
        gap={3}
        justifyContent="space-between"
        maxW="1440px"
        mx="auto"
        px={HORIZONTAL_PADDING}
      >
        <Box textAlign="center" w="full">
          <Heading fontSize={{ base: '24px', md: '30px' }}>
            Welcome,{' '}
            {status === 'loading' ? (
              <Spinner color="purple.400" h="4" ml="2" w="4" />
            ) : (
              session.user.name
            )}
          </Heading>
          <Text
            color="gray.600"
            fontSize={{ base: '14px', md: '18px' }}
            my={{ base: 1, md: 2 }}
          >
            Please choose your role
          </Text>
          <RoleChoosingSection
            mt="4"
            selectedSignInOption={selectedSignInOption}
            setSelectedSignInOption={setSelectedSignInOption}
          />
          <Box mt="4">
            {selectedSignInOption && (
              <Text>
                You selected{' '}
                <Box as="span" fontWeight="bold">
                  {label[selectedSignInOption]}
                </Box>{' '}
              </Text>
            )}
            <Button
              colorScheme="purple"
              disabled={
                isSubmittedSuccessfully ||
                isSubmitting ||
                status !== 'authenticated'
              }
              isLoading={isSubmitting || status === 'loading'}
              maxW="250px"
              mt="4"
              size={{ base: 'sm', md: 'md' }}
              variant="solid"
              w="full"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Flex>
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
  if (session && session.user.role) {
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

export default OnboardingPage;
