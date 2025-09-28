'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FacialRecognitionModal } from './facial-recognition-modal'
import { PlayCircle, PauseCircle, Clock } from 'lucide-react'
import { ptBR } from 'date-fns/locale'

export function ClockWidget() {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeElapsed, setTimeElapsed] = useState(0)

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
    setIsModalOpen(true)
  }

  const handleVerificationSuccess = () => {
    setIsClockedIn(!isClockedIn)
    if (isClockedIn) {
      // If was clocked in, now clocking out
      // You might want to reset timeElapsed here or log it
    } else {
      // If was clocked out, now clocking in
      setTimeElapsed(0)
    }
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
        <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="text-6xl font-bold font-mono tracking-wider">
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
