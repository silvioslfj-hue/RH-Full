'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface FacialRecognitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  action: 'Entrada' | 'Saída'
}

type VerificationStatus = 'idle' | 'scanning' | 'success' | 'failed' | 'verifying';

export function FacialRecognitionModal({ isOpen, onClose, onSuccess, action }: FacialRecognitionModalProps) {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStatus('scanning');
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Acesso à Câmera Negado',
            description: 'Por favor, habilite a permissão da câmera no seu navegador.',
          });
          onClose(); // Close modal if no permission
        }
      };
      getCameraPermission();
    } else {
      // Stop camera stream when modal is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setTimeout(() => {
        setStatus('idle');
        setHasCameraPermission(null);
      }, 300);
    }
  }, [isOpen, onClose, toast]);

  useEffect(() => {
    if (status === 'success') {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } else if (status === 'failed') {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [status, onClose, onSuccess]);

  const handleVerification = () => {
    setStatus('verifying');
    // Simulate a verification process
    setTimeout(() => {
        // For demo purposes, we'll just assume success
        setStatus('success');
    }, 2000);
  }

  const renderContent = () => {
    switch (status) {
      case 'scanning':
        return (
          <div className='space-y-4'>
            <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            </div>
             {!hasCameraPermission && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Câmera não detectada</AlertTitle>
                  <AlertDescription>
                    Não foi possível acessar sua câmera. Verifique as permissões.
                  </AlertDescription>
                </Alert>
             )}
            <Button onClick={handleVerification} disabled={!hasCameraPermission} className="w-full">
              Verificar Identidade
            </Button>
          </div>
        );
      case 'verifying':
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-64">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-lg font-semibold">Verificando...</p>
          </div>
        )
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center gap-4 h-64">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <p className="text-lg font-semibold">Verificação Bem-sucedida</p>
            <p className="text-sm text-muted-foreground">O registro de ponto foi salvo.</p>
          </div>
        )
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center gap-4 h-64">
            <XCircle className="w-24 h-24 text-destructive" />
            <p className="text-lg font-semibold">Verificação Falhou</p>
            <p className="text-sm text-muted-foreground">Não foi possível confirmar sua identidade.</p>
          </div>
        )
      default:
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-64">
                <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Iniciando câmera...</p>
            </div>
        );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reconhecimento Facial</DialogTitle>
          <DialogDescription>
            Posicione seu rosto na câmera para registrar a {action}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
