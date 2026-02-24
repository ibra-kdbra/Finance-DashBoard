import { Box } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { themeSettings } from "@/presentation/theme/theme";
import Navbar from "@/presentation/scenes/navbar";
import Dashboard from "@/presentation/scenes/dashboard";
import Predictions from "@/presentation/scenes/predictions";
import LoginPage from "@/presentation/scenes/login";
import SignupPage from "@/presentation/scenes/signup";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);
  const isAuth = Boolean(useSelector((state: any) => state.auth.token));
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Box 
            className="app-container"
            width="100%" 
            height="100%" 
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            padding={isAuthPage ? "0" : "1rem 2rem 4rem 2rem"}
          >
          {!isAuthPage && <Navbar />}
          <Routes>
            <Route
              path="/"
              element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/predictions"
              element={isAuth ? <Predictions /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
