import { Route, Routes, useLocation, useNavigate } from 'react-router';
import MainLayout from '@/components/layouts/main-layout/main-layout';
import TerraformTemplate from '@/pages/terraform-template/components/layout';
import {
  Argocd,
  Auth,
  Basic,
  BugFix,
  Docker,
  DockerAnsible,
  DockerCompose,
  DockerInstallation,
  EC2,
  GitlabInstallation,
  HelmTemplate,
  IAM,
  JenkinsInstallation,
  KubernetesAnsible,
  NginxAnsible,
  S3,
  TerraformInstallation,
} from '@/pages';
import { AnsibleLayout } from './pages/ansible/components/layout';
import { useEffect, useState } from 'react';
import { supabaseClient } from './lib/supabase';
import MainLoading from './components/main-loading/main-loading';
import { useUserStore } from './store';
import InstallationLayout from './pages/installation/components/layout';

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
        <Route index element={<Basic />} />
        <Route path="bug-fix" element={<BugFix />} />
        <Route path="helm-template" element={<HelmTemplate />} />
        <Route path="docker-compose" element={<DockerCompose />} />
        <Route path="terraform-template" element={<TerraformTemplate />}>
          <Route path="docker" element={<Docker />} />
          <Route path="ec2" element={<EC2 />} />
          <Route path="s3" element={<S3 />} />
          <Route path="iam" element={<IAM />} />
          <Route path="argocd" element={<Argocd />} />
        </Route>
        <Route path="ansible-template" element={<AnsibleLayout />}>
          <Route path="docker" element={<DockerAnsible />} />
          <Route path="nginx" element={<NginxAnsible />} />
          <Route path="kuber" element={<KubernetesAnsible />} />
        </Route>
        <Route path="installation" element={<InstallationLayout />}>
          <Route path="docker" element={<DockerInstallation />} />
          <Route path="jenkins" element={<JenkinsInstallation />} />
          <Route path="gitlab" element={<GitlabInstallation />} />
          <Route path="terraform" element={<TerraformInstallation />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
