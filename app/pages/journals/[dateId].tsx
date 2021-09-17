import { Suspense, useState, useEffect } from "react"
import {
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournal from "app/journals/queries/getJournal"
import deleteJournal from "app/journals/mutations/deleteJournal"
import updateJournal from "app/journals/mutations/updateJournal"

import Calendar from "app/core/components/Calendar"
import { JournalForm, FORM_ERROR } from "app/journals/components/JournalForm"
import { Textarea } from "app/journals/components/Textarea"

import { getDurationHHMMSS } from "app/core/utils"
import { countWords } from "app/journals/utils/helper"
import {
  convertDashDelimitedYYYYMMDDToUnixEpoch,
  // dateInPast,
} from "app/core/utils"

const WORD_COUNT = 750

export const Journal = () => {
  const router = useRouter()
  const dateId = useParam("dateId", "string")

  const [updateJournalMutation] = useMutation(updateJournal)
  const [deleteJournalMutation] = useMutation(deleteJournal)
  const [journal] = useQuery(getJournal, { dateId: dateId })

  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  let initialMonth: number = 0,
    initialYear: number = 1970

  if (dateId) {
    initialMonth = parseInt(dateId.split("-")[1] as string) // if 08, we want 8
    initialYear = parseInt(dateId.split("-")[0] as string)
  }

  const [startTime, setStartTime] = useState<Date | null>(null)
  const [completedTime, setCompletedTime] = useState<Date | null>(null)

  const [isReadOnly, setIsReadOnly] = useState(true)
  const clientOffsetSeconds = new Date().getTimezoneOffset() * 60

  // useEffect(() => {
  //   if (dateId) {
  //     if (
  //       dateInPast(new Date(convertDashDelimitedYYYYMMDDToUnixEpoch(dateId)))
  //     ) {
  //       setIsReadOnly(true)
  //     } else {
  //       setIsReadOnly(false)
  //     }
  //   }
  // }, [dateId])

  useEffect(() => {
    setContent(journal.content)
  }, [journal.content])

  useEffect(() => {
    setWordCount(countWords(content))
  }, [content])

  useEffect(() => {
    const handleSetCompletedTime = () => {
      if (wordCount === WORD_COUNT) {
        setCompletedTime(new Date())
      }
    }
    const handleCompleted = () => {
      if (wordCount >= WORD_COUNT) {
        setCompleted(true)
      } else {
        if (!completed) {
          setCompleted(false)
        }
      }
    }
    handleSetCompletedTime()
    handleCompleted()
  }, [wordCount, completed])

  useEffect(() => {
    if (content.length === 1) {
      setStartTime(new Date())
    }
  }, [content])

  return (
    <>
      <Calendar initialMonth={initialMonth} initialYear={initialYear} />
      <p
        style={{
          color: "rgb(77, 181, 89)",
          fontWeight: "bold",
          fontSize: 24,
          fontFamily: "Menlo",
        }}
      >
        {dateId &&
          new Date(
            convertDashDelimitedYYYYMMDDToUnixEpoch(dateId)
          ).toDateString()}
      </p>
      <Textarea
        readOnly={isReadOnly}
        initialData={content}
        handleChange={(e) => setContent(e)}
      />
      <div>{wordCount} words</div>
      <div>
        duration:
        {journal.completedTime
          ? getDurationHHMMSS(journal.completedTime, journal.startTime)
          : "00:00:00"}
      </div>
      <br />
      <button
        onClick={async () => {
          try {
            // if (window.confirm("This will be saved. Continue?")) {
            await updateJournalMutation({
              id: journal.id,
              content: content,
              wordCount: wordCount,
              dateId: journal.dateId,
              completed: completed,
              ...(startTime ? { startTime: startTime } : {}),
              ...(completedTime ? { completedTime: completedTime } : {}),
              // clientOffsetSeconds: clientOffsetSeconds,
            })
            // }
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      >
        Save
      </button>{" "}
      <button
        onClick={async () => {
          if (window.confirm("This will be deleted. Continue?")) {
            await deleteJournalMutation({ id: journal.id })
            router.push(Routes.JournalsPage())
          }
        }}
      >
        Delete
      </button>
    </>
  )
}

const ShowJournalPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Journal />
      </Suspense>
      <p>
        <Link href={Routes.JournalsPage()}>
          <a>Journals</a>
        </Link>
      </p>
    </>
  )
}

ShowJournalPage.authenticate = true
ShowJournalPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowJournalPage
