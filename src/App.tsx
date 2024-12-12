import { Route, Routes, useLocation } from 'react-router';
import MainLayout from '@/components/layouts/main-layout/main-layout';
import TerraformTemplate from '@/pages/terraform-template/components/layout';
import {
  Argocd,
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

function App() {
  const location = useLocation();
  return (
    <Routes location={location}>
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
  );
}

export default App;
