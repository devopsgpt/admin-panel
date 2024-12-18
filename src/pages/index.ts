import Argocd from './terraform-template/ARGOCD/argocd';
import Docker from './terraform-template/Docker/docker';
import EC2 from './terraform-template/EC2/ec2';
import IAM from './terraform-template/IAM/iam';
import S3 from './terraform-template/S3/s3';
import Basic from './basic/basic';
import BugFix from './bug-fix/bug-fix';
import HelmTemplate from './helm-template/helm-template';
import Auth from './auth/auth';
import NginxAnsible from './ansible/nginx/nginx';
import DockerAnsible from './ansible/docker/docker';
import KubernetesAnsible from './ansible/kuber/kuber';
import DockerCompose from './docker-compose/docker-compose';
import DockerInstallation from './installation/docker/docker';
import JenkinsInstallation from './installation/jenkins/jenkins';
import GitlabInstallation from './installation/gitlab/gitlab';
import TerraformInstallation from './installation/terraform/terraform';

export {
  Argocd,
  Docker,
  EC2,
  IAM,
  S3,
  Basic,
  BugFix,
  HelmTemplate,
  Auth,
  NginxAnsible,
  DockerAnsible,
  KubernetesAnsible,
  DockerCompose,
  DockerInstallation,
  JenkinsInstallation,
  GitlabInstallation,
  TerraformInstallation,
};
