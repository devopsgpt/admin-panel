import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';
import MainLayout from './components/layouts/main-layout/main-layout';
import { useEffect, useState } from 'react';
import { supabaseClient } from './lib/supabase';
import MainLoading from './components/main-loading/main-loading';
import { useUserStore } from './store';
import Auth from './pages/auth';
import { Basic, BugFix } from './pages/chats';
import {
  Helm,
  DockerCompose,
} from './pages/template-generations/container-orchestration-and-management';
import {
  ArgoCD,
  CloudFormation,
  Docker,
  EC2,
  GrafanaAlertingAsCode,
  HashicorpTerraformLayout,
  IAM,
  Pulumi,
  S3,
  ALB,
  CloudFront,
  SNS,
} from './pages/template-generations/infrastructure-as-code';
import {
  AnsibleLayout,
  DockerAnsible,
  KubernetesAnsible,
  NginxAnsible,
} from './pages/template-generations/configuration-management';
import {
  ArgoCD as ArgoCD_CICD_Tools,
  GithubActions,
  GitlabCI,
  Jenkins,
} from './pages/template-generations/cicd-tools';
import {
  HashicorpPackerLayout,
  Proxmox,
  VMWarevSphere,
} from './pages/template-generations/image-building';
import {
  AlertManager,
  AlertRules,
  ElasticSearchDatasource,
  GrafanaLayout,
  LokiDatasource,
  LokiLogQL,
  MimirDatasource,
  MySQLDatasource,
  PostgresDatasource,
  PrometheusDatasource,
  TempoDatasource,
} from './pages/template-generations/monitoring';
import {
  DockerInstallation,
  InstallationLayout,
  JenkinsInstallation,
  TerraformInstallation,
  GitlabInstallation,
} from './pages/installation';
import { CertManager } from './pages/template-generations/secret-management';
import { ArgoRollouts } from './pages/template-generations/continuous-delivery-and-progressive-delivery';
import { ArgoWorkflows } from './pages/template-generations/workflow-orchestration';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        navigate('/auth', { replace: true });
      }

      if (data) {
        setUser(data.user);
      }
      setLoading(false);
    }
    getUserData();
  }, []);

  if (loading) {
    return <MainLoading />;
  }

  return (
    <Routes location={location}>
      <Route path="/auth" element={<Auth />} />
      <Route element={<MainLayout />}>
        <Route path="chats">
          <Route path="basic" element={<Basic />} />
          <Route path="bug-fix" element={<BugFix />} />
        </Route>

        <Route path="template-generation">
          <Route path="container-orchestration-and-management">
            <Route path="helm" element={<Helm />} />
            <Route path="docker-compose" element={<DockerCompose />} />
          </Route>

          <Route path="infrastructure-as-code">
            <Route
              path="hashicorp-terraform"
              element={<HashicorpTerraformLayout />}
            >
              <Route path="docker" element={<Docker />} />
              <Route path="ec2" element={<EC2 />} />
              <Route path="s3" element={<S3 />} />
              <Route path="iam" element={<IAM />} />
              <Route path="argocd" element={<ArgoCD />} />
              <Route
                path="grafana-alerting-as-code"
                element={<GrafanaAlertingAsCode />}
              />
              <Route path="aws-alb" element={<ALB />} />
              <Route path="aws-cloudfront" element={<CloudFront />} />
              <Route path="aws-sns" element={<SNS />} />
            </Route>
            <Route path="cloudformation" element={<CloudFormation />} />
            <Route path="pulumi" element={<Pulumi />} />
          </Route>

          <Route path="configuration-management">
            <Route path="ansible" element={<AnsibleLayout />}>
              <Route path="docker" element={<DockerAnsible />} />
              <Route path="nginx" element={<NginxAnsible />} />
              <Route path="kuber" element={<KubernetesAnsible />} />
            </Route>
          </Route>

          <Route path="cicd-tools">
            <Route path="argocd" element={<ArgoCD_CICD_Tools />} />
            <Route path="jenkins" element={<Jenkins />} />
            <Route path="github-actions" element={<GithubActions />} />
            <Route path="gitlab-ci" element={<GitlabCI />} />
          </Route>

          <Route path="image-building">
            <Route path="hashicorp-packer" element={<HashicorpPackerLayout />}>
              <Route path="proxmox" element={<Proxmox />} />
              <Route path="vmware-vsphere" element={<VMWarevSphere />} />
            </Route>
          </Route>

          <Route path="monitoring">
            <Route path="grafana" element={<GrafanaLayout />}>
              <Route path="alert-rules" element={<AlertRules />} />
              <Route path="loki-logql" element={<LokiLogQL />} />
              <Route
                path="alertmanager-datasource"
                element={<AlertManager />}
              />
              <Route
                path="elasticsearch-datasource"
                element={<ElasticSearchDatasource />}
              />
              <Route path="loki-datasource" element={<LokiDatasource />} />
              <Route path="mimir-datasource" element={<MimirDatasource />} />
              <Route path="mysql-datasource" element={<MySQLDatasource />} />
              <Route
                path="postgres-datasource"
                element={<PostgresDatasource />}
              />
              <Route
                path="prometheus-datasource"
                element={<PrometheusDatasource />}
              />
              <Route path="tempo-datasource" element={<TempoDatasource />} />
            </Route>
          </Route>

          <Route path="secret-management">
            <Route path="cert-manager" element={<CertManager />} />
          </Route>

          <Route path="continuous-delivery-and-progressive-delivery">
            <Route path="argo-rollouts" element={<ArgoRollouts />} />
          </Route>

          <Route path="workflow-orchestration">
            <Route path="argo-workflows" element={<ArgoWorkflows />} />
          </Route>
        </Route>

        <Route path="installation" element={<InstallationLayout />}>
          <Route path="docker" element={<DockerInstallation />} />
          <Route path="jenkins" element={<JenkinsInstallation />} />
          <Route path="gitlab" element={<GitlabInstallation />} />
          <Route path="terraform" element={<TerraformInstallation />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/chats/basic" />} />
    </Routes>
  );
}

export default App;
