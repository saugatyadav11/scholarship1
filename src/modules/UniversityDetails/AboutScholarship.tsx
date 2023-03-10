import { Box, Heading, Text } from '@chakra-ui/react';

export const AboutScholarship = ({ aboutScholarship }) => {
  return (
    <Box my={{ base: 6, md: '8' }}>
      <Heading
        as="h2"
        color="gray.900"
        fontSize={{ base: '18px', md: '20px' }}
        mb={{ base: 2, md: '4' }}
      >
        About Scholarship
      </Heading>
      <Text color="#5C5A72" fontSize={{ base: 'md', md: '18px' }}>
        {aboutScholarship}
      </Text>
    </Box>
  );
};
