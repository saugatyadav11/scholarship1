import { Heading, Flex, Box, Text } from '@chakra-ui/react';

import { BuildingHouseIcon, UsersIcon } from '@/common/components/Icons';

import { RoleCard } from './RoleCard';

export const RoleChoosingSection = ({
  selectedSignInOption,
  setSelectedSignInOption,
  ...props
}) => {
  return (
    <>
      <Flex
        alignItems="center"
        flexWrap="wrap"
        gap={{ base: 3, md: 5 }}
        justifyContent="center"
        {...props}
      >
        <RoleCard
          as="button"
          description="Use your university assigned credentials to view and rank scholarships."
          icon={<BuildingHouseIcon h="6" w={{ base: 5, md: '6' }} />}
          isSelected={selectedSignInOption === 'university-staff'}
          maxW="390px"
          title="University staff"
          onClick={() => setSelectedSignInOption('university-staff')}
        />
        <RoleCard
          as="button"
          description="Browse and apply to scholarships available in our application."
          icon={<UsersIcon h="6" w={{ base: 5, md: '6' }} />}
          isSelected={selectedSignInOption === 'student'}
          maxW="390px"
          title="Student"
          onClick={() => setSelectedSignInOption('student')}
        />
      </Flex>
    </>
  );
};
