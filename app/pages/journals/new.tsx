import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createJournal from "app/journals/mutations/createJournal"
import { JournalForm, FORM_ERROR } from "app/journals/components/JournalForm"

const NewJournalPage: BlitzPage = () => {
  const router = useRouter()
  const [createJournalMutation] = useMutation(createJournal)

  return (
    <div>
      <h1>Create New Journal</h1>

      <JournalForm
        submitText="Create Journal"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateJournal}
        // initialValues={{}}
        onSubmit={async (values) => {
          console.log("values", values)

          try {
            const journal = await createJournalMutation(values)
            router.push(Routes.ShowJournalPage({ journalId: journal.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.JournalsPage()}>
          <a>Journals</a>
        </Link>
      </p>
    </div>
  )
}

NewJournalPage.authenticate = true
NewJournalPage.getLayout = (page) => <Layout title={"Create New Journal"}>{page}</Layout>

export default NewJournalPage
