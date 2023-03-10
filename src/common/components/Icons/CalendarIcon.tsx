import { Icon, IconProps } from '@chakra-ui/react';

export const CalendarIcon = ({ ...props }: IconProps) => {
  return (
    <Icon
      fill="none"
      h="25px"
      viewBox="0 0 24 25"
      w="6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M5 5.5C4.44772 5.5 4 5.94772 4 6.5V20.5C4 21.0523 4.44772 21.5 5 21.5H19C19.5523 21.5 20 21.0523 20 20.5V6.5C20 5.94772 19.5523 5.5 19 5.5H5ZM2 6.5C2 4.84315 3.34315 3.5 5 3.5H19C20.6569 3.5 22 4.84315 22 6.5V20.5C22 22.1569 20.6569 23.5 19 23.5H5C3.34315 23.5 2 22.1569 2 20.5V6.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M16 1.5C16.5523 1.5 17 1.94772 17 2.5V6.5C17 7.05228 16.5523 7.5 16 7.5C15.4477 7.5 15 7.05228 15 6.5V2.5C15 1.94772 15.4477 1.5 16 1.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M8 1.5C8.55228 1.5 9 1.94772 9 2.5V6.5C9 7.05228 8.55228 7.5 8 7.5C7.44772 7.5 7 7.05228 7 6.5V2.5C7 1.94772 7.44772 1.5 8 1.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M2 10.5C2 9.94772 2.44772 9.5 3 9.5H21C21.5523 9.5 22 9.94772 22 10.5C22 11.0523 21.5523 11.5 21 11.5H3C2.44772 11.5 2 11.0523 2 10.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Icon>
  );
};
