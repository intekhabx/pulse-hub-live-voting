import { useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DataContext } from "../Context/ContextApi";
import { Sidebar } from "./Dashboard/Sidebar";
import { TopNavbar } from "./Dashboard/TopNavBar";
import { OverviewSection } from "./Dashboard/pages/OverviewSection";
import { PollsSection } from "./Dashboard/pages/PollsSection";
import { AnalyticsSection } from "./Dashboard/pages/AnalyticsSection";
import { CreatePollSection } from "./Dashboard/pages/CreatePollSection";
import { SettingsSection } from "./Dashboard/pages/SettingSection";
import { PollDetailsSection } from "./Dashboard/pages/PollDetailsSection";





interface DashboardProps {
  pollId?: string;
}

export default function Dashboard({ pollId }: DashboardProps) {
  const navigate = useNavigate();
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Dashboard must be used within ContextApiProvider");
  }
  const { refreshDashboardData } = context;
  const dashboardSections = ["overview", "polls", "analytics", "create", "settings"];
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem("dashboard-section");
    return savedSection && dashboardSections.includes(savedSection) ? savedSection : "overview";
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("dashboard-section", section);
    if (pollId) {
      navigate({ to: "/dashboard" });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection setActive={handleSetActiveSection} />;
      case "polls":
        return <PollsSection setActive={handleSetActiveSection} />;
      case "analytics":
        return <AnalyticsSection />;
      case "create":
        return <CreatePollSection setActive={handleSetActiveSection} />;
      case "settings":
        return <SettingsSection />;
    }
  };

  const displayedSection = pollId ? "polls" : activeSection;

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar
        active={displayedSection}
        setActive={handleSetActiveSection}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <TopNavbar
        collapsed={collapsed}
        activeSection={displayedSection}
      />

      <main className={`pt-16 ${collapsed ? "ml-16" : "ml-56"}`}>
        <div className="p-6">
          {pollId ? <PollDetailsSection pollId={pollId} /> : renderSection()}
        </div>
      </main>
    </div>
  );
}
