import { MenuItem } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  GitRepository,
  Link,
  LoadingPage,
  theme,
  useListSources,
} from '@weaveworks/weave-gitops';
import { PageRoute } from '@weaveworks/weave-gitops/ui/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  ClusterAutomation,
  PolicyConfigApplicationMatch,
} from '../../../cluster-services/cluster_services.pb';
import CallbackStateContextProvider from '../../../contexts/GitAuth/CallbackStateContext';
import useNotifications from '../../../contexts/Notifications';
import { useGetClustersList } from '../../../contexts/PolicyConfigs';
import { localEEMuiTheme } from '../../../muiTheme';
import { useCallbackState } from '../../../utils/callback-state';
import { Input, Select, validateFormData } from '../../../utils/form';
import { Routes } from '../../../utils/nav';
import { isUnauthenticated, removeToken } from '../../../utils/request';
import { CreateDeploymentObjects } from '../../Applications/utils';
import { getGitRepos } from '../../Clusters';
import { clearCallbackState, getProviderToken } from '../../GitAuth/utils';
import { ContentWrapper } from '../../Layout/ContentWrapper';
import { PageTemplate } from '../../Layout/PageTemplate';
import { GitRepositoryEnriched } from '../../Templates/Form';
import GitOps from '../../Templates/Form/Partials/GitOps';
import {
  getInitialGitRepo,
  getRepositoryUrl,
} from '../../Templates/Form/utils';
import { SelectedPolicies } from './Form/Partials/SelectedPolicies';
import { SelectMatchType } from './Form/Partials/SelectTargetList';
import { PreviewPRModal } from './PreviewPRModal';

const { large, xs, base, medium, small } = theme.spacing;
const { neutral20, neutral10 } = theme.colors;
const { large: largeFontSize } = theme.fontSizes;

const FormWrapper = styled.form`
  width: 80%;
  padding-bottom: ${large} !important;

  .group-section {
    border-bottom: 1px dotted ${neutral20};
    padding-right: ${medium};
    padding-bottom: ${medium};
    .form-field {
      width: 50%;
      label {
        margin-top: ${xs} !important;
        margin-bottom: ${base} !important;
        font-size: ${largeFontSize};
      }
      &.policyField {
        label {
          margin-bottom: ${small} !important;
        }
        div[class*='MuiAutocomplete-tag'] {
          display: none;
        }
      }
      .form-section {
        label {
          display: none !important;
        }
      }
    }

    .form-section {
      display: flex;
      width: 50%;

      div[class*='MuiInputBase-root'] {
        margin-right: ${small};
      }
      .Mui-disabled {
        background: ${neutral10} !important;
        border-color: ${neutral20} !important;
      }
    }
  }
`;

interface FormData {
  repo: GitRepository | null;
  branchName: string;
  provider: string;
  pullRequestTitle: string;
  commitMessage: string;
  pullRequestDescription: string;
  policyConfigName: string;
  matchType: string;
  match: any;
  appMatch: any;
  wsMatch: any;
  policies: any;
  isControlPlane: boolean;
  clusterName: string;
  clusterNamespace: string;
  selectedCluster: any;
}

function getInitialData(
  callbackState: { state: { formData: FormData } } | null,
  random: string,
) {
  let defaultFormData = {
    repo: null,
    provider: '',
    branchName: `add-policyConfig-branch-${random}`,
    pullRequestTitle: 'Add PolicyConfig',
    commitMessage: 'Add PolicyConfig',
    pullRequestDescription: 'This PR adds a new PolicyConfig',
    clusterName: '',
    clusterNamespace: '',
    isControlPlane: false,
    policyConfigName: '',
    matchType: '',
    policies: {},
    wsMatch: [],
    appMatch: [],
  };

  const initialFormData = {
    ...defaultFormData,
    ...callbackState?.state?.formData,
  };

  return { initialFormData };
}
const CreatePolicyConfig = () => {
  const history = useHistory();

  let { data: allClusters } = useGetClustersList({});
  const clusters = allClusters?.gitopsClusters
    ?.filter(s => s.conditions![0].status === 'True')
    .sort();

  const { setNotifications } = useNotifications();
  const [selectedWorkspacesList, setSelectedWorkspacesList] = useState<any[]>();
  const [selectedAppsList, setSelectedAppsList] =
    useState<PolicyConfigApplicationMatch[]>();

  const callbackState = useCallbackState();
  const random = useMemo(() => Math.random().toString(36).substring(7), []);
  const { initialFormData } = getInitialData(callbackState, random);
  const authRedirectPage = `/policyConfigs/create`;

  const [loading, setLoading] = useState<boolean>(false);

  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>(initialFormData);

  const [enableCreatePR, setEnableCreatePR] = useState<boolean>(false);

  const { data } = useListSources('', '', { retry: false });
  const gitRepos = useMemo(() => getGitRepos(data?.result), [data?.result]);
  const initialGitRepo = getInitialGitRepo(
    null,
    gitRepos,
  ) as GitRepositoryEnriched;

  const [formError, setFormError] = useState<string>('');

  const {
    clusterName,
    policyConfigName,
    clusterNamespace,
    isControlPlane,
    matchType,
    selectedCluster,
    policies,
  } = formData;

  useEffect(() => clearCallbackState(), []);

  useEffect(() => {
    if (!formData.repo) {
      setFormData((prevState: any) => ({
        ...prevState,
        repo: initialGitRepo,
      }));
    }
  }, [initialGitRepo, formData.repo, clusterName]);

  const HandleSelectCluster = (event: React.ChangeEvent<any>) => {
    const cluster = event.target.value;
    const value = JSON.parse(cluster);
    const clusterDetails = {
      clusterName: value.name,
      clusterNamespace: value.namespace,
      selectedCluster: cluster,
      isControlPlane: value.name === 'management' ? true : false,
    };
    setFormData(
      (f: any) =>
        (f = {
          ...f,
          ...clusterDetails,
        }),
    );
  };
  useEffect(() => {
    setFormData((prevState: any) => ({
      ...prevState,
      pullRequestTitle: `Add PolicyConfig ${formData.policyConfigName}`,
    }));
  }, [formData.policyConfigName]);

  const handleFormData = (fieldName?: string, value?: any) => {
    setFormData((f: any) => (f = { ...f, [fieldName as string]: value }));
  };
  const getTargetList = useCallback(() => {
    switch (matchType) {
      case 'workspaces':
        return selectedWorkspacesList;
      case 'apps':
        return selectedAppsList;
    }
  }, [selectedWorkspacesList, selectedAppsList, matchType]);

  const getClusterAutomations = useCallback(() => {
    let clusterAutomations: ClusterAutomation[] = [];
    clusterAutomations.push({
      cluster: {
        name: clusterName,
        namespace: clusterNamespace,
      },
      policyConfig: {
        metadata: {
          name: policyConfigName,
        },
        spec: {
          match: {
            [matchType]: getTargetList(),
          },
          config: policies,
        },
      },
      isControlPlane: isControlPlane,
    });
    return clusterAutomations;
  }, [
    clusterName,
    clusterNamespace,
    isControlPlane,
    policyConfigName,
    policies,
    getTargetList,
    matchType,
  ]);

  const handleCreatePolicyConfig = useCallback(() => {
    const payload = {
      headBranch: formData.branchName,
      title: formData.pullRequestTitle,
      description: formData.pullRequestDescription,
      commitMessage: formData.commitMessage,
      clusterAutomations: getClusterAutomations(),
      repositoryUrl: getRepositoryUrl(formData.repo),
    };
    setLoading(true);
    return CreateDeploymentObjects(payload, getProviderToken(formData.provider))
      .then(response => {
        history.push(Routes.PolicyConfigs);
        setNotifications([
          {
            message: {
              component: (
                <Link href={response.webUrl} newTab>
                  PR created successfully, please review and merge the pull
                  request to apply the changes to the cluster.
                </Link>
              ),
            },
            severity: 'success',
          },
        ]);
      })
      .catch(error => {
        setNotifications([
          {
            message: { text: error.message },
            severity: 'error',
            display: 'bottom',
          },
        ]);
        if (isUnauthenticated(error.code)) {
          removeToken(formData.provider);
        }
      })
      .finally(() => setLoading(false));
  }, [formData, getClusterAutomations, history, setNotifications]);

  return (
    <ThemeProvider theme={localEEMuiTheme}>
      <PageTemplate
        documentTitle="Secrets"
        path={[
          { label: 'PolicyConfigs', url: Routes.PolicyConfigs },
          { label: 'Create New PolicyConfig' },
        ]}
      >
        <CallbackStateContextProvider
          callbackState={{
            page: authRedirectPage as PageRoute,
            state: {
              formData,
            },
          }}
        >
          <ContentWrapper>
            <FormWrapper
              noValidate
              onSubmit={event =>
                validateFormData(event, handleCreatePolicyConfig, setFormError)
              }
            >
              <div className="group-section">
                <Input
                  className="form-section"
                  name="policyConfigName"
                  description="The name of your policy configration"
                  label="NAME"
                  value={policyConfigName}
                  onChange={e =>
                    handleFormData('policyConfigName', e.target.value)
                  }
                  error={formError === 'policyConfigName' && !policyConfigName}
                />
                <Select
                  className="form-section"
                  name="clusterName"
                  label="CLUSTER"
                  value={selectedCluster || ''}
                  description="Select your cluster"
                  onChange={HandleSelectCluster}
                  error={formError === 'clusterName' && !clusterName}
                >
                  {!clusters?.length ? (
                    <MenuItem disabled={true}>Loading...</MenuItem>
                  ) : (
                    clusters?.map((option, index: number) => {
                      return (
                        <MenuItem
                          key={option.name}
                          value={JSON.stringify(option)}
                        >
                          {option.name}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
                <SelectMatchType
                  formError={formError}
                  formData={formData}
                  cluster={clusterName}
                  handleFormData={handleFormData}
                  selectedWorkspacesList={selectedWorkspacesList || []}
                  setSelectedWorkspacesList={setSelectedWorkspacesList}
                  setFormData={setFormData}
                  selectedAppsList={selectedAppsList || []}
                  setSelectedAppsList={setSelectedAppsList}
                />

                <SelectedPolicies
                  cluster={clusterName}
                  setFormData={setFormData}
                  formData={formData}
                />
              </div>
              <PreviewPRModal
                formData={formData}
                getClusterAutomations={getClusterAutomations}
              />
              <GitOps
                formData={formData}
                setFormData={setFormData}
                showAuthDialog={showAuthDialog}
                setShowAuthDialog={setShowAuthDialog}
                setEnableCreatePR={setEnableCreatePR}
                formError={formError}
                enableGitRepoSelection={true}
              />

              {loading ? (
                <LoadingPage className="create-loading" />
              ) : (
                <div className="create-cta">
                  <Button type="submit" disabled={!enableCreatePR}>
                    CREATE PULL REQUEST
                  </Button>
                </div>
              )}
            </FormWrapper>
          </ContentWrapper>
        </CallbackStateContextProvider>
      </PageTemplate>
    </ThemeProvider>
  );
};

export default CreatePolicyConfig;
