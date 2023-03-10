import { Grid, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

const Error404 = () => {
  return (
    <Grid placeItems="center">
      <Heading mt="40">404: Page not found</Heading>
      <Link href="/">
        <Text
          _hover={{ textDecoration: 'underline' }}
          color="purple.600"
          fontWeight="medium"
          mt="2"
        >
          Go to home
        </Text>
      </Link>
    </Grid>
  );
};

export default Error404;
