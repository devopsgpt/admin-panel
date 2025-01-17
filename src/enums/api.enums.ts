export enum HashicorpTerraformAPI {
  Argocd = '/IaC-template/argocd',
  Iam = '/IaC-template/aws/iam',
  S3 = '/IaC-template/aws/s3',
  EC2 = '/IaC-template/aws/ec2',
  Docker = '/IaC-template/docker',
  GrafanaAlertingAsCode = '/grafana/terraform',
  ALB = '/IaC-template/aws/alb',
  CloudFront = 'IaC-template/aws/cloudfront',
  SNS = 'IaC-template/aws/sns',
  AutoScaling = 'IaC-template/aws/autoscaling',
  SQS = 'IaC-template/aws/sqs',
  Route53 = 'IaC-template/aws/route53',
  KeyPair = 'IaC-template/aws/key_pair',
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
