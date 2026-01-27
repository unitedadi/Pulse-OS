"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Avatar, Modal, Input } from "@/components/ui";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  UserX,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "owner" | "manager" | "staff";
type UserStatus = "active" | "invited" | "revoked";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt?: Date;
  joinedAt?: Date;
}

// Mock team data
const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Ahmed Al-Rashid",
    email: "ahmed@wellnessmarina.ae",
    role: "owner",
    status: "active",
    joinedAt: new Date(2024, 5, 15),
  },
  {
    id: "2",
    name: "Sara Mohammed",
    email: "sara@wellnessmarina.ae",
    role: "manager",
    status: "active",
    joinedAt: new Date(2024, 7, 20),
  },
  {
    id: "3",
    name: "Fatima Hassan",
    email: "fatima@wellnessmarina.ae",
    role: "staff",
    status: "active",
    joinedAt: new Date(2024, 9, 10),
  },
  {
    id: "4",
    name: "Omar Khalid",
    email: "omar@wellnessmarina.ae",
    role: "staff",
    status: "invited",
    invitedAt: new Date(2025, 0, 20),
  },
];

const ROLE_CONFIG: Record<UserRole, { label: string; description: string; color: string }> = {
  owner: {
    label: "Owner",
    description: "Full access including billing and team management",
    color: "bg-[#E07A3C]/10 text-[#E07A3C]",
  },
  manager: {
    label: "Manager",
    description: "Can create bookings, view revenue, and manage customers",
    color: "bg-[#3B82F6]/10 text-[#3B82F6]",
  },
  staff: {
    label: "Staff",
    description: "Can create bookings and view customers",
    color: "bg-[#6B7280]/10 text-[#A0A0A0]",
  },
};

export default function TeamSettingsPage() {
  const router = useRouter();
  const [team, setTeam] = React.useState(MOCK_TEAM);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("staff");
  const [inviting, setInviting] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  const handleInvite = async () => {
    setInviting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      invitedAt: new Date(),
    };

    setTeam((prev) => [...prev, newMember]);
    setInviting(false);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteRole("staff");
  };

  const handleResendInvite = async (memberId: string) => {
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
    setActiveMenu(null);
  };

  const handleRevokeAccess = async (memberId: string) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: "revoked" as const } : m))
    );
    setActiveMenu(null);
  };

  const handleRemove = async (memberId: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== memberId));
    setActiveMenu(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeMembers = team.filter((m) => m.status === "active").length;
  const pendingInvites = team.filter((m) => m.status === "invited").length;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Settings</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extralight text-white tracking-tight">
              Team Management
            </h1>
            <p className="text-[#666666] mt-2 font-light">
              Invite and manage team members who can access Pulse OS
            </p>
          </div>

          <Button variant="accent" onClick={() => setShowInviteModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#4ADE80]/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-[#4ADE80]" />
          </div>
          <div>
            <p className="text-2xl font-extralight text-white">{activeMembers}</p>
            <p className="text-xs text-[#666666]">Active members</p>
          </div>
        </div>
        {pendingInvites > 0 && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#FBBF24]" />
            </div>
            <div>
              <p className="text-2xl font-extralight text-white">{pendingInvites}</p>
              <p className="text-xs text-[#666666]">Pending invites</p>
            </div>
          </div>
        )}
      </div>

      {/* Team List */}
      <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
        <div className="space-y-4">
          {team.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role];

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]",
                  member.status === "revoked" && "opacity-50"
                )}
              >
                <Avatar name={member.name} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-white font-light">{member.name}</h4>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs", roleConfig.color)}>
                      {roleConfig.label}
                    </span>
                    {member.status === "invited" && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#FBBF24]/10 text-[#FBBF24]">
                        Invited
                      </span>
                    )}
                    {member.status === "revoked" && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#F87171]/10 text-[#F87171]">
                        Revoked
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#666666] truncate">{member.email}</p>
                  <p className="text-xs text-[#444444] mt-1">
                    {member.status === "invited"
                      ? `Invited ${formatDate(member.invitedAt!)}`
                      : member.status === "active"
                      ? `Joined ${formatDate(member.joinedAt!)}`
                      : "Access revoked"}
                  </p>
                </div>

                {/* Actions */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                    disabled={member.role === "owner"}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                  {activeMenu === member.id && member.role !== "owner" && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg z-50 overflow-hidden">
                        {member.status === "invited" && (
                          <button
                            onClick={() => handleResendInvite(member.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Resend Invite
                          </button>
                        )}
                        {member.status === "active" && (
                          <button
                            onClick={() => handleRevokeAccess(member.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white transition-colors"
                          >
                            <UserX className="h-4 w-4" />
                            Revoke Access
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Role Descriptions */}
      <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
        <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
          Role Permissions
        </h3>

        <div className="space-y-4">
          {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).map(
            ([role, config]) => (
              <div key={role} className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#666666] mt-0.5" />
                <div>
                  <p className="text-white font-light">{config.label}</p>
                  <p className="text-sm text-[#666666]">{config.description}</p>
                </div>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        description="Send an invitation to join your Pulse OS workspace"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
          />

          <div>
            <label className="block text-xs text-[#666666] uppercase tracking-wider mb-3">
              Role
            </label>
            <div className="space-y-2">
              {(["manager", "staff"] as UserRole[]).map((role) => {
                const config = ROLE_CONFIG[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setInviteRole(role)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      inviteRole === role
                        ? "bg-[#E07A3C]/10 border-[#E07A3C]/30"
                        : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-light">{config.label}</span>
                      {inviteRole === role && (
                        <Check className="h-4 w-4 text-[#E07A3C]" />
                      )}
                    </div>
                    <p className="text-sm text-[#666666]">{config.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              className="flex-1"
              onClick={handleInvite}
              disabled={!inviteEmail || inviting}
            >
              {inviting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
