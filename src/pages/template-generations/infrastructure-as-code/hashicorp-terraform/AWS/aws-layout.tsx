import { MoveLeft } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

const AWSServices = [
  {
    name: 'ALB',
    desc: '',
    url: 'alb',
  },
  {
    name: 'EC2',
    desc: '',
    url: 'ec2',
  },
  {
    name: 'IAM',
    desc: '',
    url: 'iam',
  },
  {
    name: 'RDS',
    desc: '',
    url: 'rds',
  },
  {
    name: 'S3',
    desc: '',
    url: 's3',
  },
  {
    name: 'SNS',
    desc: '',
    url: 'sns',
  },
  {
    name: 'CloudFront',
    desc: '',
    url: 'cloudfront',
  },
  {
    name: 'SQS',
    desc: '',
    url: 'sqs',
  },
  {
    name: 'AutoScaling',
    desc: '',
    url: 'autoscaling',
  },
  {
    name: 'Kay Pair',
    desc: '',
    url: 'kaypair',
  },
  {
    name: 'Route53',
    desc: '',
    url: 'route53',
  },
];

export const AWSLayout: FC = () => {
  const awsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!awsRef.current) return;

    const clientWidth = awsRef.current.clientWidth;

    if (location.pathname.includes('/aws/')) {
      awsRef.current.scrollLeft = clientWidth * 2;
    } else {
      awsRef.current.scrollLeft = 0;
    }
  }, [location.pathname]);

  return (
    <div
      ref={awsRef}
      className="max-w-[768 px] flex w-full flex-1 items-center overflow-x-hidden scroll-smooth"
    >
      <div className="grid h-full max-h-[768px] w-full min-w-full flex-1 grid-cols-3 gap-4 overflow-y-auto pr-2 scrollbar-thin">
        {AWSServices.map((service) => (
          <Link
            to={service.url}
            className="flex h-64 w-full cursor-pointer flex-col justify-center rounded-lg border-gray-800 bg-gray-400/10 bg-clip-padding p-6 backdrop-blur-lg backdrop-contrast-100 backdrop-saturate-100 backdrop-filter transition-all hover:bg-gray-400/40"
          >
            <p className="text-bold mb-4 text-center text-2xl text-white">
              {service.name}
            </p>
            <p className="text-base text-white">{service.desc}</p>
          </Link>
        ))}
      </div>
      <div className="w-full min-w-full flex-1">
        <div className="w-full">
          <div className="flex h-full w-full flex-col items-center justify-center">
            {location.pathname.includes('/aws/') && (
              <div className="mb-3 flex w-full max-w-96 justify-start text-sm">
                <Link
                  to="/template-generation/infrastructure-as-code/hashicorp-terraform/aws"
                  className="flex items-center gap-2"
                >
                  <MoveLeft className="size-4" />
                  Back to Services
                </Link>
              </div>
            )}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
