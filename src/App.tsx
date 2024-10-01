import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { JobProvider } from "./services/JobProvider";

function App() {
  return (
    <>
      <JobProvider>
        <RouterProvider router={router}></RouterProvider>
      </JobProvider>
    </>
  );
}

export default App;
