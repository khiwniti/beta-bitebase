import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../restaurant-setup/components/ui/dialog";
import { useTrips } from "../restaurant-setup/lib/hooks/use-trips";
import { Place } from "../restaurant-setup/lib/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { PlaceForm } from "../restaurant-setup/PlaceForm";
import { DropdownMenuItem } from "../restaurant-setup/components/ui/dropdown-menu";

interface EditPlaceProps {
  place: Place;
  onOpenChange?: (open: boolean) => void;
}

export function EditPlace({ place, onOpenChange }: EditPlaceProps) {
  const { selectedTrip, updatePlace } = useTrips();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!selectedTrip) return null;

  const handleEditPlace = (place: Place) => {
    updatePlace(selectedTrip.id, place.id, place);
    
    setDialogOpen(false);
    onOpenChange?.(false);
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setDialogOpen(true);
        }}
      >
        <Pencil className="w-4 h-4 mr-2" />
        Edit
      </DropdownMenuItem>

      <Dialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            onOpenChange?.(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Place
            </DialogTitle>
          </DialogHeader>
          <PlaceForm 
            place={place}
            onSubmit={handleEditPlace}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
