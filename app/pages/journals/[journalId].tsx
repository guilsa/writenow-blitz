import { Suspense, useState } from "react"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournal from "app/journals/queries/getJournal"
import deleteJournal from "app/journals/mutations/deleteJournal"
import updateJournal from "app/journals/mutations/updateJournal"

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
    <div className="container">
      <main>
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
            if (window.confirm("This will be saved. Continue?")) {
              await updateJournalMutation({ id: journal.id, content: content })
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
        <div className="buttons" style={{ marginTop: "1rem", marginBottom: "1rem" }}></div>
      </main>
    </div>
  )
}

const ShowJournalPage: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Journal />
        </Suspense>
        <p>
          <Link href={Routes.JournalsPage()}>
            <a>Journals</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

ShowJournalPage.authenticate = true
ShowJournalPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowJournalPage
