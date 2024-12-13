import { GroupBase, StylesConfig } from 'react-select';

export const selectStyle = (
  error?: boolean,
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
      border: error ? '1px solid #ef4444' : '1px solid #1f2937',
      borderRadius: '6px',
      background: '#121212',
      color: '#fff',
      height: '40px',
      ':focus-within': {
        border: 'none',
        boxShadow: '0 0 0 1px #b230ca',
      },
      ':active': {
        border: 'none',
      },
      ':hover': {
        borderColor: '#374151 ',
      },
    }),
    menu: (styles) => ({
      ...styles,
      background: '#121212',
      border: '1px solid #1f2937',
      borderRadius: '6px',
      boxShadow: '0 10px 10px 4px #000',
    }),

    option: (styles) => ({
      ...styles,
      background: '#121212',
      color: '#fff',
      ':hover': {
        background: '#b230ca',
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: '#fff',
    }),
  };
};
