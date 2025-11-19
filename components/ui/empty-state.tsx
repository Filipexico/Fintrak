import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button onClick={action.onClick}>{action.label}</Button>
        )}
      </CardContent>
    </Card>
  )
}




