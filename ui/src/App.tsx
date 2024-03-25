import '@fortawesome/fontawesome-free/css/all.css';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import ProximaNova from 'url:./fonts/proximanova-regular.woff';
import RobotoMono from 'url:./fonts/roboto-mono-regular.woff';
import bgDark from './assets/img/bg-dark.png';
import bg from './assets/img/bg.svg';
import App from './components/Layout/App';
import MemoizedHelpLinkWrapper from './components/Layout/HelpLinkWrapper';
import Compose from './components/ProvidersCompose';
import { EnterpriseClientProvider } from './contexts/API';
import NotificationsProvider from './contexts/Notifications/Provider';
import RequestContextProvider from './contexts/Request';
/*import {
  AppContext,
  AppContextProvider,
  AuthCheck,
  AuthContextProvider,
  coreClient,
  CoreClientContextProvider,
  getBasePath,
  LinkResolverProvider,
  SignIn,
  theme,
  ThemeTypes,
  withBasePath,
} from './gitops.d';*/
import { muiTheme } from './muiTheme';
import { resolver } from './utils/link-resolver';
import { addTFSupport } from './utils/request';
import AppContextProvider, { AppContext, ThemeTypes } from './weave/contexts/AppContext';
import { getBasePath, withBasePath } from './weave/lib/utils';
import theme from './weave/lib/theme';
import { Core as coreClient } from './weave/lib/api/core/core.pb';
import AuthContextProvider, { AuthCheck } from './weave/contexts/AuthContext';
import CoreClientContextProvider from './weave/contexts/CoreClientContext';
import { LinkResolverProvider } from './weave/contexts/LinkResolverContext';
import SignIn from './weave/pages/SignIn';

const GlobalStyle = createGlobalStyle`
  /* https://github.com/weaveworks/wkp-ui/pull/283#discussion_r339958886 */
  /* https://github.com/necolas/normalize.css/issues/694 */

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
  }

  @font-face {
    font-family: 'proxima-nova';
    src: url(${ProximaNova})
  }

  @font-face {
    font-family: 'Roboto Mono';
    src: url(${RobotoMono})
  }

  html, body, #root {
    height: 100%;
    margin: 0;
  }

  body {
    background: right bottom no-repeat fixed;
    background-image: ${props =>
      props.theme.mode === ThemeTypes.Dark
        ? `url(${bgDark});`
        : `url(${bg}), linear-gradient(to bottom, rgba(85, 105, 145, .1) 5%, rgba(85, 105, 145, .1), rgba(85, 105, 145, .25) 35%);`}
    background-size: 100%;
    background-color: ${props =>
      props.theme.mode === ThemeTypes.Dark
        ? props.theme.colors.neutralGray
        : 'transparent'};
    color: ${props => props.theme.colors.black};
    font-family: ${props => props.theme.fontFamilies.regular};
    font-size: ${props => props.theme.fontSizes.medium};
    //we can not override Autocomplete in Mui createTheme without updating our Mui version.
    .MuiAutocomplete-inputRoot {
      &.MuiInputBase-root {
        padding: 0;
      }
    }
    .MuiAutocomplete-groupLabel {
      background: ${props => props.theme.colors.neutralGray};
    }

    a {
      text-decoration: none;
      color:  ${props => props.theme.colors.primary10};
    }
    .MuiFormControl-root {
      min-width: 0px;
    }
    .MuiPaper-root{
      background-color: ${props =>
        props.theme.mode === ThemeTypes.Dark
          ? props.theme.colors.neutralGray
          : props.theme.colors.white};
    }
    .MuiListItem-button:hover{
      background-color: ${props =>
        props.theme.mode === ThemeTypes.Dark
          ? props.theme.colors.blueWithOpacity
          : props.theme.colors.neutral10}};
  }

  #root {
    /* Layout - grow to at least viewport height */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

interface Error {
  code: number;
  message: string;
}

export const queryOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    // FIXME: Do we need this? Should be captured by the global interceptors
    onError: error => {
      const err = error as Error;
      const { pathname, search } = window.location;
      const redirectUrl = encodeURIComponent(`${pathname}${search}`);
      const url = redirectUrl
        ? `/sign_in?redirect=${redirectUrl}`
        : `/sign_in?redirect=/`;
      if (err.code === 401 && !window.location.href.includes('/sign_in')) {
        window.location.href = withBasePath(url);
      }
    },
  }),
};
const queryClient = new QueryClient(queryOptions);

const StylesProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = React.useContext(AppContext);
  const mode = settings.theme;
  const appliedTheme = theme(mode);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appliedTheme}>
        <MuiThemeProvider theme={muiTheme(appliedTheme.colors, mode)}>
          <GlobalStyle />
          {children}
        </MuiThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

//adds Terraform Sync and Suspend support to the OSS Sync and Suspend funcs. This is necessary in order to not have to make drastic modifications to DataTable, as CheckboxActions is deeply embedded. When DataTable gets broken up, we can pass down Sync and Suspend functions to it.
addTFSupport(coreClient);

const AppContainer = () => {
  return (
    <RequestContextProvider fetch={window.fetch}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={getBasePath()}>
          <AppContextProvider footer={<MemoizedHelpLinkWrapper />}>
            <StylesProvider>
              <AuthContextProvider>
                <EnterpriseClientProvider>
                  <CoreClientContextProvider api={coreClient}>
                    <LinkResolverProvider resolver={resolver}>
                      <Compose components={[NotificationsProvider]}>
                        <Routes>
                          <Route
                            Component={() => <SignIn />}
                            path="/sign_in"
                          />
                          {/* Check we've got a logged in user otherwise redirect back to signin */}
                          <Route path="*" element={
                            <AuthCheck>
                              <App />
                            </AuthCheck>
                            }/>
                        </Routes>
                        <ToastContainer
                          position="top-center"
                          autoClose={5000}
                          newestOnTop={false}
                        />
                      </Compose>
                    </LinkResolverProvider>
                  </CoreClientContextProvider>
                </EnterpriseClientProvider>
              </AuthContextProvider>
            </StylesProvider>
          </AppContextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </RequestContextProvider>
  );
};

export default AppContainer;
