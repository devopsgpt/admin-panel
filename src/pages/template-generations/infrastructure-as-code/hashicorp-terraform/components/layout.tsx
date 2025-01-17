import { FC } from 'react';
import { NavLink, Outlet } from 'react-router';

const menu = [
  {
    url: 'docker',
    title: 'Docker Service',
  },
  {
    url: 'ec2',
    title: 'AWS EC2',
  },
  {
    url: 's3',
    title: 'AWS S3',
  },
  {
    url: 'iam',
    title: 'AWS IAM',
  },
  {
    url: 'argocd',
    title: 'ArgoCD Service',
  },
  {
    url: 'grafana-alerting-as-code',
    title: 'Grafana Alerting As Code',
  },
  {
    url: 'aws-alb',
    title: 'AWS ALB',
  },
  {
    url: 'aws-cloudfront',
    title: 'AWS CloudFront',
  },
  {
    url: 'aws-sns',
    title: 'AWS SNS',
  },
  {
    url: 'aws-autoscaling',
    title: 'AWS AutoScaling',
  },
  {
    url: 'aws-sqs',
    title: 'AWS SQS',
  },
  {
    url: 'aws-route53',
    title: 'AWS Route53',
  },
  {
    url: 'aws-kaypair',
    title: 'AWS Kay Pair',
  },
  {
    url: 'aws-rds',
    title: 'AWS RDS',
  },
];

export const HashicorpTerraformLayout: FC = () => {
  return (
    <div className="flex h-full items-center">
      <div className="flex h-full w-full max-w-96 flex-col items-center justify-center">
        {menu.map((link) => (
          <NavLink
            key={link.url}
            to={link.url}
            className={({ isActive }) =>
              `block w-full rounded-md p-4 text-center text-white outline-none transition-all ${isActive ? 'bg-orchid-medium text-white' : ''}`
            }
          >
            {link.title}
          </NavLink>
        ))}
      </div>
      <div className="flex h-full w-2/3 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};
