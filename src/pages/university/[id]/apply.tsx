import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Grid,
  Heading,
  Input,
  Link,
  Text,
  Stack,
  Select,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import { unstable_getServerSession } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { UNIVERSITIES } from '@/common/universities';
import { CountrySelector } from '@/common/components/CountrySelector';
import { reloadSession } from '@/common/reloadSession';
import { ImageUpload } from '@/common/components/ImageUpload';
import { connectToDatabase } from '@/common/lib/db';

import { authOptions } from '@/pages/api/auth/[...nextauth]';

const validationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string({
    required_error: 'Please select a date.',
    invalid_type_error: "That's not a date!",
  }),
  streetAddress: z.string().min(1, 'Last name is required'),
  addressLine: z.string().min(1, 'Last name is required'),
  country: z
    .string({
      required_error: 'Country is required.',
    })
    .min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  highestQualification: z
    .string({
      required_error: 'Qualification is required.',
    })
    .min(1, 'Qualification is required'),
  datePassed: z.string({
    required_error: 'Please select a date.',
    invalid_type_error: "That's not a date!",
  }),
  documents: z
    .any()
    .refine((files) => files?.length >= 1, 'Document image is required.'),
});

type FormFieldType = z.infer<typeof validationSchema>;

const Apply = ({
  university,
  alreadyApplied,
  error,
  userScholarshipDetails,
}) => {
  const toast = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormFieldType>({
    mode: 'all',
    defaultValues: {
      documents: [],
    },
    resolver: zodResolver(validationSchema),
  });

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

  if (alreadyApplied) {
    return (
      <Grid placeItems="center">
        <Heading mt="40">You already applied for this university</Heading>
        <Link href="/home">
          <Text
            _hover={{ textDecoration: 'underline' }}
            color="purple.600"
            fontWeight="medium"
            mt="2"
          >
            Go to home to view the result
          </Text>
        </Link>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid placeItems="center">
        <Heading mt="40">Something went wrong</Heading>
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

  const onSubmit: SubmitHandler<FormFieldType> = async ({
    documents,
    ...values
  }) => {
    setIsSubmitting(true);

    let promises = [];
    for (let file of documents) {
      let filePromise = new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
      promises.push(filePromise);
    }
    Promise.all(promises).then(async (fileContents) => {
      try {
        await sendData('/api/user/apply-scholarship', 'POST', {
          universityId: university.id,
          ...values,
          documents: fileContents,
        });
        setIsSubmitting(false);
        toast({
          title: 'Scholarship applied.',
          description: "You've successfully applied for scholarship.",
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
        setIsSubmittedSuccessfully(true);
        reloadSession();
        router.push('/home');
      } catch (error) {
        toast({
          title: 'Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Box
      as="form"
      maxW="600px"
      mx="auto"
      px={HORIZONTAL_PADDING}
      py={{ base: 8, md: '12' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading fontSize={'24px'}>Apply for scholarship</Heading>
      <Text
        color="#5C5A72"
        fontSize={{ base: 'xs', md: 'sm' }}
        mt={{ base: '0.5', md: '1' }}
      >
        Fill in the form to submit your application for scholarship
      </Text>
      <Flex
        bg="#F9F9FB"
        gap="5"
        mb={{ base: '6', md: '8' }}
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
      {userScholarshipDetails && (
        <Box bg="blue.50" mb="8" p="5" rounded="12px">
          <InfoOutlineIcon
            color="blue.600"
            height={{ base: '18px', md: '22px' }}
            width={{ base: '18px', md: '22px' }}
          />
          <Text
            color="blue.900"
            fontSize={{ base: '14px', md: '16px' }}
            mt={{ base: 2, md: '4' }}
          >
            Fill in details from your application for{' '}
            <Box
              as="span"
              color="blue.400"
              display="block"
              fontWeight="semibold"
            >
              {
                UNIVERSITIES.find(
                  (university) =>
                    university.id === userScholarshipDetails.universityId,
                ).heading
              }
              ?
            </Box>
            <Box
              as="span"
              color="blue.800"
              display="block"
              fontSize={{ base: '13px', md: 'sm' }}
              mt="1"
            >
              We’ll take the details and fill this form out for your
              convenience.
            </Box>
          </Text>
          <Flex gap={{ base: '2', md: '4' }} mt={{ base: '2', md: '4' }}>
            <Button
              colorScheme="blue"
              fontSize={{ base: '14px', md: '16px' }}
              onClick={() => {
                setValue('firstName', userScholarshipDetails.firstName);
                setValue('lastName', userScholarshipDetails.lastName);
                setValue('dob', userScholarshipDetails.dob);
                setValue('addressLine', userScholarshipDetails.addressLine);
                setValue('streetAddress', userScholarshipDetails.streetAddress);
                setValue('city', userScholarshipDetails.city);
                setValue('state', userScholarshipDetails.state);
                setValue('postalCode', userScholarshipDetails.postalCode);
                setValue('country', userScholarshipDetails.country);
                setValue(
                  'highestQualification',
                  userScholarshipDetails.highestQualification,
                );
                setValue('datePassed', userScholarshipDetails.datePassed);
                trigger();
              }}
            >
              Yes, Fill Details
            </Button>
            <Button
              colorScheme="blue"
              fontSize={{ base: '14px', md: '16px' }}
              variant="outline"
              onClick={() => reset()}
            >
              No
            </Button>
          </Flex>
        </Box>
      )}
      <Stack spacing={{ base: '6', md: '8' }}>
        <Box>
          <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
            Personal details
          </Heading>
          <Stack spacing={3}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" variant="filled" {...register('firstName')} />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" variant="filled" {...register('lastName')} />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.dob}>
              <FormLabel>Date</FormLabel>
              <Controller
                control={control}
                name="dob"
                render={({
                  field: { onChange, value, ...rest },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      type="date"
                      value={value as any}
                      variant="filled"
                      onChange={(e) => onChange(e.target.value)}
                      {...rest}
                    />
                    <FormErrorMessage>
                      {error && error.message}
                    </FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </Stack>
        </Box>
        <Box>
          <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
            Contact Information
          </Heading>
          <Stack spacing={3}>
            <FormControl isInvalid={!!errors.streetAddress}>
              <FormLabel>Street Address</FormLabel>
              <Input
                type="text"
                variant="filled"
                {...register('streetAddress')}
              />
              <FormErrorMessage>
                {errors.streetAddress && errors.streetAddress.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.addressLine}>
              <FormLabel>Address Line</FormLabel>
              <Input
                type="text"
                variant="filled"
                {...register('addressLine')}
              />
              <FormErrorMessage>
                {errors.addressLine && errors.addressLine.message}
              </FormErrorMessage>
            </FormControl>
            <Controller
              control={control}
              name="country"
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!errors.country}>
                  <FormLabel>Country</FormLabel>
                  <CountrySelector
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    {...rest}
                  />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <FormControl isInvalid={!!errors.city}>
              <FormLabel>City</FormLabel>
              <Input type="text" variant="filled" {...register('city')} />
              <FormErrorMessage>
                {errors.city && errors.city.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.state}>
              <FormLabel>State</FormLabel>
              <Input type="text" variant="filled" {...register('state')} />
              <FormErrorMessage>
                {errors.state && errors.state.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.postalCode}>
              <FormLabel>Postal code</FormLabel>
              <Input
                type="number"
                variant="filled"
                {...register('postalCode')}
              />
              <FormErrorMessage>
                {errors.postalCode && errors.postalCode.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>
        </Box>
        <Box>
          <Heading fontSize="20px" mb={{ base: '4', md: '6' }}>
            Academic Qualifications
          </Heading>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="highestQualification"
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!errors.highestQualification}>
                  <FormLabel>Highest Qualification</FormLabel>
                  <Select
                    placeholder="Select your highest qualification"
                    sx={{
                      placeholder: { color: 'red' },
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    {...rest}
                  >
                    {['Diploma', 'Bachelors', 'Masters'].map(
                      (qualification) => {
                        return (
                          <option key={qualification} value={qualification}>
                            {qualification}
                          </option>
                        );
                      },
                    )}
                  </Select>

                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <FormControl isInvalid={!!errors.datePassed}>
              <FormLabel>Date Passed</FormLabel>
              <Controller
                control={control}
                name="datePassed"
                render={({
                  field: { onChange, value, ...rest },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      type="date"
                      value={value as any}
                      variant="filled"
                      onChange={(e) => onChange(e.target.value)}
                      {...rest}
                    />
                    <FormErrorMessage>
                      {error && error.message}
                    </FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </Stack>
        </Box>
        <Box>
          <Heading fontSize="20px">Supporting documents</Heading>
          <Text
            color="#5C5A72"
            fontSize="sm"
            mb={{ base: '4', md: '6' }}
            mt="1"
          >
            Attach professional experience, recommendation or any supporting
            documents that can help with your application.
          </Text>
          <Stack mt={{ base: '4', md: '6' }} spacing={3}>
            <Controller
              control={control}
              name="documents"
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => {
                return (
                  <FormControl isInvalid={!!errors.documents}>
                    <ImageUpload
                      error={error && error.message}
                      files={value}
                      onChange={onChange}
                      {...rest}
                    />
                    <FormErrorMessage>
                      {error && error.message}
                    </FormErrorMessage>
                  </FormControl>
                );
              }}
            />
          </Stack>
        </Box>
      </Stack>
      <Button
        colorScheme="purple"
        isLoading={isSubmitting || isSubmittedSuccessfully}
        mt={8}
        type="submit"
      >
        Apply for scholarship
      </Button>
    </Box>
  );
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  if (session && !session.user.role) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }

  if (session && session.user.role !== 'student') {
    return {
      redirect: {
        destination: `/${context.query.id}`,
        permanent: false,
      },
    };
  }

  const queryId = context.query.id as string;

  const university = UNIVERSITIES.find(({ id }) => id === queryId);

  const isApplied = session?.user?.scholarships?.applied?.includes(
    university.id,
  );
  const isAccepted = session?.user?.scholarships?.accepted?.includes(
    university.id,
  );
  const isRejected = session?.user?.scholarships?.rejected?.includes(
    university.id,
  );

  if (isApplied || isAccepted || isRejected) {
    return {
      props: {
        alreadyApplied: true,
      },
    };
  }

  //* Connecting to database
  let client;

  try {
    client = await connectToDatabase();
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }

  const scholarshipsCollection = client.db().collection('scholarships');

  let userScholarshipDetails;

  try {
    userScholarshipDetails = await scholarshipsCollection.findOne({
      'data.email': session.user.email,
    });
    client.close();
  } catch (error) {
    client.close();

    return {
      props: {
        error: error.message,
      },
    };
  }

  const serializedData = userScholarshipDetails
    ? {
        ...userScholarshipDetails?.data,
        appliedDate: userScholarshipDetails?.data?.appliedDate?.toString(),
      }
    : null;

  return {
    props: {
      university,
      userScholarshipDetails: serializedData,
    },
  };
}

export default Apply;
