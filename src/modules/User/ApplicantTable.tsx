import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import { DragHandleIcon } from '@chakra-ui/icons';

import { HORIZONTAL_PADDING } from '@/common/components/CoreLayout/Nav';
import { UNIVERSITIES } from '@/common/universities';
import { useFetch } from '@/common/useFetch';

import { ViewApplicationDrawer } from './ViewApplicationDrawer';
// TEST
// import { dummyData } from './dummyData';

export const ApplicantTable = () => {
  const { data, isLoading, refetch } = useFetch('/api/user/scholarships-list');

  const { data: tableData } = data || {};

  const [activeId, setActiveId] = useState(undefined);
  // TEST
  // const tableData = dummyData.data;

  const [sortedData, setSortedData] = useState<any[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  useEffect(() => {
    setSortedData(tableData);
  }, [tableData]);

  // TEST
  // const isLoading = false;
  // const refetch = () => {};

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as any;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const activeForm = tableData?.find((data) => data._id === activeId);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(sortedData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const rankedItem = items.map((item, index) => {
      return {
        ...item,
        data: {
          ...item.data,
          rank: index + 1,
        },
      };
    });

    setSortedData(rankedItem);
  }

  const reset = () => {
    setSortedData(tableData);
  };

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

  const handleUpdate = async () => {
    try {
      setIsSorting(true);
      await sendData('/api/user/update-rank', 'POST', sortedData);
      setIsSorting(false);
      toast({
        title: 'Rank updated.',
        description: `You've successfully updated the rank for scholarships.`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
      refetch();
      onClose();
    } catch (error) {
      setIsSorting(false);
    }
  };

  return (
    <Box
      maxW="1440px"
      mt={{ base: 6, md: 8 }}
      mx="auto"
      px={HORIZONTAL_PADDING}
    >
      {!isLoading && !isEqual(tableData, sortedData) && (
        <Flex gap="4" mb={{ base: 6, md: 8 }}>
          <Button
            colorScheme="purple"
            isLoading={isSorting}
            onClick={handleUpdate}
          >
            Confirm Rank Order
          </Button>
          <Button disabled={isSorting} onClick={reset}>
            Cancel
          </Button>
        </Flex>
      )}
      {isLoading ? (
        <Center py="20">
          <Spinner color="purple.400" />
        </Center>
      ) : tableData?.length > 0 ? (
        <TableContainer maxHeight="70vh" overflowY="auto">
          <Table
            colorScheme="gray"
            size={{ base: 'sm', md: 'md' }}
            sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
            variant="striped"
          >
            <Thead>
              <Tr bg="gray.50" position="sticky" top="0" zIndex={20}>
                <Th>Drag</Th>
                <Th>Applicant Name</Th>
                <Th>Rank</Th>
                <Th>Provider</Th>
                <Th>Email</Th>
                <Th>Applied Date</Th>
                <Th>Status</Th>
                <Th
                  isNumeric
                  bg="white"
                  borderLeftWidth="1px"
                  // eslint-disable-next-line react/jsx-sort-props
                  borderColor="gray.200"
                  position="sticky"
                  pr="8"
                  right="0"
                >
                  Action
                </Th>
              </Tr>
            </Thead>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="students">
                {(provided) => (
                  <Tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {sortedData?.map((data, index) => {
                      return (
                        <Draggable
                          key={data._id}
                          draggableId={data._id}
                          index={index}
                          isDragDisabled={isSorting}
                        >
                          {(provided) => (
                            <Tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Td {...provided.dragHandleProps}>
                                <DragHandleIcon />
                              </Td>
                              <Td>{`${data.data.firstName} ${data.data.lastName}`}</Td>
                              <Td fontWeight="extrabold">
                                {data.data.rank || '-'}
                              </Td>
                              <Td>
                                {
                                  UNIVERSITIES.find(
                                    (uni) => uni.id === data.data.universityId,
                                  ).heading
                                }
                              </Td>
                              <Td>{data.data.email}</Td>
                              <Td>{formatDate(data.data.appliedDate)}</Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    data.state === 'applied'
                                      ? 'purple'
                                      : data.state === 'accepted'
                                      ? 'green'
                                      : data.state === 'rejected' && 'red'
                                  }
                                >
                                  {data.state === 'applied'
                                    ? 'pending'
                                    : data.state}
                                </Badge>
                              </Td>
                              <Td
                                isNumeric
                                bg="gray.100"
                                borderBottomColor="gray.200 !important"
                                borderLeftColor="gray.200 !important"
                                // eslint-disable-next-line react/jsx-sort-props
                                position="sticky"
                                right="0"
                                // eslint-disable-next-line react/jsx-sort-props
                                borderLeftWidth="1px"
                              >
                                <Button
                                  ref={btnRef}
                                  colorScheme="purple"
                                  size={{ base: 'xs', md: 'md' }}
                                  onClick={() => {
                                    setActiveId(data._id);
                                    onOpen();
                                  }}
                                >
                                  View
                                </Button>
                              </Td>
                            </Tr>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Tbody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </TableContainer>
      ) : (
        <>No applications at this moment</>
      )}
      <ViewApplicationDrawer
        activeForm={activeForm}
        btnRef={btnRef}
        isOpen={isOpen}
        refetch={refetch}
        onClose={onClose}
      />
    </Box>
  );
};
