import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import { ScholarshipsLogo } from '../Icons/ScholarshipsLogo';

export const HORIZONTAL_PADDING = {
  base: 4,
  md: '10',
};

export const Nav = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderBottomColor="gray.100"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex
        alignItems="center"
        h={{ base: '4rem', md: '5rem' }}
        justifyContent="space-between"
        maxW="1440px"
        mx="auto"
        px={HORIZONTAL_PADDING}
      >
        <Link href="/">
          <ScholarshipsLogo
            height="32px"
            width={{ base: '108px', md: '152px' }}
          />
        </Link>
        <Stack alignItems="center" direction="row" spacing={{ base: 2, md: 4 }}>
          {status === 'loading' ? (
            <Spinner color="purple.400" />
          ) : session ? (
            <Flex alignItems="center" gap={{ base: 2, md: '5' }}>
              {session.user?.role && <Badge>{session.user.role}</Badge>}
              <Link href="/home">
                <Avatar
                  name={session.user?.name}
                  size="sm"
                  src={session.user?.image}
                >
                  <AvatarBadge bg="green.500" boxSize="0.8em" />
                </Avatar>
              </Link>
              <Button
                colorScheme="purple"
                size={{ base: 'xs', md: 'md' }}
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign out
              </Button>
            </Flex>
          ) : (
            <>
              <Button
                colorScheme="purple"
                size={{ base: 'sm', md: 'md' }}
                variant="solid"
                onClick={() => router.push('/auth')}
              >
                Create account
              </Button>
              <Button
                colorScheme="purple"
                size={{ base: 'sm', md: 'md' }}
                variant="outline"
                onClick={() => router.push('/auth')}
              >
                Sign in
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
