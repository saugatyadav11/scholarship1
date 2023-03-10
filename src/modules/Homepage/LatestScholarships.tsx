import { Box, Grid, Heading, Link } from '@chakra-ui/react';
import _ from 'lodash';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { Card } from '@/common/components/Card';
import { UNIVERSITIES } from '@/common/universities';

export const LatestScholarships = ({ ...props }) => {
  const latestScholarships = _.takeRight(UNIVERSITIES, 3);

  return (
    <Box {...props} maxW="1440px" mx="auto" px={HORIZONTAL_PADDING}>
      <Heading
        fontSize={{ base: '24px', md: '30px' }}
        mb={{ base: 4, md: '6' }}
      >
        Latest Scholarships
      </Heading>
      <Grid
        gap="6"
        templateColumns={{
          base: 'repeat(auto-fill, minmax(18.75rem, 1fr))',
          lg: 'repeat(auto-fill, 27.3331rem)',
        }}
        w="full"
      >
        {latestScholarships.map(({ id, image, heading, description }) => {
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
    </Box>
  );
};
