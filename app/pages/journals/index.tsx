import { Suspense } from "react"
import {
  Head,
  Link,
  usePaginatedQuery,
  useRouter,
  BlitzPage,
  Routes,
  useMutation,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getJournals from "app/journals/queries/getJournals"

import { FORM_ERROR } from "app/core/components/Form"
import createJournal from "app/journals/mutations/createJournal"

const ITEMS_PER_PAGE = 100

export const JournalsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ journals, hasMore }] = usePaginatedQuery(getJournals, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {journals.map((journal) => (
          <li key={journal.dateId}>
            <Link href={Routes.ShowJournalPage({ dateId: journal.dateId })}>
              <a>{journal.content}</a>
            </Link>
          </li>
        ))}
      </ul>

      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </div>
  )
}

const JournalsPage: BlitzPage = () => {
  const router = useRouter()
  const [createJournalMutation] = useMutation(createJournal)

  const dateId = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <p>
        <button
          onClick={async () => {
            try {
              const journal = await createJournalMutation({
                content: "",
                wordCount: 0,
                dateId: dateId,
              })
              router.push(Routes.ShowJournalPage({ dateId: journal.dateId }))
            } catch (error) {
              if (error.code === "P2002") {
                console.warn("Post already exists, fowarding...")
                router.push(Routes.ShowJournalPage({ dateId: dateId }))
              }
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        >
          Create New Journal
        </button>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <JournalsList />
      </Suspense>
    </div>
  )
}

JournalsPage.authenticate = true
JournalsPage.getLayout = (page) => <Layout>{page}</Layout>

export default JournalsPage
