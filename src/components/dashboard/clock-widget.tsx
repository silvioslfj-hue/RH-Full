'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FacialRecognitionModal } from './facial-recognition-modal'
import { PlayCircle, PauseCircle, Clock, MapPin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export type ClockEvent = {
  time: string;
  type: 'Entrada' | 'Saída';
  location?: string;
};

interface ClockWidgetProps {
  onClockEvent: (event: ClockEvent) => void;
}

export function ClockWidget({ onClockEvent }: ClockWidgetProps) {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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

  const handleClockAction = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setIsModalOpen(true);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          variant: "destructive",
          title: "Acesso à Localização Negado",
          description: "Por favor, habilite o acesso à localização para registrar o ponto.",
        });
        // Optionally, you can still open the modal even if location fails
        // setIsModalOpen(true); 
      }
    );
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
    // If clocking out, timeElapsed just stops.
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Relógio de Ponto
          </CardTitle>
          <CardDescription>{formatDate(currentTime)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 py-12">
          <div className="text-7xl font-bold font-mono tracking-wider">
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
          >
            {isClockedIn ? <PauseCircle className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />}
            {isClockedIn ? 'Registrar Saída' : 'Registrar Entrada'}
          </Button>
        </CardContent>
      </Card>
      <FacialRecognitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleVerificationSuccess}
        action={isClockedIn ? 'Saída' : 'Entrada'}
      />
    </>
  )
}
