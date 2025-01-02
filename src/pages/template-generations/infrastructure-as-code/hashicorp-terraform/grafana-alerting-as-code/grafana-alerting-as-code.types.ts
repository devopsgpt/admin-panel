import { z as zod } from 'zod';

export const terraformGrafanaSchema = zod.object({
  create_contact_point: zod.object({
    use_email: zod.boolean(),
    use_slack: zod.boolean(),
  }),
  create_message_template: zod.boolean(),
  create_mute_timing: zod.boolean(),
  create_notification_policy: zod.boolean(),
});

export type TerraformGrafanaSchema = zod.infer<typeof terraformGrafanaSchema>;

export interface GetTfVarsBody {
  create_contact_point: {
    use_email: boolean;
    use_slack: boolean;
  } | null;
  create_message_template: boolean;
  create_mute_timing: boolean;
  create_notification_policy: boolean;
}
