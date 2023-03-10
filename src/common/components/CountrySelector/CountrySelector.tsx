import { Select } from '@chakra-ui/react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

export const CountrySelector = ({ ...props }) => {
  // Have to register the languages you want to use
  countries.registerLocale(enLocale);
  const countryObj = countries.getNames('en', { select: 'official' });

  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key,
    };
  });

  return (
    <Select placeholder="Select option" {...props}>
      {countryArr.map((country) => {
        return (
          <option key={country.value} value={country.label}>
            {country.label}
          </option>
        );
      })}
    </Select>
  );
};
