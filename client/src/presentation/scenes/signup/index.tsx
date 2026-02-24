import { Box, Button, TextField, Typography, useTheme, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "@/data/api/api";
import { motion } from "framer-motion";
import { 
  PersonOutline, 
  EmailOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  SecurityOutlined
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
  maxWidth: "500px",
  padding: "4.5rem 3.5rem",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, transparent, ${(theme.palette as any).primary[400]}, ${(theme.palette as any).primary[600]}, transparent)`,
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

const SignupPage = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [signup, { isLoading }] = useSignupMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signup(formData).unwrap();
      // Redirect to login after successful signup
      navigate("/login", { state: { message: "Account created! Please log in." } });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.data?.error || "Registration failed. Please try again.");
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
         initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
         animate={{ opacity: 1, scale: 1, rotateY: 0 }}
         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard>
            <Box textAlign="center" mb="3rem">
              <Box 
                display="inline-flex" 
                p="1rem" 
                borderRadius="1.5rem" 
                bgcolor="rgba(46, 213, 115, 0.05)" 
                mb="1.5rem"
                border="1px solid rgba(46, 213, 115, 0.1)"
              >
                <SecurityOutlined sx={{ fontSize: 40, color: (palette as any).primary[400] }} />
              </Box>
              <Typography
                variant="h1"
                fontWeight="900"
                sx={{
                  background: `linear-gradient(135deg, #fff 0%, ${(palette as any).primary[400]} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-2px",
                  mb: "0.5rem"
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color={palette.grey[400]}>
                Join the most advanced financial intelligence platform.
              </Typography>
            </Box>

            {errorMsg && (
              <Typography color="error" textAlign="center" mb="1rem" fontWeight="600">
                {errorMsg}
              </Typography>
            )}

            <form onSubmit={handleFormSubmit}>
              <StyledTextField
                fullWidth
                label="Full Name / Username"
                margin="normal"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Corporate Email"
                margin="normal"
                type="email"
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
                label="Secure Password"
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
                  background: `linear-gradient(45deg, ${(palette as any).primary[600]}, ${(palette as any).primary[400]})`,
                  color: "#000",
                  fontWeight: "900",
                  fontSize: "1.1rem",
                  boxShadow: `0 20px 40px -10px rgba(${(palette as any).primary[500]}, 0.4)`,
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  textTransform: "none",
                  "&:hover": {
                    transform: "scale(1.02) translateY(-4px)",
                    boxShadow: `0 25px 50px -15px rgba(${(palette as any).primary[500]}, 0.5)`,
                    filter: "brightness(1.1)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  }
                }}
              >
                {isLoading ? "Provisioning Account..." : "Start Free Trial"}
              </Button>
            </form>

            <Box mt="2.5rem" textAlign="center">
              <Typography variant="body2" color={palette.grey[500]}>
                Already a member?{" "}
                <Link
                  to="/login"
                  style={{ 
                    color: (palette as any).primary[400], 
                    textDecoration: "none",
                    fontWeight: "800",
                    marginLeft: "6px",
                    borderBottom: `1px solid rgba(46, 213, 115, 0.3)`,
                    paddingBottom: "2px"
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default SignupPage;
