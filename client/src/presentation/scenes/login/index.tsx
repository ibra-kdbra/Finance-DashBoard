import { Box, Button, TextField, Typography, useTheme, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLoginMutation } from "@/data/api/api";
import { setLogin } from "@/data/state/authSlice";
import { motion } from "framer-motion";
import { 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  FingerprintOutlined
} from "@mui/icons-material";
import { styled } from "@mui/system";

const GlassCard = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(30, 31, 38, 0.75)", /* Lightened from 20, 21, 27 */
  backdropFilter: "blur(60px)",
  borderRadius: "3rem",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 60px 120px -30px rgba(0, 0, 0, 0.5)",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: "480px",
  padding: "4.5rem 3.5rem",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, transparent, ${(theme.palette as any).primary[400]}, transparent)`,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "0.5rem",
  "& .MuiOutlinedInput-root": {
    color: theme.palette.grey[100],
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "1rem",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.08)",
      borderWidth: "1.5px",
      transition: "all 0.3s ease",
    },
    "&:hover fieldset": {
      borderColor: "rgba(129, 140, 248, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme.palette as any).primary[500],
      boxShadow: `0 0 12px rgba(129, 140, 248, 0.2)`,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.grey[500],
    fontSize: "0.9rem",
    fontWeight: 500,
    "&.Mui-focused": {
      color: (theme.palette as any).primary[400],
    },
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: theme.palette.grey[500],
    fontSize: "1.2rem",
  },
  "& input::placeholder": {
    color: theme.palette.grey[600],
    opacity: 1,
    fontSize: "0.9rem",
  },
}));

const LoginPage = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const loggedInResponse = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      console.log("Login Success:", loggedInResponse);
      dispatch(setLogin(loggedInResponse));
      navigate("/");
    } catch (err: any) {
      console.error("Login Error Details:", err);
      // Catch network errors, 401s, etc.
      const msg = err.data?.msg || err.data?.error || "Connection refused. Is the server running?";
      setErrorMsg(msg);
    }
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#13141a"
    >
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <GlassCard>
            <Box textAlign="center" mb="3rem">
              <Box 
                display="inline-flex" 
                p="1.2rem" 
                borderRadius="2rem" 
                bgcolor="rgba(255, 255, 255, 0.03)" 
                mb="2rem"
                border="1px solid rgba(255, 255, 255, 0.05)"
              >
                <FingerprintOutlined sx={{ fontSize: 48, color: (palette as any).primary[500] }} />
              </Box>
              <Typography
                variant="h1"
                fontWeight="900"
                sx={{
                  background: `linear-gradient(180deg, #fff 0%, ${palette.grey[400]} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-2px",
                  mb: "0.5rem"
                }}
              >
                Access Portal
              </Typography>
              <Typography variant="body1" color={palette.grey[400]}>
                Secure authentication for FinTech Enterprise dashboard.
              </Typography>
            </Box>

            {(errorMsg || (location.state as any)?.message) && (
              <Box 
                bgcolor={errorMsg ? "rgba(244, 67, 54, 0.1)" : "rgba(46, 213, 115, 0.1)"}
                p="1rem"
                borderRadius="1rem"
                mb="1.5rem"
                border={`1px solid ${errorMsg ? "rgba(244, 67, 54, 0.2)" : "rgba(46, 213, 115, 0.2)"}`}
              >
                <Typography color={errorMsg ? "error" : "primary"} textAlign="center" fontWeight="600" fontSize="0.9rem">
                  {errorMsg || (location.state as any)?.message}
                </Typography>
              </Box>
            )}

            <form onSubmit={handleFormSubmit}>
              <StyledTextField
                fullWidth
                label="Identifier / Email"
                margin="normal"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Access Code"
                type={showPassword ? "text" : "password"}
                margin="normal"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                type="submit"
                disabled={isLoading}
                sx={{
                  mt: "3rem",
                  py: "1.25rem",
                  borderRadius: "1.25rem",
                  background: (palette as any).primary[500],
                  color: "#000",
                  fontWeight: "900",
                  fontSize: "1rem",
                  boxShadow: `0 15px 30px -10px rgba(${(palette as any).primary[500]}, 0.3)`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 40px -12px rgba(${(palette as any).primary[500]}, 0.4)`,
                    background: (palette as any).primary[400],
                  },
                }}
              >
                {isLoading ? "Authenticating..." : "Authorize Access"}
              </Button>
            </form>

            <Box mt="2.5rem" textAlign="center">
              <Typography variant="body2" color={palette.grey[500]}>
                Unregistered official?{" "}
                <Link
                  to="/signup"
                  style={{ 
                    color: (palette as any).primary[500], 
                    textDecoration: "none",
                    fontWeight: "700",
                    marginLeft: "6px"
                  }}
                >
                  Request account
                </Link>
              </Typography>
            </Box>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
