import 'photoswipe/dist/photoswipe.css';
import emailjs from '@emailjs/browser';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Box,
  Text,
  Flex,
  Button,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { useSession } from 'next-auth/react';

import { UNIVERSITIES } from '@/common/universities';

export const ViewApplicationDrawer = ({
  isOpen,
  onClose,
  btnRef,
  activeForm,
  refetch,
}) => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState({ state: false, is: undefined });
  const university = UNIVERSITIES.find(
    (uni) => uni.id === activeForm?.data.universityId,
  );
  const toast = useToast();

  const sendData = async (apiUrl, method, formData) => {
    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data || 'Something went wrong';
    }

    return data;
  };

  const handleUpdate = async (state) => {
    try {
      setIsLoading({ state: true, is: state });
      await sendData('/api/user/update-scholarship', 'POST', {
        _id: activeForm._id,
        state: state,
      });
      setIsLoading({ state: false, is: undefined });
      toast({
        title: 'Scholarship updated.',
        description: `You've successfully ${state} for scholarship.`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
      refetch();

      try {
        await emailjs.send(
          'service_07jkxsp',
          'template_zx1gx1f',
          {
            from_name: university.heading,
            to_name: activeForm.data.firstName,
            status: `${state}`,
            to_email: activeForm.data.email,
            reply_to: session.user.email,
          },
          'FK_mdpyrox9PyvzPQ',
        );

        toast({
          title: 'Email sent.',
          description: `You've successfully ${state} for scholarship.`,
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Email not sent.',
          description: `Something went wrong.`,
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      setIsLoading({ state: false, is: undefined });
    }
  };
  return (
    <Drawer
      closeOnEsc={isLoading.state ? false : true}
      closeOnOverlayClick={isLoading.state ? false : true}
      finalFocusRef={btnRef}
      isOpen={isOpen}
      placement="right"
      size={{ base: 'full', md: 'sm' }}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton isDisabled={isLoading.state ? true : false} />
        {university && (
          <DrawerHeader>
            View application
            <Flex
              bg="#F9F9FB"
              gap="5"
              mb={{ base: '1', md: '2' }}
              mt={{ base: '4', md: '6' }}
              p={{ base: '4', md: 5 }}
              rounded="12px"
            >
              <Box h="72px" position="relative" w="72px">
                <Image
                  fill
                  alt={university.heading}
                  src={university.image}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              <Box color="#09090B" flex="1">
                <Text
                  fontSize={{ base: '16px', md: '18px' }}
                  fontWeight="600"
                  noOfLines={[1]}
                >
                  {university.heading}
                </Text>
                <Text
                  color="#5C5A72"
                  fontSize={{ base: '13px', md: 'sm' }}
                  noOfLines={[2]}
                >
                  {university.aboutScholarship}
                </Text>
              </Box>
            </Flex>
            <Flex gap="4">
              <Button
                color="white"
                colorScheme="green"
                disabled={activeForm.state === 'accepted' || isLoading.state}
                isLoading={isLoading.state && isLoading.is === 'accepted'}
                size={{ base: 'sm', md: 'md' }}
                w="full"
                onClick={() => handleUpdate('accepted')}
              >
                Accept
              </Button>
              <Button
                color="white"
                colorScheme="red"
                disabled={activeForm.state === 'rejected' || isLoading.state}
                isLoading={isLoading.state && isLoading.is === 'rejected'}
                size={{ base: 'sm', md: 'md' }}
                w="full"
                onClick={() => handleUpdate('rejected')}
              >
                Reject
              </Button>
            </Flex>
          </DrawerHeader>
        )}

        {activeForm && (
          <DrawerBody pb="20" pt={{ base: 6, md: '8' }}>
            <Stack spacing={{ base: '6', md: '8' }}>
              <Box>
                <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
                  Personal details
                </Heading>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="500">First Name</Text>
                    <Text fontSize="sm">{activeForm.data.firstName}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Last Name</Text>
                    <Text fontSize="sm">{activeForm.data.lastName}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Date of birth</Text>
                    <Text fontSize="sm">{activeForm.data.dob}</Text>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
                  Contact Information
                </Heading>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="500">Street Address</Text>
                    <Text fontSize="sm">{activeForm.data.streetAddress}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Address Line</Text>
                    <Text fontSize="sm">{activeForm.data.addressLine}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Country</Text>
                    <Text fontSize="sm">{activeForm.data.country}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">City</Text>
                    <Text fontSize="sm">{activeForm.data.city}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">State</Text>
                    <Text fontSize="sm">{activeForm.data.state}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Postal Code</Text>
                    <Text fontSize="sm">{activeForm.data.postalCode}</Text>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
                  Academic Qualifications
                </Heading>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="500">Highest Qualification</Text>
                    <Text fontSize="sm">
                      {activeForm.data.highestQualification}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="500">Date Passed</Text>
                    <Text fontSize="sm">{activeForm.data.datePassed}</Text>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
                  Supporting documents
                </Heading>

                <Gallery>
                  <Flex flexWrap="wrap" gap="4">
                    {activeForm.data.documentImageData.map((imageData) => {
                      return (
                        <Item
                          key={imageData.asset_id}
                          height={imageData.height}
                          original={imageData.secure_url}
                          width={imageData.width}
                        >
                          {({ ref, open }) => (
                            <img
                              ref={ref as any}
                              alt="Document"
                              height="80px"
                              src={imageData.secure_url}
                              style={{
                                objectFit: 'cover',
                                border: '1px solid gray',
                                padding: '3px',
                              }}
                              width="80px"
                              onClick={open}
                            />
                          )}
                        </Item>
                      );
                    })}
                  </Flex>
                </Gallery>
              </Box>
            </Stack>
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
};
