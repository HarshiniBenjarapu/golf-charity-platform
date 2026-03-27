import AppLayout from "@/components/AppLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We wrap the dashboard routes in our new custom AppLayout
  return <AppLayout>{children}</AppLayout>;
}
