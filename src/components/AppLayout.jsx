import { Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>FixMyCampus</strong>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Search (coming soon)"
              title="Search coming soon"
              disabled
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications (coming soon)"
              title="Notifications coming soon"
              disabled
            >
              <Bell size={19} />
            </button>

            <div className="avatar" aria-label="Demo user">
              D
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>

        <footer className="app-footer">
          FixMyCampus · Campus maintenance, made transparent.
        </footer>
      </div>
    </div>
  );
}