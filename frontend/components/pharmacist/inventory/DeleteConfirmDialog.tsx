"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If > 1 show "X items" in message, otherwise show drugName */
  count?: number;
  drugName?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  count = 1,
  drugName,
  onConfirm,
  isLoading = false,
}: Props) {
  const isBulk = count > 1;
  const subject = isBulk ? `${count} inventory items` : (drugName ?? "this item");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-gray-900">
              {isBulk ? "Delete Items" : "Delete Item"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-gray-700">{subject}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            id="delete-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            id="delete-confirm-btn"
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
