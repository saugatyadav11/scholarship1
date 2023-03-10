import { Box, Center, Heading, Text } from '@chakra-ui/react';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';

export const HomepageHeader = () => {
  return (
    <Center
      bg="linear-gradient(0deg, rgba(71, 27, 213, 0.18), rgba(71, 27, 213, 0.18)), url(/hero.jpg)"
      bgPos="center"
      bgSize="cover"
      borderBottom="1px solid"
      borderBottomColor="gray.200"
      minH="16.3125rem"
      py={{ base: '16', md: '20' }}
    >
      <Box maxW="1440px" mx="auto" px={HORIZONTAL_PADDING} textAlign="center">
        <Heading color="white" fontSize={{ base: '24px', md: '36px' }} mb="2">
          Find the best scholarships for you
        </Heading>
        <Text color="whiteAlpha.600" fontSize={{ base: '14px', md: '20px' }}>
          One place for you to find, apply and track all of your scholarships
        </Text>
      </Box>
    </Center>
  );
};
