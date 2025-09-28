'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, PauseCircle, Clock, MapPin, Loader2, CheckCircle, Video, VideoOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ClockConfirmationDialog } from './clock-confirmation-dialog'
import { useRouter } from 'next/navigation'

export type ClockEvent = {
  time: string;
  type: 'Entrada' | 'Saída';
  location?: string;
};

interface ClockWidgetProps {
  onClockEvent: (event: ClockEvent) => void;
}

type VerificationStatus = 'idle' | 'scanning' | 'verifying' | 'success';

export function ClockWidget({ onClockEvent }: ClockWidgetProps) {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const getPermissions = async () => {
      // Get Location
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position.coords),
        () => {
          toast({
            variant: "destructive",
            title: "Acesso à Localização Negado",
            description: "A localização é recomendada para um registro preciso.",
          });
        }
      );
      
      // Get Camera
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
      }
    };
    
    getPermissions();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isClockedIn) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1)
      }, 1000)
    } else if (!isClockedIn && timeElapsed !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isClockedIn, timeElapsed])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatElapsedTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const handleVerificationSuccess = () => {
    const newStatus = !isClockedIn
    setIsClockedIn(newStatus)

    const eventType = newStatus ? 'Entrada' : 'Saída'
    
    const newEvent: ClockEvent = {
      time: formatTime(new Date()),
      type: eventType,
      location: location
        ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
        : "N/A",
    };
    
    onClockEvent(newEvent);

    if (newStatus) { // Clocking in
      setTimeElapsed(0)
    }

    setIsConfirmationDialogOpen(true);
  }

  const handleClockAction = () => {
    if (hasCameraPermission) {
        setStatus('verifying');
        // Simulate a verification process
        setTimeout(() => {
            setStatus('success');
            handleVerificationSuccess();
            // Reset to scanning after a while - this will be quick before dialog
            setTimeout(() => setStatus('scanning'), 200);
        }, 2000);
    } else {
        toast({
            variant: "destructive",
            title: "Câmera não disponível",
            description: "Não é possível registrar o ponto sem acesso à câmera.",
        });
    }
  }

  const handleLogout = () => {
    setIsConfirmationDialogOpen(false);
    router.push('/');
  };
  
  const renderCameraContent = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          <p className="mt-2 text-muted-foreground">Iniciando câmera...</p>
        </div>
      );
    }
    if (hasCameraPermission === false) {
       return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/90 text-destructive-foreground z-10 p-4">
          <VideoOff className="w-12 h-12" />
          <p className="mt-2 font-semibold text-center">Acesso à câmera negado</p>
          <p className="text-sm text-center">Por favor, habilite a permissão nas configurações do seu navegador.</p>
        </div>
      );
    }

    switch(status) {
        case 'verifying':
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="mt-4 text-lg font-semibold">Verificando...</p>
                </div>
            )
        case 'success':
             return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/90 text-white z-10">
                    <CheckCircle className="w-16 h-16" />
                    <p className="mt-4 text-lg font-semibold">Ponto Registrado!</p>
                </div>
            )
        case 'scanning':
        default:
            return null; // No overlay when scanning
    }
  }


  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            Reconhecimento de Ponto
          </CardTitle>
          <CardDescription>{formatDate(currentTime)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="w-full max-w-md aspect-video bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden relative">
              {renderCameraContent()}
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          </div>
          <div className="text-5xl font-bold font-mono tracking-wider">
            {formatTime(currentTime)}
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Status: <span className={`font-semibold ${isClockedIn ? 'text-green-500' : 'text-red-500'}`}>{isClockedIn ? 'Entrada Registrada' : 'Saída Registrada'}</span>
            </p>
            {isClockedIn && (
              <p className="text-muted-foreground">
                Tempo Decorrido: <span className="font-semibold">{formatElapsedTime(timeElapsed)}</span>
              </p>
            )}
            {location && (
              <p className="text-muted-foreground text-xs flex items-center gap-1 mt-2">
                <MapPin className="h-3 w-3" />
                {`Localização: ${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
              </p>
            )}
          </div>
          <Button
            size="lg"
            className={`w-48 transition-all duration-300 ${isClockedIn ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground'}`}
            onClick={handleClockAction}
            disabled={status === 'verifying' || status === 'success' || hasCameraPermission !== true}
          >
            {isClockedIn ? <PauseCircle className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />}
            {isClockedIn ? 'Registrar Saída' : 'Registrar Entrada'}
          </Button>
        </CardContent>
      </Card>
      <ClockConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  )
}
