"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToastContext } from "@/components/providers/ToastProvider"
import { MapPin, Navigation, Square } from "lucide-react"

interface GPSDistanceCaptureProps {
  onDistanceCaptured: (distance: number) => void
  onClose?: () => void
}

interface Position {
  lat: number
  lng: number
  timestamp: number
}

export function GPSDistanceCapture({ onDistanceCaptured, onClose }: GPSDistanceCaptureProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [distance, setDistance] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const positionsRef = useRef<Position[]>([])
  const watchIdRef = useRef<number | null>(null)
  const { success, error: showError } = useToastContext()

  // Função para calcular distância entre duas coordenadas (Haversine)
  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
    const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador")
      showError("Geolocalização não é suportada")
      return
    }

    setIsTracking(true)
    setDistance(0)
    positionsRef.current = []
    setError(null)

    // Obter posição inicial
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        }
        positionsRef.current = [pos]
        setCurrentPosition(pos)
      },
      (err) => {
        setError(`Erro ao obter localização: ${err.message}`)
        showError(`Erro ao obter localização: ${err.message}`)
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    // Iniciar rastreamento contínuo
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPos: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        }

        if (positionsRef.current.length > 0) {
          const lastPos = positionsRef.current[positionsRef.current.length - 1]
          const segmentDistance = calculateDistance(lastPos, newPos)
          
          // Filtrar movimentos muito pequenos (ruído do GPS)
          if (segmentDistance > 0.01) {
            // Apenas adicionar se a distância for significativa (> 10m)
            positionsRef.current.push(newPos)
            setDistance((prev) => prev + segmentDistance)
          }
        } else {
          positionsRef.current.push(newPos)
        }

        setCurrentPosition(newPos)
      },
      (err) => {
        setError(`Erro no rastreamento: ${err.message}`)
        showError(`Erro no rastreamento: ${err.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }

  const resetTracking = () => {
    stopTracking()
    setDistance(0)
    positionsRef.current = []
    setCurrentPosition(null)
  }

  const useDistance = () => {
    if (distance > 0) {
      onDistanceCaptured(Number(distance.toFixed(2)))
      resetTracking()
      if (onClose) {
        onClose()
      }
    }
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Captura de Distância via GPS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {distance.toFixed(2)} km
          </div>
          <p className="text-sm text-muted-foreground">
            Distância percorrida
          </p>
        </div>

        {currentPosition && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <MapPin className="inline h-3 w-3 mr-1" />
              Lat: {currentPosition.lat.toFixed(6)}
            </p>
            <p>
              <MapPin className="inline h-3 w-3 mr-1" />
              Lng: {currentPosition.lng.toFixed(6)}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!isTracking ? (
            <Button onClick={startTracking} className="flex-1">
              <Navigation className="mr-2 h-4 w-4" />
              Iniciar Rastreamento
            </Button>
          ) : (
            <>
              <Button onClick={stopTracking} variant="destructive" className="flex-1">
                <Square className="mr-2 h-4 w-4" />
                Parar
              </Button>
              <Button onClick={resetTracking} variant="outline">
                Resetar
              </Button>
            </>
          )}
        </div>

        {distance > 0 && (
          <Button onClick={useDistance} className="w-full" variant="default">
            Usar Distância Capturada
          </Button>
        )}

        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Cancelar
          </Button>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 Dica: Mantenha o GPS ativo e o dispositivo em movimento para melhor precisão.</p>
          <p>⚠️ A precisão pode variar dependendo das condições do GPS.</p>
        </div>
      </CardContent>
    </Card>
  )
}




