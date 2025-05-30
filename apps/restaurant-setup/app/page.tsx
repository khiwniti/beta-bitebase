"use client";

import dynamic from "next/dynamic";
import { TooltipProvider } from "../restaurant-setup/components/ui/tooltip";
import { TripsProvider } from "../restaurant-setup/lib/hooks/use-trips";
import { RestaurantProvider } from "../restaurant-setup/lib/hooks/use-restaurant";
import { ToolsManager } from "../restaurant-setup/components/ToolsManager";
import { CustomCopilotProvider } from "../restaurant-setup/components/CustomCopilotProvider";
import { MainNavigation } from "../restaurant-setup/components/MainNavigation";

// Disable server-side rendering for the MapCanvas component, this
// is because Leaflet is not compatible with server-side rendering
//
// https://github.com/PaulLeCam/react-leaflet/issues/45
let MapCanvas: any;
MapCanvas = dynamic(
  () =>
    import("@/components/MapCanvas").then((module: any) => module.MapCanvas),
  {
    ssr: false,
  }
);

export default function Home() {
  const lgcDeploymentUrl =
    globalThis.window === undefined
      ? ""
      : new URL(window.location.href).searchParams.get("lgcDeploymentUrl") ?? "";
  return (
    <CustomCopilotProvider
      agent="restaurant"
      runtimeUrl={
        process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY == undefined
          ? `/api/copilotkit?lgcDeploymentUrl=${lgcDeploymentUrl}`
          : "https://api.cloud.copilotkit.ai/copilotkit/v1"
      }
      publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}
    >
      <TooltipProvider>
        <RestaurantProvider>
          <main className="h-screen w-screen overflow-hidden relative flex flex-col">
            <MainNavigation />
            <div className="flex-1 relative">
              <div className="absolute inset-0" style={{ zIndex: 0 }}>
                <MapCanvas />
              </div>
              <ToolsManager />
            </div>
          </main>
        </RestaurantProvider>
      </TooltipProvider>
    </CustomCopilotProvider>
  );
}
