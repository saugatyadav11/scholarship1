import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

import { HomepageHeader } from '@/modules/Homepage/HomepageHeader';
import { LatestScholarships } from '@/modules/Homepage/LatestScholarships';

const HomePage = () => {
  return (
    <>
      <PageHead description="Home page description" name="Home" />
      <Box
        bg="gray.50"
        minH={{ base: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)' }}
      >
        <HomepageHeader />
        <LatestScholarships my={{ base: '6', md: '10' }} />
      </Box>
    </>
  );
};

export default HomePage;
