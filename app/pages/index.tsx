import { Suspense } from "react"
import { Image, Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/logo.png"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <br />
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Document = () => {
  return (
    <>
      <textarea
        style={{
          fontSize: 16,
          width: "100%",
          height: "600px",
          border: "none",
          outline: 0,
          resize: "none",
          overflow: "hidden",
          // overflowY: "scroll",
        }}
      ></textarea>
    </>
  )
}

const Home = () => {
  const date = new Date()

  return (
    <div className="container">
      <main>
        <p style={{ color: "rgb(77, 181, 89)", fontWeight: "bold", fontSize: 24 }}>
          {date.toDateString()}
        </p>
        <Document />
        <button>Save</button> | <button>New Day</button>
        <div className="buttons" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>
      </main>

      <footer></footer>

      <style jsx global>{`
        body {
          font-family: "Menlo";
        }
        .container {
          display: flex;
          align-content: center;
        }
        main {
          width: 800px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
