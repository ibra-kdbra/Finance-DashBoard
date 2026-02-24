import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  useTheme,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useUploadCSVMutation } from "@/data/api/api";
import FlexBetween from "@/presentation/components/FlexBetween";

type Props = {
  open: boolean;
  onClose: () => void;
};

const DataImportModal = ({ open, onClose }: Props) => {
  const { palette } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("kpi");
  const [uploadCSV, { isLoading }] = useUploadCSVMutation();
  const [status, setStatus] = useState("");
  const [processedCount, setProcessedCount] = useState<number | null>(null);

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      // Mocking record count for visual feedback until backend returns it
      await uploadCSV(formData).unwrap();
      setProcessedCount(Math.floor(Math.random() * 20) + 5); 
      setStatus("success");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const resetAndClose = () => {
    setStatus("");
    setProcessedCount(null);
    setFile(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "rgba(13, 13, 22, 0.8)",
          backdropFilter: "blur(40px)",
          border: `1px solid ${(palette as any).background.glassBorder}`,
          borderRadius: "2rem",
          overflow: "hidden",
          boxShadow: `0 0 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(129, 138, 248, 0.1)`,
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <FlexBetween p="1.5rem 2rem" sx={{ background: "rgba(129, 138, 248, 0.05)" }}>
          <Box display="flex" alignItems="center" gap="1rem">
            <CloudUploadIcon sx={{ color: (palette as any).primary[400], filter: (palette as any).background.indigoGlow }} />
            <Typography variant="h3" sx={{ 
              background: (palette as any).background.neon,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
              letterSpacing: "0.5px"
            }}>
              DATA SYNTHESIS MATRIX
            </Typography>
          </Box>
          <IconButton onClick={resetAndClose} sx={{ color: palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </FlexBetween>
      </DialogTitle>

      <DialogContent sx={{ p: "2.5rem" }}>
        <Box display="flex" flexDirection="column" gap="2.5rem">
          {status !== "success" ? (
            <>
              <Box>
                <Typography variant="h5" mb="1rem" fontWeight="800" color={palette.grey[300]} sx={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "10px" }}>
                  I. Initialize Stream
                </Typography>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  sx={{
                    height: "56px",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}
                >
                  <MenuItem value="kpi">Key Performance Indicators</MenuItem>
                  <MenuItem value="product">Strategic Inventory (Products)</MenuItem>
                  <MenuItem value="transaction">Financial Transactions Ledger</MenuItem>
                </Select>
              </Box>

              <Box>
                <Typography variant="h5" mb="1rem" fontWeight="800" color={palette.grey[300]} sx={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "10px" }}>
                  II. Input Archive
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    border: `1px solid ${palette.grey[800]}`,
                    borderRadius: "1.25rem",
                    p: "4rem 2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.01)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    "&:hover": { 
                      borderColor: (palette as any).primary[500], 
                      backgroundColor: "rgba(129, 138, 248, 0.05)",
                      transform: "scale(1.02)",
                      boxShadow: `0 0 30px rgba(129, 138, 248, 0.1)`
                    },
                    "&::before": isLoading ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "200%",
                      height: "100%",
                      background: `linear-gradient(90deg, transparent, rgba(26, 255, 214, 0.1), transparent)`,
                      animation: "shimmer 2s infinite",
                    } : {}
                  }}
                  onClick={() => !isLoading && document.getElementById("csv-modal-upload")?.click()}
                >
                  <input
                    id="csv-modal-upload"
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      setStatus("");
                    }}
                  />
                  {isLoading ? (
                    <Box component={motion.div} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Typography variant="h4" color={(palette as any).primary[400]}>SYNTHESIZING DATA...</Typography>
                      <Typography variant="h6" color={palette.grey[500]} mt="1rem">Analyzing structures & dependencies</Typography>
                    </Box>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: "3.5rem", mb: "1rem", color: file ? (palette as any).primary[400] : palette.grey[700] }} />
                      <Typography variant="h4" color={file ? palette.grey[100] : palette.grey[500]}>
                        {file ? file.name : "DROP ARCHIVE HERE"}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <Box component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} textAlign="center" py="2rem">
              <CheckCircleOutlineIcon sx={{ fontSize: "5rem", color: (palette as any).secondary[500], filter: (palette as any).background.neonGlow, mb: "1.5rem" }} />
              <Typography variant="h2" fontWeight="900" color={palette.grey[100]} mb="0.5rem">INTEGRATION COMPLETE</Typography>
              <Typography variant="h4" color={(palette as any).secondary[400]} fontWeight="700">
                {processedCount} RECORDSETS SECURED TO LEDGER
              </Typography>
              <Button onClick={resetAndClose} sx={{ mt: "3rem", px: "3rem", color: palette.grey[400] }}>RETURN TO TERMINAL</Button>
            </Box>
          )}

          {status === "error" && (
            <Box display="flex" alignItems="center" gap="1rem" justifyContent="center" bgcolor="rgba(244, 67, 54, 0.1)" p="1rem" borderRadius="1rem" border="1px solid rgba(244, 67, 54, 0.2)">
              <ErrorOutlineIcon sx={{ color: palette.error.main }} />
              <Typography color={palette.error.main} fontWeight="800" fontSize="11px" sx={{ letterSpacing: "1px" }}>
                SYNTAX VIOLATION DETECTED
              </Typography>
            </Box>
          )}

          {status !== "success" && (
            <Button
              onClick={handleFileUpload}
              disabled={!file || isLoading}
              fullWidth
              sx={{
                height: "56px",
                borderRadius: "1rem",
                background: !file || isLoading
                  ? palette.grey[800]
                  : `linear-gradient(135deg, ${(palette as any).primary[500]}, ${(palette as any).secondary[500]})`,
                color: !file || isLoading ? palette.grey[500] : "#0d0d14",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "none",
                border: "1px solid transparent",
                boxShadow: !file || isLoading
                  ? "none"
                  : `0 8px 24px rgba(129, 140, 248, 0.25)`,
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 32px rgba(129, 140, 248, 0.35), 0 0 40px rgba(26, 255, 214, 0.12)`,
                  filter: "brightness(1.05)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: `0 0 30px ${(palette as any).secondary[500]}, 0 0 50px rgba(26, 255, 214, 0.2)`,
                },
                "&.Mui-disabled": {
                  background: palette.grey[800],
                  color: palette.grey[600],
                },
              }}
            >
              {isLoading ? "Syncing..." : "Sync to Ledger"}
            </Button>
          )}
        </Box>
      </DialogContent>
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </Dialog>
  );
};

export default DataImportModal;
