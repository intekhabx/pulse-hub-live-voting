import type { Poll, ActivityItem } from "./types";


// ── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_POLLS: Poll[] = [
  { id: "1", title: "Developer Experience Survey 2024", status: "active", responses: 128, questions: 6, expiresAt: "2025-06-10", isPublished: false, allowAnonymous: true },
  { id: "2", title: "Product Roadmap Feedback Q2", status: "active", responses: 74, questions: 4, expiresAt: "2025-05-30", isPublished: false, allowAnonymous: false },
  { id: "3", title: "Team Retrospective — Sprint 42", status: "expired", responses: 23, questions: 5, expiresAt: "2025-04-20", isPublished: true, allowAnonymous: true },
  { id: "4", title: "Tech Stack Preferences", status: "expired", responses: 210, questions: 8, expiresAt: "2025-03-15", isPublished: true, allowAnonymous: true },
  { id: "5", title: "Onboarding Experience Check", status: "draft", responses: 0, questions: 3, expiresAt: "2025-07-01", isPublished: false, allowAnonymous: false },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 1, poll: "Developer Experience Survey 2024", action: "New response received", time: "2 min ago", icon: "response" },
  { id: 2, poll: "Product Roadmap Feedback Q2", action: "New response received", time: "15 min ago", icon: "response" },
  { id: 3, poll: "Team Retrospective — Sprint 42", action: "Results published", time: "2 hours ago", icon: "publish" },
  { id: 4, poll: "Tech Stack Preferences", action: "Poll expired", time: "Yesterday", icon: "expire" },
  { id: 5, poll: "Onboarding Experience Check", action: "Poll created", time: "Yesterday", icon: "create" },
];