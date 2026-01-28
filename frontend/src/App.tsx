import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Partner } from "./pages/Partner";
import { Account } from "./pages/Account";

function App() {
  return (
    <Routes>
      <Route>
        <Route index element={<Home />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/partner/:partnerId">
          <Route index element={<Partner />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
