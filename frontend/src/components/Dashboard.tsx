import { useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sidebar } from "./Dashboard/Sidebar";
import { TopNavbar } from "./Dashboard/TopNavBar";
import { OverviewSection } from "./Dashboard/pages/OverviewSection";
import { PollsSection } from "./Dashboard/pages/PollsSection";
import { AnalyticsSection } from "./Dashboard/pages/AnalyticsSection";
import { CreatePollSection } from "./Dashboard/pages/CreatePollSection";
import { SettingsSection } from "./Dashboard/pages/SettingSection";
import { PollDetailsSection } from "./Dashboard/pages/PollDetailsSection";
import { ViewAndEditSection } from "./Dashboard/pages/ViewAndEditPollSection";
import { PollContext } from "../Context/PollContext";

interface DashboardProps {
  pollId?: string;
  editMode?: boolean;
}

export default function Dashboard({ pollId, editMode }: DashboardProps) {
  const navigate = useNavigate();
  const pollContext = useContext(PollContext);
  if (!pollContext) {
    throw new Error("Dashboard must be used within ContextApiProvider");
  }
  const { fetchDashboardData } = pollContext;

  const dashboardSections = ["overview", "polls", "analytics", "create", "settings"];
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem("dashboard-section");
    return savedSection && dashboardSections.includes(savedSection) ? savedSection : "overview";
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  
  const renderPollPage = (id: string) =>
    editMode ? (
      <ViewAndEditSection pollId={id} setActive={handleSetActiveSection} />
    ) : (
      <PollDetailsSection pollId={id} />
    );

  const displayedSection = pollId ? "polls" : activeSection;

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar
        active={displayedSection}
        setActive={handleSetActiveSection}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <TopNavbar
        collapsed={collapsed}
        activeSection={displayedSection}
        onMenuClick={() => setMobileOpen(true)}
      />

      <main className={`pt-16 transition-[margin] duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        <div className="p-4 sm:p-6">
          {pollId ? renderPollPage(pollId) : renderSection()}
        </div>
      </main>
    </div>
  );
}