import { GroupBase, StylesConfig } from 'react-select';

export const selectStyle = (
  controlRadius: string,
):
  | StylesConfig<
      {
        label: string;
        value: string;
      },
      false,
      GroupBase<{
        label: string;
        value: string;
      }>
    >
  | undefined => {
  return {
    control: (styles) => ({
      ...styles,
      border: 'none',
      borderRadius: controlRadius,
      background: '#121212',
      color: '#fff',
      ':focus-within': {
        border: 'none',
        boxShadow: '0 0 0 1px #b230ca',
      },
      ':active': {
        border: 'none',
      },
    }),
    menu: (styles) => ({
      ...styles,
      background: '#121212',
      border: 'none',
    }),
    option: (styles) => ({
      ...styles,
      background: '#121212',
      color: '#fff',
      ':hover': {
        background: '#b230ca',
        color: '#fff',
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: '#fff',
    }),
  };
};
