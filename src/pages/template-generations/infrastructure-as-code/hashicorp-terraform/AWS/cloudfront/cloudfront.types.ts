export interface CloudFrontBody {
  distribution: boolean;
  origin_access_identity: boolean;
  origin_access_control: boolean;
  monitoring_subscription: boolean;
  vpc_origin: boolean;
}

export interface CloudFrontResponse extends File {}
