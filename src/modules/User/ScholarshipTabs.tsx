import {
  Box,
  Center,
  Grid,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { UNIVERSITIES } from '@/common/universities';
import { Card } from '@/common/components/Card';

const TabContent = ({ tab }) => {
  const { data: session } = useSession();

  const studentDBScholarships = session.user?.scholarships ?? [];

  let scholarships = [];

  if (tab === 'available') {
    const t = [
      ...(studentDBScholarships?.applied ?? []),
      ...(studentDBScholarships?.accepted ?? []),
      ...(studentDBScholarships?.rejected ?? []),
    ];

    scholarships = UNIVERSITIES.filter((uni) => {
      return !t.includes(uni.id);
    });
  }

  if (tab === 'applied') {
    scholarships = UNIVERSITIES.filter((uni) => {
      return studentDBScholarships?.applied?.includes(uni.id);
    });
  }

  if (tab === 'accepted') {
    scholarships = UNIVERSITIES.filter((uni) => {
      return studentDBScholarships?.accepted?.includes(uni.id);
    });
  }

  if (tab === 'rejected') {
    scholarships = UNIVERSITIES.filter((uni) => {
      return studentDBScholarships?.rejected?.includes(uni.id);
    });
  }

  if (!scholarships || scholarships.length === 0) {
    return (
      <Box py="20" textAlign="center">
        <Heading fontSize="20px" fontWeight="800" mb="1">
          No {tab} scholarships
        </Heading>
        <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
          Once you have {tab} to scholarships, you can see them here.
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      gap="6"
      templateColumns={{
        base: 'repeat(auto-fill, minmax(18.75rem, 1fr))',
        lg: 'repeat(auto-fill, 27.3331rem)',
      }}
      w="full"
    >
      {scholarships.map(({ id, image, heading, description }) => {
        return (
          <Link
            key={id}
            href={`university/${id}`}
            style={{ textDecoration: 'none' }}
          >
            <Card description={description} heading={heading} image={image} />
          </Link>
        );
      })}
    </Grid>
  );
};

export const ScholarshipTabs = () => {
  const TABS = {
    Available: <TabContent tab="available" />,
    Applied: <TabContent tab="applied" />,
    Accepted: <TabContent tab="accepted" />,
    Rejected: <TabContent tab="rejected" />,
  };

  return (
    <Box
      maxW="1440px"
      mt={{ base: 6, md: '8' }}
      mx="auto"
      px={HORIZONTAL_PADDING}
    >
      <Tabs colorScheme="purple" variant="soft-rounded">
        <TabList>
          {Object.keys(TABS).map((tab) => (
            <Tab
              key={tab}
              _selected={{ color: 'white', bg: 'purple.600' }}
              maxHeight="auto"
              px={{ base: '2', md: '4' }}
              py={{ base: '1', md: '2' }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {Object.values(TABS).map((comp, index) => {
            return (
              <TabPanel
                key={`tab-panel-${index}`}
                px="0"
                py={{ base: 6, md: '8' }}
              >
                {comp}
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
