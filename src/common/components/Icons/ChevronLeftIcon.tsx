import { Icon, IconProps } from '@chakra-ui/react';

export const ChevronLeftIcon = (props: IconProps) => (
  <Icon fill="none" h="4" viewBox="0 0 16 16" w="4" {...props}>
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
