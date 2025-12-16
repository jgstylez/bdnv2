export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super-admin" | "admin" | "moderator" | "support";
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalNonprofits: number;
  activeUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingApprovals: number;
  supportTickets: number;
}

export interface UserManagementFilters {
  search?: string;
  userType?: "consumer" | "business" | "nonprofit";
  level?: string;
  status?: "active" | "inactive" | "suspended";
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface BusinessManagementFilters {
  search?: string;
  status?: "pending" | "approved" | "rejected" | "suspended";
  merchantType?: string;
  merchantLevel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ContentManagementItem {
  id: string;
  type: "blog" | "video" | "channel" | "dynamic";
  title: string;
  status: "draft" | "published" | "archived";
  author: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

