export interface EC2Body {
  key_pair: boolean;
  security_group: boolean;
  aws_instance: boolean;
  ami_from_instance: boolean;
}

export type EC2Response = File;
