import { TaskFlowLogo } from "@/components/TaskFlowLogo";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl">
        <div className="flex items-center space-x-2">
          <TaskFlowLogo />
        </div>
        <div className="flex items-center space-x-2">
          <NotificationCenter />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
