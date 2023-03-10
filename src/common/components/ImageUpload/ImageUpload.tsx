import { Box, Button, Center, CloseButton, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import { ImageIcon } from '@/common/components/Icons';

export const ImageUpload = ({ files, onChange, error, ...props }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const droppedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      onChange([...droppedFiles, ...files], {
        shouldValidate: true,
      });
    },
  });

  const handleDelete = (preview) => {
    const filtered = files.filter((file) => file.preview !== preview);
    onChange([...filtered], {
      shouldValidate: true,
    });
  };

  return (
    <Box as="section">
      <Center
        border={error ? '1px dashed #E53E3E' : '1px dashed #C3C2D6'}
        flexDirection="column"
        p="5"
        {...getRootProps()}
      >
        <ImageIcon color="#5C5A72" mb="4" />
        <input {...getInputProps()} {...props} />
        <Text color="#09090B" mb="0.5">
          Drag and drop or browse for file.
        </Text>
        <Text color="#5C5A72" fontSize="sm">
          .JPG or .PNG supported.
        </Text>
        <Button mt="4" size="sm" variant="outline">
          Browse file
        </Button>
      </Center>

      {!error && files && files.length > 0 && (
        <Box
          as="aside"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 16,
            gap: '20px',
          }}
        >
          {files.map((file, index) => (
            <Box
              key={`${file.name}-${index}`}
              sx={{
                display: 'inline-flex',
                borderRadius: 2,
                border: '1px solid #eaeaea',
                marginBottom: 8,
                width: 100,
                height: 100,
                padding: '2px',
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              <Image
                alt={file.name}
                height={72}
                src={file.preview}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                width={72}
              />

              <CloseButton
                _hover={{ bg: 'red.400', borderColor: 'red.600' }}
                bg="gray.100"
                border="1px solid"
                borderColor="gray.300"
                h="6"
                position="absolute"
                right="-3"
                rounded="full"
                sx={{
                  '& svg': {
                    h: '8px',
                  },
                }}
                top="-2"
                w="6"
                onClick={() => handleDelete(file.preview)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
