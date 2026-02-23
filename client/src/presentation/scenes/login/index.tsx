import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useSignupMutation } from "@/data/api/api";
import { setLogin } from "@/data/state/authSlice";
import DashboardBox from "@/presentation/components/DashboardBox";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const loggedInResponse = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        dispatch(setLogin(loggedInResponse));
        navigate("/");
      } else {
        await signup(formData).unwrap();
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardBox
          width="400px"
          p="2rem"
          borderRadius="1.5rem"
        >
        <Typography
          variant="h2"
          textAlign="center"
          mb="1.5rem"
          sx={{
            background: (palette as any).background.neon,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              sx={{ input: { color: palette.grey[300] } }}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ input: { color: palette.grey[300] } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            sx={{ input: { color: palette.grey[300] } }}
          />
          <Button
            fullWidth
            type="submit"
            sx={{
              mt: "2rem",
              background: (palette as any).background.neon,
              color: palette.grey[900],
              fontWeight: "900",
              p: "0.75rem",
              borderRadius: "0.5rem",
              "&:hover": {
                filter: "brightness(1.1)",
              },
            }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Typography
          mt="1rem"
          textAlign="center"
          sx={{ cursor: "pointer", color: palette.primary[500] }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign up here."
            : "Already have an account? Login here."}
        </Typography>
        </DashboardBox>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
