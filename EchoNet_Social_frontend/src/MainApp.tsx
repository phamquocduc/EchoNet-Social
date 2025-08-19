import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { Skeleton } from "@mui/material"
import DefaultLayout from "./components/layout/DefaultLayout"
import HeaderOnlyLayout from "./components/layout/HeaderOnlyLayout"

const HomePage = lazy(() => import("./pages/HomePage"))

function MainApp() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultLayout
            Content={
              <Suspense fallback={<Skeleton variant="rectangular" width={600} height={600} />}>
                <HomePage />
              </Suspense>
            }
          />
        }
      />
      <Route
        path="/test"
        element={
          <HeaderOnlyLayout
            Content={
              <Suspense fallback={<Skeleton variant="rectangular" width={600} height={600} />}>
                <HomePage />
              </Suspense>
            }
          />
        }
      />
    </Routes>
  )
}

export default MainApp
