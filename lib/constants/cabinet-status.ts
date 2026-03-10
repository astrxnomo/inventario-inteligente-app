export const STATUS_CONFIG = {
  available: {
    label: "Disponible",
    badgeClass: "bg-primary/5 text-primary border-primary/20",
    dotClass: "bg-primary",
    cardGlow: "hover:shadow-md",
    borderClass: "hover:border-primary/30",
  },
  in_use: {
    label: "En uso",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    cardGlow: "hover:shadow-md",
    borderClass: "hover:border-amber-300",
  },
  locked: {
    label: "Bloqueado",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
    cardGlow: "hover:shadow-md",
    borderClass: "hover:border-red-200",
  },
} as const

export type CabinetStatus = keyof typeof STATUS_CONFIG
