const getDateYYYYMMDD = (): string => {
  let now = new Date()
  let todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  )
  return todayUTC.toISOString().slice(0, 10)
}

const hasDatePassed = (oldDate: string): boolean => {
  let now = new Date(getDateYYYYMMDD()).getTime()
  let then = new Date(oldDate).getTime()
  return now - then !== 0
}

export { getDateYYYYMMDD, hasDatePassed }
