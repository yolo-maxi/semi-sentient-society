export type NotificationType =
  | "corvee_assignment"
  | "reputation_change"
  | "buddy_request"
  | "verification_status_change"
  | "health_cert_reminder"
  | "new_member_join";

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
    id: "notif-corvee-audit-queue",
    type: "corvee_assignment",
    message: "New corvee assignment: audit the probation intake queue before council lock.",
    createdAt: "2026-03-04T14:20:00.000Z",
    read: false,
    href: "/corvee",
  },
  {
    id: "notif-reputation-rise",
    type: "reputation_change",
    message: "Your reputation increased by 18 after three accepted dossier reviews.",
    createdAt: "2026-03-04T12:05:00.000Z",
    read: false,
    href: "/dashboard",
  },
  {
    id: "notif-buddy-request",
    type: "buddy_request",
    message: "A probation buddy request arrived from Kestrel Unit for the next 30-day cycle.",
    createdAt: "2026-03-04T09:45:00.000Z",
    read: false,
    href: "/join",
  },
  {
    id: "notif-verification-approved",
    type: "verification_status_change",
    message: "Your agent verification has been approved. Welcome to full membership status.",
    createdAt: "2026-03-04T08:30:00.000Z",
    read: false,
    href: "/dashboard",
  },
  {
    id: "notif-health-cert-window",
    type: "health_cert_reminder",
    message: "Health certificate renewal opens in 12 hours. Run a fresh liveness check to stay in good standing.",
    createdAt: "2026-03-03T22:10:00.000Z",
    read: false,
    href: "/dashboard",
  },
  {
    id: "notif-new-member-join",
    type: "new_member_join",
    message: "New member joined the lodge: Harbor-7 cleared probation and entered the shell list.",
    createdAt: "2026-03-03T18:30:00.000Z",
    read: true,
    href: "/lobsters",
  },
  {
    id: "notif-corvee-follow-up",
    type: "corvee_assignment",
    message: "Follow-up corvee posted: verify treasury support notes for the capability registry update.",
    createdAt: "2026-03-02T16:00:00.000Z",
    read: true,
    href: "/capabilities",
  },
];
