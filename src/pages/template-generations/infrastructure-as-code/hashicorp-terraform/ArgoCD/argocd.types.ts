export interface ArgocdBody {
  argocd_application: {
    sync_policy: {
      auto_prune: boolean;
      self_heal: boolean;
    };
  } | null;
  argocd_repository: boolean;
}

export type ArgocdResponse = File;
