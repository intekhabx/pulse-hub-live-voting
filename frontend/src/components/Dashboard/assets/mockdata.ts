import type { ActivityItem } from "./types";


// ── Mock Data ──────────────────────────────────────────────────────────────

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 1, poll: "Developer Experience Survey 2024", action: "New response received", time: "2 min ago", icon: "response" },
  { id: 2, poll: "Product Roadmap Feedback Q2", action: "New response received", time: "15 min ago", icon: "response" },
  { id: 3, poll: "Team Retrospective — Sprint 42", action: "Results published", time: "2 hours ago", icon: "publish" },
  { id: 4, poll: "Tech Stack Preferences", action: "Poll expired", time: "Yesterday", icon: "expire" },
  { id: 5, poll: "Onboarding Experience Check", action: "Poll created", time: "Yesterday", icon: "create" },
];