"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-4 shadow-lg",
        styles[toast.type]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = "info", duration?: number) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, duration?: number) => showToast(message, "success", duration),
    error: (message: string, duration?: number) => showToast(message, "error", duration),
    info: (message: string, duration?: number) => showToast(message, "info", duration),
    warning: (message: string, duration?: number) => showToast(message, "warning", duration),
  }
}




