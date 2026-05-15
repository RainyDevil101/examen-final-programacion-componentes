declare module 'simple-react-validator' {
  import type { ReactNode } from 'react'

  export interface SimpleReactValidatorOptions {
    autoForceUpdate?: { forceUpdate: () => void }
    locale?: string
    element?: (message: string, className?: string) => ReactNode
    messages?: Record<string, string>
    className?: string
    validators?: Record<
      string,
      {
        message: string
        rule: (val: unknown, params: unknown[], validator: SimpleReactValidator) => boolean
        messageReplace?: (message: string, params: unknown[]) => string
        required?: boolean
      }
    >
  }

  export default class SimpleReactValidator {
    constructor(options?: SimpleReactValidatorOptions)
    message(
      field: string,
      inputValue: unknown,
      rules: string,
      options?: { className?: string; messages?: Record<string, string> },
    ): ReactNode
    allValid(): boolean
    showMessages(): void
    hideMessages(): void
    showMessageFor(field: string): void
    hideMessageFor(field: string): void
    fieldValid(field: string): boolean
    purgeFields(): void
  }
}
