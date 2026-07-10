import WorkspaceGate from "./WorkspaceGate";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return <WorkspaceGate workspaceId={workspaceId}>{children}</WorkspaceGate>;
}
