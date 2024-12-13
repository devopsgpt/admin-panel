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
  EC2,
  HelmTemplate,
  IAM,
  Installation,
  KubernetesAnsible,
  NginxAnsible,
  S3,
} from '@/pages';
import { AnsibleLayout } from './pages/ansible/components/layout';
import { useEffect, useState } from 'react';
import { supabaseClient } from './lib/supabase';
import MainLoading from './components/main-loading/main-loading';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      const { error } = await supabaseClient.auth.getUser();
      if (error) {
        navigate('/auth', { replace: true });
      } else {
      }
      setLoading(false);
    }
    getUserData();
  }, []);

  if (loading) {
    return <MainLoading />;
  }

  return (
    <>
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
          <Route path="installation" element={<Installation />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
