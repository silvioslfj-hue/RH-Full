'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Camera, CheckCircle, XCircle } from 'lucide-react'

interface FacialRecognitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  action: 'Entrada' | 'Saída'
}

type VerificationStatus = 'idle' | 'scanning' | 'success' | 'failed'

export function FacialRecognitionModal({ isOpen, onClose, onSuccess, action }: FacialRecognitionModalProps) {
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning')
      setProgress(0)
    } else {
      // Reset on close
      setTimeout(() => {
        setStatus('idle')
        setProgress(0)
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (status === 'scanning') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            // Simulate success for demo
            setStatus('success')
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(timer)
    }
  }, [status])

  useEffect(() => {
    if (status === 'success') {
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1000)
    } else if (status === 'failed') {
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }, [status, onClose, onSuccess])

  const renderContent = () => {
    switch (status) {
      case 'scanning':
        return (
          <>
            <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center">
              <Camera className="w-24 h-24 text-slate-600" />
            </div>
            <Progress value={progress} className="w-full mt-4" />
            <p className="text-center text-sm text-muted-foreground mt-2">Verificando...</p>
          </>
        )
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center gap-4 h-64">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <p className="text-lg font-semibold">Verificação Bem-sucedida</p>
          </div>
        )
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center gap-4 h-64">
            <XCircle className="w-24 h-24 text-destructive" />
            <p className="text-lg font-semibold">Verificação Falhou</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reconhecimento Facial</DialogTitle>
          <DialogDescription>
            Posicione seu rosto no centro para verificar sua identidade para a {action}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
