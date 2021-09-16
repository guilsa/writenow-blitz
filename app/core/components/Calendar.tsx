import { useQuery, useRouter, Routes, Link } from "blitz"
import getJournalCompletedDays from "app/journals/queries/getJournalCompletedDays"

import { convertDashDelimitedYYYYMMDDToUnixEpoch } from "../utils"

const Calendar = () => {
  const [userCompletedDays] = useQuery(getJournalCompletedDays, null)
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  const emptyCalendar: RawCal[] = utils().generateMonthlyCalendar(month, year)
  const filledCalendar: Cal[] = utils().mergeObjs(
    emptyCalendar,
    userCompletedDays
  )

  return (
    <>
      <div style={{ width: "100%", display: "inline-block" }}>
        {filledCalendar?.map((data, idx) => (
          <Grid
            key={idx}
            completed={data.completed}
            dateId={data.date}
            tooltip={new Date(
              convertDashDelimitedYYYYMMDDToUnixEpoch(data.date)
            ).toDateString()}
          />
        ))}
      </div>
    </>
  )
}

type GridProps = {
  completed: boolean
  tooltip: string
  dateId: string
}

const Grid = ({ completed, tooltip, dateId }: GridProps) => {
  const router = useRouter()

  return (
    <>
      <Link href={Routes.ShowJournalPage({ dateId: dateId })}>
        <a
          title={tooltip}
          style={{
            cursor: "pointer",
            width: 15,
            height: 25,
            borderColor: "#35973f",
            backgroundColor: completed ? "#35973f" : "auto",
            borderWidth: 2,
            borderStyle: "solid",
            marginRight: 2,
            display: "inline-block",
          }}
        ></a>
      </Link>
    </>
  )
}

interface RawCal {
  date: string
}

interface Cal extends RawCal {
  completed: boolean
}

const utils = () => {
  const _getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate()
  }

  const generateMonthlyCalendar = (month: number, year: number): RawCal[] => {
    const result: RawCal[] = []
    const daysInMonth = _getDaysInMonth(month, year)
    const format = (s: number) => (s < 10 ? "0" + s : s)
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({ date: `${year}-${format(month)}-${format(i)}` })
    }
    return result
  }

  const mergeObjs = (calendar: RawCal[], userCompletedDays): Cal[] => {
    return calendar.map((i) =>
      userCompletedDays.includes(i.date)
        ? { date: i.date, completed: true }
        : { date: i.date, completed: false }
    )
  }

  return {
    generateMonthlyCalendar,
    mergeObjs,
  }
}

export default Calendar
