import { useState } from "react";
import { Sidebar } from "./Dashboard/Sidebar";
import { TopNavbar } from "./Dashboard/TopNavBar";
import { OverviewSection } from "./Dashboard/pages/OverviewSection";
import { PollsSection } from "./Dashboard/pages/PollsSection";
import { AnalyticsSection } from "./Dashboard/pages/AnalyticsSection";
import { CreatePollSection } from "./Dashboard/pages/CreatePollSection";
import { SettingsSection } from "./Dashboard/pages/SettingSection";





export default function Dashboard() {
  const dashboardSections = ["overview", "polls", "analytics", "create", "settings"];
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem("pulsehub-dashboard-section");
    return savedSection && dashboardSections.includes(savedSection) ? savedSection : "overview";
  });
  const [collapsed, setCollapsed] = useState(false);

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("pulsehub-dashboard-section", section);
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

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar
        active={activeSection}
        setActive={handleSetActiveSection}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <TopNavbar
        collapsed={collapsed}
        activeSection={activeSection}
      />

      <main className={`pt-16 ${collapsed ? "ml-16" : "ml-56"}`}>
        <div className="p-6">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
