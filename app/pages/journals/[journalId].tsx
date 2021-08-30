import { Suspense, useState } from "react"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournal from "app/journals/queries/getJournal"
import deleteJournal from "app/journals/mutations/deleteJournal"
import updateJournal from "app/journals/mutations/updateJournal"

import { JournalForm, FORM_ERROR } from "app/journals/components/JournalForm"

import { Textarea } from "app/journals/components/Textarea"

export const Journal = () => {
  const router = useRouter()
  const journalId = useParam("journalId", "number")
  const [updateJournalMutation] = useMutation(updateJournal)
  const [deleteJournalMutation] = useMutation(deleteJournal)
  const [journal] = useQuery(getJournal, { id: journalId })

  const [content, setContent] = useState("")

  const date = new Date()

  return (
    <>
      <p
        style={{
          color: "rgb(77, 181, 89)",
          fontWeight: "bold",
          fontSize: 24,
          fontFamily: "Menlo",
        }}
      >
        {date.toDateString()}
      </p>
      <Textarea initialData={journal.content} handleChange={(e) => setContent(e)} />
      <button
        onClick={async () => {
          try {
            if (window.confirm("This will be saved. Continue?")) {
              await updateJournalMutation({ id: journal.id, content: content })
            }
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
