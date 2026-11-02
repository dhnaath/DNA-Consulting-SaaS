import { useState } from "react";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

export function ProfileMenu({
  isOpen,
  onClose,
  isMobile,
  onOpenSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onOpenSettings: (tab: string) => void;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className={cn(
          "absolute z-50 w-64 bg-card rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default text-left",
          isMobile ? "top-14 right-0" : "top-[calc(100%+8px)] right-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info */}
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
              ME
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">My Account</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <ProfileMenuItem
            icon={User}
            label="Profile Settings"
            onClick={() => onOpenSettings("profile")}
          />
          <ProfileMenuItem
            icon={Settings}
            label="Preferences"
            onClick={() => onOpenSettings("general")}
          />

          <ProfileMenuItem
            icon={CreditCard}
            label="Billing & Subscription"
            onClick={() => onOpenSettings("billing")}
          />

        </div>

        <div className="p-2 border-t border-border">
          <ProfileMenuItem
            icon={LogOut}
            label="Sign Out"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {}}
          />
        </div>
      </div>
    </>
  );
}

export function ProfileMenuItem({ icon: Icon, label, rightText, className, onClick }: any) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        {label}
      </div>
      {rightText && <span className="text-xs text-muted-foreground/70">{rightText}</span>}
    </button>
  );
}

export function SettingsModal({
  isOpen,
  onClose,
  initialTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "general");

  // Update tab if initialTab changes while open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-xl w-full max-w-4xl h-[80vh] max-h-[800px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Settings Sidebar */}
        <div className="w-64 bg-muted/30 border-r border-border flex flex-col hidden md:flex shrink-0">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-1">
            <SettingsTab
              id="profile"
              icon={User}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SettingsTab
              id="general"
              icon={Settings}
              label="Preferences"
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            />

            <SettingsTab
              id="billing"
              icon={CreditCard}
              label="Billing"
              active={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
            />
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 flex flex-col bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between md:justify-end">
            <div className="md:hidden flex items-center gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm font-medium text-card-foreground outline-none"
              >
                <option value="profile">Profile</option>
                <option value="general">Preferences</option>

                <option value="billing">Billing</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <LogOut size={18} className="rotate-180" />{" "}
              {/* Reusing LogOut icon for close or just use text if no X */}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "general" && <GeneralSettings />}

            {activeTab === "billing" && <BillingSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsTab({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-card text-blue-600 shadow-sm border border-border/50"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon size={18} className={active ? "text-blue-500" : "text-muted-foreground/70"} />
      {label}
    </button>
  );
}

function ProfileSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Profile Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Update your personal details and public profile.
        </p>
      </div>
      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl shrink-0">
          ME
        </div>
        <div>
          <button className="px-4 py-2 bg-muted hover:bg-accent text-card-foreground text-sm font-medium rounded-lg transition-colors">
            Change Avatar
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-card-foreground">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-card-foreground">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Email Address</label>
          <input
            type="email"
            defaultValue="john.doe@example.com"
            className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
          />
        </div>
      </div>
      <div className="pt-4">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md shadow-blue-600/20 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">General Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">Manage how the application behaves.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
          <div>
            <h4 className="font-medium text-foreground">Desktop Notifications</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive alerts for tasks and events.
            </p>
          </div>
          <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-card rounded-full absolute top-1 right-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
          <div>
            <h4 className="font-medium text-foreground">Email Summaries</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Receive daily agenda emails.</p>
          </div>
          <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-card rounded-full absolute top-1 left-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground mb-6">Manage your plan and payment methods.</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-xl">Free Plan</h4>
          <span className="px-3 py-1 bg-card/20 rounded-full text-xs font-semibold backdrop-blur-sm">
            Current
          </span>
        </div>
        <p className="text-blue-100 text-sm mb-6">
          You are currently on the free tier. Upgrade to unlock premium features and higher limits.
        </p>
        <button className="bg-card text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted/30 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

