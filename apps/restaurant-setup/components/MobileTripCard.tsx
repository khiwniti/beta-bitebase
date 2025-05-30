import { useMediaQuery } from "../restaurant-setup/lib/hooks/use-media-query";
import { useTrips } from "../restaurant-setup/lib/hooks/use-trips";
import { cn } from "../restaurant-setup/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "../restaurant-setup/ui/drawer";
import { Button } from "../restaurant-setup/ui/button";
import { Plane } from "lucide-react";
import { CardTitle } from "../restaurant-setup/ui/card";
import { TripSelect } from "../restaurant-setup/TripSelect";
import { TripContent } from "../restaurant-setup/TripContent";
import { ScrollArea } from "../restaurant-setup/ui/scroll-area";
import { Map } from "leaflet";

export type MobileTripCardProps = { 
  className?: string;
  map?: Map;
}

export function MobileTripCard({ className, map }: MobileTripCardProps) {
  const { selectedTrip } = useTrips();

  if (selectedTrip && map) {
    map.setView([selectedTrip.center_latitude, selectedTrip.center_longitude], selectedTrip.zoom_level || 13);
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className={cn(className, "absolute bottom-20 right-4 w-14 h-14 rounded-full")}>
          <Plane className="w-6 h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border-none bg-foreground max-h-[75vh] flex flex-col">
        <div className="flex flex-row justify-between items-center gap-2 text-white p-4">
          <CardTitle className="text-wrap truncate max-w-full font-bold">{selectedTrip?.name || "Untitled Trip"}</CardTitle>
          <TripSelect />
        </div>
        <div className="h-full overflow-y-auto p-4 bg-background">
          {selectedTrip && <>
            <div className="h-2" />
            <TripContent map={map} trip={selectedTrip} />
          </>}
        </div>
      </DrawerContent>
    </Drawer>
  );
}