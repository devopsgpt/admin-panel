export interface SQSBody {
  sqs_queue: boolean;
  queue_policy: boolean;
  dlq: boolean;
  dlq_redrive_allow_policy: boolean;
  dlq_queue_policy: boolean;
}

export interface SQSResponse extends File {}
