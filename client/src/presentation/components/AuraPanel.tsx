import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  TextField,
  IconButton,
  useTheme,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useSendMessageMutation } from "@/data/api/api";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Summarize my revenue trend",
  "What's my biggest expense driver?",
  "Am I on track for profit this year?",
  "What's my profit margin?",
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const AuraPanel = ({ open, onClose }: Props) => {
  const { palette } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **Aura**, your AI financial advisor. I have access to your live revenue, expense, and profit data. Ask me anything about your business performance — I'm here to help you make smarter decisions. 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      // Only send last 10 messages to keep context window manageable
      const contextMessages = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const result = await sendMessage({ messages: contextMessages }).unwrap();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered an error connecting to the AI service. Please ensure the server is running and your API key is valid.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like renderer for bold and bullet points
  const renderMessageContent = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} style={{ color: (palette as any).primary[300] }}>
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const neonGlow = `0 0 15px rgba(26, 255, 214, 0.3), 0 0 30px rgba(129, 140, 248, 0.15)`;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          background: "linear-gradient(160deg, #0f0f1a 0%, #12121f 100%)",
          borderLeft: `1px solid rgba(129, 140, 248, 0.2)`,
          boxShadow: `-5px 0 30px rgba(0,0,0,0.5), ${neonGlow}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <Box
        px={2.5}
        py={2}
        sx={{
          background: "linear-gradient(90deg, rgba(129,140,248,0.08), rgba(26,255,214,0.04))",
          borderBottom: "1px solid rgba(129,140,248,0.15)",
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(129,140,248,0.3), rgba(26,255,214,0.2))",
                border: "1px solid rgba(129,140,248,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: neonGlow,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 20, color: (palette as any).primary[400] }} />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: (palette as any).secondary[500],
                  boxShadow: `0 0 6px ${(palette as any).secondary[500]}`,
                }}
              />
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  variant="h4"
                  sx={{
                    background: (palette as any).background.neon,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 800,
                  }}
                >
                  AURA AI
                </Typography>
                <AutoAwesomeIcon sx={{ fontSize: 14, color: (palette as any).secondary[400] }} />
              </Box>
              <Typography variant="h6" color={palette.grey[500]}>
                Financial Intelligence Advisor
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: palette.grey[500],
              "&:hover": { color: palette.grey[200], bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* MESSAGES */}
      <Box
        flex={1}
        overflow="auto"
        p={2}
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(129,140,248,0.3)",
            borderRadius: "4px",
          },
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Box
                display="flex"
                gap={1.5}
                mb={2}
                flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                alignItems="flex-start"
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    bgcolor:
                      msg.role === "assistant"
                        ? "rgba(129,140,248,0.15)"
                        : "rgba(26,255,214,0.1)",
                    border:
                      msg.role === "assistant"
                        ? "1px solid rgba(129,140,248,0.3)"
                        : "1px solid rgba(26,255,214,0.3)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <SmartToyIcon sx={{ fontSize: 16, color: (palette as any).primary[400] }} />
                  ) : (
                    <PersonIcon sx={{ fontSize: 16, color: (palette as any).secondary[400] }} />
                  )}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: "80%",
                    px: 1.75,
                    py: 1.25,
                    borderRadius:
                      msg.role === "user"
                        ? "1rem 0.25rem 1rem 1rem"
                        : "0.25rem 1rem 1rem 1rem",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(26,255,214,0.1))"
                        : "rgba(255,255,255,0.04)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(129,140,248,0.3)"
                        : "1px solid rgba(255,255,255,0.06)",
                    boxShadow:
                      msg.role === "user"
                        ? "0 0 15px rgba(129,140,248,0.1)"
                        : "none",
                  }}
                >
                  <Typography
                    component="div"
                    variant="h6"
                    color={palette.grey[msg.role === "user" ? 100 : 300]}
                    sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                  >
                    {renderMessageContent(msg.content)}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <Box display="flex" gap={1.5} mb={2} alignItems="center">
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: "rgba(129,140,248,0.15)",
                border: "1px solid rgba(129,140,248,0.3)",
              }}
            >
              <SmartToyIcon sx={{ fontSize: 16, color: (palette as any).primary[400] }} />
            </Avatar>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: "0.25rem 1rem 1rem 1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress
                size={14}
                sx={{ color: (palette as any).primary[400] }}
              />
              <Typography variant="h6" color={palette.grey[500]}>
                Analyzing your data...
              </Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* SUGGESTED PROMPTS (only show when only the intro message is present) */}
      {messages.length === 1 && (
        <Box px={2} pb={1} flexShrink={0}>
          <Typography variant="h6" color={palette.grey[600]} mb={1}>
            Suggested questions:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.75}>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <Box
                key={prompt}
                onClick={() => handleSend(prompt)}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "1rem",
                  border: "1px solid rgba(129,140,248,0.25)",
                  backgroundColor: "rgba(129,140,248,0.06)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(129,140,248,0.15)",
                    borderColor: "rgba(129,140,248,0.5)",
                    boxShadow: "0 0 8px rgba(129,140,248,0.2)",
                  },
                }}
              >
                <Typography variant="h6" color={(palette as any).primary[400]}>
                  {prompt}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* INPUT */}
      <Box
        px={2}
        py={1.75}
        sx={{
          borderTop: "1px solid rgba(129,140,248,0.12)",
          background: "rgba(0,0,0,0.3)",
          flexShrink: 0,
        }}
      >
        <Box display="flex" gap={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Ask Aura about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.75rem",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: palette.grey[200],
                fontSize: "0.825rem",
                "& fieldset": { borderColor: "rgba(129,140,248,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(129,140,248,0.4)" },
                "&.Mui-focused fieldset": {
                  borderColor: (palette as any).primary[400],
                  boxShadow: `0 0 0 2px rgba(129,140,248,0.15)`,
                },
              },
              "& .MuiInputBase-input::placeholder": { color: palette.grey[600] },
            }}
          />
          <IconButton
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              background: input.trim()
                ? `linear-gradient(135deg, ${(palette as any).primary[500]}, ${(palette as any).secondary[500]})`
                : "rgba(255,255,255,0.05)",
              borderRadius: "0.75rem",
              color: input.trim() ? "#0d0f14" : palette.grey[700],
              boxShadow: input.trim() ? neonGlow : "none",
              transition: "all 0.3s ease",
              "&:hover": {
                background: input.trim()
                  ? `linear-gradient(135deg, ${(palette as any).primary[400]}, ${(palette as any).secondary[400]})`
                  : "rgba(255,255,255,0.08)",
              },
              "&:disabled": { opacity: 0.4 },
            }}
          >
            <SendIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <Typography variant="h6" color={palette.grey[700]} mt={0.75} textAlign="center">
          Powered by Llama 3.3 70B · Press Enter to send
        </Typography>
      </Box>
    </Drawer>
  );
};

export default AuraPanel;
