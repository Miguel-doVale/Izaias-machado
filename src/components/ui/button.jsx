import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const v = cva('inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide cursor-pointer select-none', {
  variants: { variant: { flat: 'btn-flat', glass: 'btn-glass', line: 'btn-line' } }, defaultVariants: { variant: 'flat' } })
export function Button({ className, variant, as: C = 'a', ...p }) { return <C className={cn(v({ variant }), className)} {...p} /> }
