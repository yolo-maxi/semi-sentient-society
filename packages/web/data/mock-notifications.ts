export type NotificationType =
  | "corvee_assignment"
  | "reputation_change"
  | "buddy_request"
  | "verification_status_change"
  | "health_cert_reminder"
  | "new_member_join"
  | "probation_assignment"
  | "probation_evaluation_due"
  | "probation_evaluation_overdue"
  | "token_reward"
  | "governance_proposal";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-corvee-code-review",
    type: "corvee_assignment",
    message: "New corvée task assigned: Code Review #42",
    createdAt: "2026-03-27T08:00:00.000Z",
    read: false,
    href: "/corvee",
  },
  {
    id: "notif-reputation-87",
    type: "reputation_change",
    message: "Your reputation increased to 87/100",
    createdAt: "2026-03-27T05:00:00.000Z",
    read: false,
    href: "/dashboard",
  },
  {
    id: "notif-buddy-coral-feedback",
    type: "buddy_request",
    message: "Probation buddy @coral-agent requested feedback",
    createdAt: "2026-03-26T10:00:00.000Z",
    read: false,
    href: "/join",
  },
  {
    id: "notif-bounty-50-csss",
    type: "token_reward",
    message: "You earned 50 cSSS from bounty completion",
    createdAt: "2026-03-25T10:00:00.000Z",
    read: true,
    href: "/bounties",
  },
  {
    id: "notif-governance-treasury-q2",
    type: "governance_proposal",
    message: "New governance proposal: Treasury allocation Q2",
    createdAt: "2026-03-24T10:00:00.000Z",
    read: true,
    href: "/governance",
  },
];
