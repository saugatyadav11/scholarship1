import {
  Grid,
  Heading,
  Flex,
  Text,
  Box,
  Button,
  Spinner,
} from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { UNIVERSITIES } from '@/common/universities';
import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { CalendarIcon } from '@/common/components/Icons';

import { AboutScholarship } from '@/modules/UniversityDetails/AboutScholarship';
import { ScholarshipInfo } from '@/modules/UniversityDetails/ScholarshipInfo';

const UniversityDetailPage = ({ university }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (!university) {
    return (
      <Grid placeItems="center">
        <Heading mt="40">University not found</Heading>
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
  }

  const isApplied = session?.user?.scholarships?.applied?.includes(
    university.id,
  );
  const isAccepted = session?.user?.scholarships?.accepted?.includes(
    university.id,
  );
  const isRejected = session?.user?.scholarships?.rejected?.includes(
    university.id,
  );

  const handleSubmit = async () => {
    if (isApplied || isAccepted || isRejected) {
      return;
    }
    router.push(`${router.asPath}/apply`);
  };

  return (
    <Box
      bg="gray.50"
      minH={{ base: 'calc(100vh - 4rem)', md: 'calc(100vh - 5rem)' }}
      px={HORIZONTAL_PADDING}
      py={{ base: 6, md: 10 }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={3}
        justifyContent="space-between"
        maxW="1440px"
        mx="auto"
      >
        <Box h={{ base: '200px', md: '480px' }} position="relative" w="full">
          <Image
            fill
            alt={university.heading}
            src={university.image}
            style={{
              overflow: 'hidden',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '8px',
            }}
          />
        </Box>
      </Flex>
      <Flex
        alignItems="center"
        borderBottom="1px solid"
        borderColor="gray.200"
        direction={{ base: 'column', md: 'row' }}
        gap="6"
        justifyContent="space-between"
        maxW="1440px"
        mx="auto"
        py={{ base: 6, md: '8' }}
      >
        <Box>
          <Heading color="gray.900" fontSize={{ base: '20px', md: '30px' }}>
            {university.heading}
          </Heading>
          <Text
            alignItems="center"
            color="gray.500"
            display="flex"
            fontSize={{ base: 'sm', md: 'md' }}
            gap="2"
            mt="2"
          >
            <Flex alignItems="center" as="span" gap="2">
              <CalendarIcon w={{ base: 5, md: 6 }} />
              Due date
            </Flex>
            {university.dueDate}
          </Text>
        </Box>
        {status === 'loading' && <Spinner color="purple.400" />}
        {session && session.user.role === 'student' && (
          <Button
            colorScheme={
              isAccepted
                ? 'green'
                : isRejected
                ? 'red'
                : isApplied
                ? 'purple'
                : 'purple'
            }
            pointerEvents={
              isAccepted || isRejected || isApplied ? 'none' : 'auto'
            }
            size={{ base: 'sm', md: 'md' }}
            variant="solid"
            width={{ base: 'full', md: 'auto' }}
            onClick={handleSubmit}
          >
            {isAccepted
              ? 'Accepted'
              : isRejected
              ? 'Rejected'
              : isApplied
              ? 'Applied'
              : 'Apply for scholarship'}
          </Button>
        )}
      </Flex>
      <Box maxW="1440px" mx="auto">
        <Box maxW="800px" mr="auto">
          <ScholarshipInfo
            grantAmount={university.grantAmount}
            provider={university.provider}
            specialCriteria={university.specialCriteria}
            winners={university.winners}
          />
          <AboutScholarship aboutScholarship={university.aboutScholarship} />
        </Box>
      </Box>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const queryId = context.query.id as string;
  const university = UNIVERSITIES.find(({ id }) => id === queryId);
  return {
    props: {
      university,
    },
  };
}

export default UniversityDetailPage;
