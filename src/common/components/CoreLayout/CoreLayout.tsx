import { Box } from '@chakra-ui/react';

import { Nav } from './Nav';

export const CoreLayout = ({ children }) => {
  return (
    <>
      <Nav />
      <Box as="main">{children}</Box>
    </>
  );
};
