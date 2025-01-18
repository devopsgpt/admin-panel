export interface RDSBody {
  db_instance: boolean;
  db_option_group: boolean;
  db_parameter_group: boolean;
  db_subnet_group: boolean;
  monitoring_role: boolean;
  cloudwatch_log_group: boolean;
  master_user_password_rotation: boolean;
}

export interface RDSResponse extends File {}
