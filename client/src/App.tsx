import { Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "@/presentation/theme/theme";
import Navbar from "@/presentation/scenes/navbar";
import Dashboard from "@/presentation/scenes/dashboard";
import Predictions from "@/presentation/scenes/predictions";
import LoginPage from "@/presentation/scenes/login";
import DataSettings from "@/presentation/scenes/dataSettings";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  const isAuth = Boolean(useSelector((state: any) => state.auth.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/predictions"
                element={isAuth ? <Predictions /> : <Navigate to="/login" />}
              />
              <Route
                path="/data"
                element={isAuth ? <DataSettings /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
