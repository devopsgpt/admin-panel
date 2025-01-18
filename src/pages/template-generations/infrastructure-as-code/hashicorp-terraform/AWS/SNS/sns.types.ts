export interface SNSBody {
  sns_topic: boolean;
  topic_policy: boolean;
  subscription: boolean;
}

export interface SNSResponse extends File {}
