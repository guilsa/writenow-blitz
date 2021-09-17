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

import { countWords } from "app/journals/utils/helper"
import {
  convertDashDelimitedYYYYMMDDToUnixEpoch,
  // dateInPast,
} from "app/core/utils"

const WORD_COUNT = 10

export const Journal = () => {
  const router = useRouter()
  const dateId = useParam("dateId", "string")

  const [updateJournalMutation] = useMutation(updateJournal)
  const [deleteJournalMutation] = useMutation(deleteJournal)
  const [journal] = useQuery(getJournal, { dateId: dateId })

  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  const [startTime, setStartTime] = useState(new Date())
  const [completedTime, setCompletedTime] = useState(new Date())

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

  console.log("start", startTime)
  console.log("stop", completedTime)

  return (
    <>
      <Calendar />
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
              startTime: startTime,
              completedTime: completedTime,
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
