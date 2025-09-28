
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Video, VideoOff, Loader2, ScanLine } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import html2canvas from "html2canvas";

interface DocumentScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (file: File) => void;
}

export function DocumentScanner({
  isOpen,
  onClose,
  onScan,
}: DocumentScannerProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  useEffect(() => {
    let stream: MediaStream | null = null;

    const getCameraPermission = async () => {
      if (isOpen) {
        setHasCameraPermission(null); // Reset on open
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }, // Prefer back camera
          });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Acesso à Câmera Negado",
            description: "Habilite a permissão da câmera para escanear.",
          });
        }
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when dialog is closed or component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
       if (videoRef.current && videoRef.current.srcObject) {
         const currentStream = videoRef.current.srcObject as MediaStream;
         currentStream.getTracks().forEach(track => track.stop());
         videoRef.current.srcObject = null;
       }
    };
  }, [isOpen, toast]);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
        const video = videoRef.current;
        const canvas = await html2canvas(video, {
            useCORS: true,
            logging: false,
            scale: 2, // Increase resolution for better quality
        });

        canvas.toBlob((blob) => {
            if (blob) {
                const fileName = `scan_${new Date().toISOString()}.png`;
                const file = new File([blob], fileName, { type: "image/png" });
                onScan(file);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Falha na Captura",
                    description: "Não foi possível gerar a imagem.",
                });
            }
            setIsCapturing(false);
        }, "image/png");

    } catch (error) {
        console.error("Error capturing image:", error);
        toast({
            variant: "destructive",
            title: "Erro ao Escanear",
            description: "Ocorreu um problema ao capturar o documento.",
        });
        setIsCapturing(false);
    }
  };

  const renderContent = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Iniciando câmera...</p>
        </div>
      );
    }

    if (hasCameraPermission === false) {
      return (
        <div className="h-64">
           <Alert variant="destructive">
            <VideoOff className="h-4 w-4" />
            <AlertTitle>Câmera Indisponível</AlertTitle>
            <AlertDescription>
                Não foi possível acessar a câmera. Por favor, verifique as permissões no seu navegador e tente novamente.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
        <div className="relative w-full aspect-video bg-background rounded-md overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {isCapturing && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
            )}
             <div className="absolute inset-0 flex items-center justify-center z-0">
                <ScanLine className="w-full h-1/2 text-white/20 animate-pulse" />
             </div>
        </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Escanear Documento</DialogTitle>
          <DialogDescription>
            Posicione o documento dentro da área visível e pressione "Capturar".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {renderContent()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCapturing}>
            Cancelar
          </Button>
          <Button onClick={handleCapture} disabled={hasCameraPermission !== true || isCapturing}>
            {isCapturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            {isCapturing ? "Processando..." : "Capturar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
