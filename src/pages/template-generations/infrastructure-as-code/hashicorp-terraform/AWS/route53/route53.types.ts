export interface Route53Body {
  zone: boolean;
  record: boolean;
  delegation_set: boolean;
  resolver_rule_association: boolean;
}

export interface Route53Response extends File {}
