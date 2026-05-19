import FAB from "./FAB";
import AppSidebar from "./AppSidebar";
import { cn } from "../lib/utils";

export default function AppLayout({ children, className }) {
    return (
        <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
            <AppSidebar />

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

            {/* FAB floating button */}
            <FAB sidebarOpen={false} />
        </div>
    );
}