import { Box, Center, Heading, Text } from '@chakra-ui/react';

export const RoleCard = ({
  isSelected,
  description,
  icon,
  title,
  ...props
}) => {
  return (
    <Box
      _hover={{ shadow: 'lg' }}
      bg="white"
      border={isSelected ? '1px solid' : '1px solid'}
      borderColor={isSelected ? 'purple.400' : 'gray.200'}
      borderRadius="8px"
      p="6"
      shadow={isSelected ? 'lg' : 'sm'}
      textAlign="left"
      transition="0.3s ease-in-out"
      {...props}
    >
      <Center
        bg="purple.50"
        borderRadius="12px"
        color="purple.500"
        h="10"
        w="10"
      >
        {icon}
      </Center>
      <Heading color="gray.900" fontSize="sm" fontWeight="600" mb="1" mt="4">
        {title}
      </Heading>
      <Text color="gray.600" fontSize="xs">
        {description}
      </Text>
    </Box>
  );
};
