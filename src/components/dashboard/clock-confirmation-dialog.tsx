"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ClockConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function ClockConfirmationDialog({ isOpen, onConfirm }: ClockConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ponto Registrado com Sucesso!</AlertDialogTitle>
          <AlertDialogDescription>
            Sua entrada/saída foi registrada. Você será desconectado do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
