import { Box, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';

export const Card = ({ image, heading, description, ...props }) => {
  return (
    <Box
      _hover={{ shadow: 'lg' }}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="8px"
      maxH="439px"
      maxW="437.33px"
      shadow="sm"
      transition="0.3s ease-in-out"
      {...props}
    >
      <Box height={346} position="relative" w="full">
        <Image
          fill
          alt={heading}
          src={image}
          style={{
            overflow: 'hidden',
            objectFit: 'cover',
            borderRadius: '8px 8px 0px 0px',
          }}
        />
      </Box>
      <Box p="5">
        <Heading as="h3" color="gray.900" fontSize="20px" mb="2">
          {heading}
        </Heading>
        <Text fontSize="14px">{description}</Text>
      </Box>
    </Box>
  );
};
