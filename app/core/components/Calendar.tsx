import { useQuery, useRouter, Routes, Link } from "blitz"
import getJournalCompletedDays from "app/journals/queries/getJournalCompletedDays"

import { convertDashDelimitedYYYYMMDDToUnixEpoch } from "../utils"
import { useEffect, useState } from "react"

type CalendarProps = {
  initialMonth: number
  initialYear: number
}

const Calendar = ({
  initialMonth = new Date().getMonth() + 1,
  initialYear = new Date().getFullYear(),
}: CalendarProps) => {
  const [userCompletedDays] = useQuery(getJournalCompletedDays, null)

  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)

  const emptyCalendar: RawCal[] = utils().generateMonthlyCalendar(month, year)
  const filledCalendar: Cal[] = utils().mergeObjs(
    emptyCalendar,
    userCompletedDays
  )

  return (
    <>
      <span
        onClick={() => setMonth(month - 1)}
        style={{ fontSize: 12, cursor: "pointer" }}
      >
        &lt;&lt;{" "}
      </span>
      <div style={{ width: "100%", display: "inline" }}>
        {filledCalendar?.map((data, idx) => (
          <Grid
            key={idx}
            completed={data.completed}
            dateId={data.date}
            userCompletedDays={userCompletedDays}
            tooltip={new Date(
              convertDashDelimitedYYYYMMDDToUnixEpoch(data.date)
            ).toDateString()}
          />
        ))}
      </div>
      <span
        onClick={() => setMonth(month + 1)}
        style={{ fontSize: 12, cursor: "pointer" }}
      >
        {" "}
        &gt;&gt;
      </span>
    </>
  )
}

type GridProps = {
  completed: boolean
  tooltip: string
  dateId: string
  userCompletedDays: Array<string> | null
}

const Grid = ({ completed, tooltip, dateId, userCompletedDays }: GridProps) => {
  const router = useRouter()

  let isValid: boolean = false

  if (userCompletedDays) {
    isValid = userCompletedDays.includes(dateId)
  }

  return (
    <>
      {isValid ? (
        <Link href={Routes.ShowJournalPage({ dateId: dateId })}>
          <a
            title={tooltip}
            style={{
              cursor: "pointer",
              width: 15,
              height: 25,
              borderColor: "#35973f",
              backgroundColor: completed ? "#35973f" : "white",
              borderWidth: 2,
              borderStyle: "solid",
              marginRight: 2,
              display: "inline-block",
            }}
          ></a>
        </Link>
      ) : (
        <a
          title={tooltip}
          style={{
            width: 15,
            height: 25,
            borderColor: "#35973f",
            backgroundColor: completed ? "#35973f" : "white",
            borderWidth: 2,
            borderStyle: "solid",
            marginRight: 2,
            display: "inline-block",
          }}
        ></a>
      )}
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
  const _getDaysInMonth = (month: number, year: number): number => {
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
