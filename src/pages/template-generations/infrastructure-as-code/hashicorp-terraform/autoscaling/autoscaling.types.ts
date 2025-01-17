export interface AutoScalingBody {
  autoscaling_group: boolean;
  launch_template: boolean;
  schedule: boolean;
  scaling_policy: boolean;
  iam_instance_profile: boolean;
}

export interface AutoScalingResponse extends File {}
