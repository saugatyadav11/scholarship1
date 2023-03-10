import { useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export const useFetch = (initialUrl, initialParams = {}, skip = false) => {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] = useState(initialParams);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);

  const queryString = Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
    )
    .join('&');

  const toast = useToast();

  const refetch = () =>
    setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

  useEffect(() => {
    const fetchData = async () => {
      if (skip) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${url}${queryString}`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setHasError(true);
          setErrorMessage(result);
        }
      } catch (err) {
        setHasError(true);
        setErrorMessage(err.message);
        toast({
          title: 'Failed',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, params, refetchIndex]);

  return {
    data,
    isLoading,
    hasError,
    errorMessage,
    updateUrl,
    updateParams,
    refetch,
  };
};
