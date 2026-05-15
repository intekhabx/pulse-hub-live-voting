import { useState } from "react";
import { Sidebar } from "./Dashboard/Sidebar";
import { TopNavbar } from "./Dashboard/TopNavBar";
import { OverviewSection } from "./Dashboard/pages/OverviewSection";
import { PollsSection } from "./Dashboard/pages/PollsSection";
import { AnalyticsSection } from "./Dashboard/pages/AnalyticsSection";
import { CreatePollSection } from "./Dashboard/pages/CreatePollSection";
import { SettingsSection } from "./Dashboard/pages/SettingSection";





export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection setActive={setActiveSection} />;
      case "polls":
        return <PollsSection setActive={setActiveSection} />;
      case "analytics":
        return <AnalyticsSection />;
      case "create":
        return <CreatePollSection setActive={setActiveSection} />;
      case "settings":
        return <SettingsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      <Sidebar
        active={activeSection}
        setActive={setActiveSection}
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