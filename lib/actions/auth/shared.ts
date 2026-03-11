export type AuthState = {
  fieldErrors?: {
    email?: string
    password?: string
    confirm?: string
  }
  error?: string | null
  success?: boolean
  /** Email shown on the post-submit confirmation screens */
  successEmail?: string
}

export function collectFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): NonNullable<AuthState["fieldErrors"]> {
  const fieldErrors: NonNullable<AuthState["fieldErrors"]> = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === "string") {
      const field = key as keyof NonNullable<AuthState["fieldErrors"]>
      if (!fieldErrors[field]) fieldErrors[field] = issue.message
    }
  }
  return fieldErrors
}
