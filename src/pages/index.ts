import Argocd from './terraform-template/ARGOCD/argocd';
import Docker from './terraform-template/Docker/docker';
import EC2 from './terraform-template/EC2/ec2';
import IAM from './terraform-template/IAM/iam';
import S3 from './terraform-template/S3/s3';
import Basic from './basic/basic';
import BugFix from './bug-fix/bug-fix';
import HelmTemplate from './helm-template/helm-template';
import NginxAnsible from './ansible/nginx/nginx';
import DockerAnsible from './ansible/docker/docker';
import KubernetesAnsible from './ansible/kuber/kuber';
import DockerCompose from './docker-compose/docker-compose';
<<<<<<< HEAD
import Auth from './auth/auth';
=======
import DockerInstallation from './installation/docker/docker';
import JenkinsInstallation from './installation/jenkins/jenkins';
import GitlabInstallation from './installation/gitlab/gitlab';
import TerraformInstallation from './installation/terraform/terraform';
>>>>>>> 9a159cd (refactor: Transform Installation page into a layout with nested pages)

export {
  Argocd,
  Docker,
  EC2,
  IAM,
  S3,
  Basic,
  BugFix,
  HelmTemplate,
  NginxAnsible,
  DockerAnsible,
  KubernetesAnsible,
  DockerCompose,
<<<<<<< HEAD
  Auth,
=======
  DockerInstallation,
  JenkinsInstallation,
  GitlabInstallation,
  TerraformInstallation,
>>>>>>> 9a159cd (refactor: Transform Installation page into a layout with nested pages)
};
