import { Box, Flex, Heading, Text } from '@chakra-ui/react';

const ScholarshipInfoItem = ({ title, description }) => {
  return (
    <Flex
      alignItems="center"
      borderBottom="1px solid #E1E0EB"
      justifyContent="space-between"
      py={{ base: 4, md: '5' }}
    >
      <Text color="#09080C" fontWeight="500">
        {title}
      </Text>
      <Text color="#09080C">{description}</Text>
    </Flex>
  );
};

export const ScholarshipInfo = ({
  grantAmount,
  winners,
  provider,
  specialCriteria,
}) => {
  return (
    <Box mt={{ base: 6, md: '8' }}>
      <Heading
        as="h2"
        color="gray.900"
        fontSize={{ base: '18px', md: '20px' }}
        mb={{ base: 2, md: '4' }}
      >
        Scholarship Info
      </Heading>
      <ScholarshipInfoItem
        description={new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        }).format(grantAmount)}
        title="Grant Amount"
      />
      <ScholarshipInfoItem description={winners} title="Winners" />
      <ScholarshipInfoItem description={provider} title="Provider" />
      <ScholarshipInfoItem
        description={specialCriteria}
        title="Special criteria"
      />
    </Box>
  );
};
