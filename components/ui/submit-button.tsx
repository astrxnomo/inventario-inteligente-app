"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  children: React.ReactNode
  pendingText: string
}

export function SubmitButton({ children, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  )
}
