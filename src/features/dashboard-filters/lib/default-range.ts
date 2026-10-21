import { format, subDays } from 'date-fns'

export function getDefaultDateRange(referenceDate = new Date()) {
  return {
    from: format(subDays(referenceDate, 30), 'yyyy-MM-dd'),
    to: format(referenceDate, 'yyyy-MM-dd'),
  }
}
