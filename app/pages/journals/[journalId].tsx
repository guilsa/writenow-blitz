import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournal from "app/journals/queries/getJournal"
import deleteJournal from "app/journals/mutations/deleteJournal"

export const Journal = () => {
  const router = useRouter()
  const journalId = useParam("journalId", "number")
  const [deleteJournalMutation] = useMutation(deleteJournal)
  const [journal] = useQuery(getJournal, { id: journalId })

  return (
    <>
      <Head>
        <title>Journal {journal.id}</title>
      </Head>

      <div>
        <h1>Journal {journal.id}</h1>
        <pre>{JSON.stringify(journal, null, 2)}</pre>

        <Link href={Routes.EditJournalPage({ journalId: journal.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteJournalMutation({ id: journal.id })
              router.push(Routes.JournalsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowJournalPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.JournalsPage()}>
          <a>Journals</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Journal />
      </Suspense>
    </div>
  )
}

ShowJournalPage.authenticate = true
ShowJournalPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowJournalPage
