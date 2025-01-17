export enum HashicorpTerraformAPI {
  Argocd = '/IaC-template/argocd',
  Iam = '/IaC-template/aws/iam',
  S3 = '/IaC-template/aws/s3',
  EC2 = '/IaC-template/aws/ec2',
  Docker = '/IaC-template/docker',
  GrafanaAlertingAsCode = '/grafana/terraform',
  ALB = '/IaC-template/aws/alb',
}

export enum API {
  Basic = '/IaC-basic',
  BugFix = '/IaC-bugfix',
  Helm = '/Helm-template',
  DockerCompose = '/docker-compose',
}

export enum AnsibleTemplateAPI {
  Docker = '/ansible-install/docker',
  Nginx = '/ansible-install/nginx',
  Kubernetes = '/ansible-install/kuber',
}

export enum INSTALLATION {
  Docker = '/docker/installation',
  Gitlab = '/gitlab/installation',
  Jenkins = '/jenkins/installation',
  Terraform = '/IaC-install',
}
