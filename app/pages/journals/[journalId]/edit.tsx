import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournal from "app/journals/queries/getJournal"
import updateJournal from "app/journals/mutations/updateJournal"
import { JournalForm, FORM_ERROR } from "app/journals/components/JournalForm"

export const EditJournal = () => {
  const router = useRouter()
  const journalId = useParam("journalId", "number")
  const [journal, { setQueryData }] = useQuery(
    getJournal,
    { id: journalId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateJournalMutation] = useMutation(updateJournal)

  return (
    <>
      <Head>
        <title>Edit Journal {journal.id}</title>
      </Head>

      <div>
        <h1>Edit Journal {journal.id}</h1>
        <pre>{JSON.stringify(journal, null, 2)}</pre>

        <JournalForm
          submitText="Update Journal"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateJournal}
          initialValues={journal}
          onSubmit={async (values) => {
            try {
              const updated = await updateJournalMutation({
                id: journal.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowJournalPage({ journalId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditJournalPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditJournal />
      </Suspense>

      <p>
        <Link href={Routes.JournalsPage()}>
          <a>Journals</a>
        </Link>
      </p>
    </div>
  )
}

EditJournalPage.authenticate = true
EditJournalPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditJournalPage
