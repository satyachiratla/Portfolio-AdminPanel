import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "../routes";

function App() {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
