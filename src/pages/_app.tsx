import { ChakraProvider } from '@chakra-ui/react';
import { NextComponentType } from 'next';
import type { AppProps as NextAppProps } from 'next/app';
import { Inter } from '@next/font/google';
import { NextFont } from '@next/font/dist/types';
import { SessionProvider } from 'next-auth/react';
import NProgress from 'nprogress';
import Router from 'next/router';
import NextProgress from 'next-progress';

import { CoreLayout } from '@/common/components/CoreLayout';
import { PageHead } from '@/common/components/PageHead';

NProgress.configure({ showSpinner: true });

const inter: NextFont = Inter({
  variable: '--inter-font',
});

type ComponentProps = {
  layout?: () => JSX.Element;
} & NextComponentType;

type AppProps<C> = {
  Component: C;
} & NextAppProps;

export const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<ComponentProps>) => {
  // Use default Layout.tsx component, or specify your own layout in the page
  // by doing PageA.layout = CustomLayoutComponent;
  const Layout = Component.layout ?? CoreLayout;

  return (
    <SessionProvider session={session}>
      <style global jsx>{`
        :root {
          --inter-font: ${inter.style.fontFamily};
        }
      `}</style>
      <ChakraProvider>
        <PageHead />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <NextProgress
          color="#805AD5"
          delay={300}
          options={{ showSpinner: false }}
        />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
