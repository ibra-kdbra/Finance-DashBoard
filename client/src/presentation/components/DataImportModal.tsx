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
import SyncIcon from "@mui/icons-material/Sync";
import ScienceIcon from "@mui/icons-material/Science";
import AddIcon from "@mui/icons-material/Add";
import { useUploadCSVMutation, useSyncStripeMutation, useSyncMockMutation, useAppendManualDataMutation } from "@/data/api/api";
import FlexBetween from "@/presentation/components/FlexBetween";

type Props = {
  open: boolean;
  onClose: () => void;
};

const DataImportModal = ({ open, onClose }: Props) => {
  const { palette } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("kpi");
  const [uploadCSV, { isLoading: isUploading }] = useUploadCSVMutation();
  const [syncStripe, { isLoading: isSyncing }] = useSyncStripeMutation();
  const [syncMock, { isLoading: isMocking }] = useSyncMockMutation();
  const [appendManualData, { isLoading: isAppending }] = useAppendManualDataMutation();
  const [status, setStatus] = useState("");
  
  // Manual Entry States
  const [manualMode, setManualMode] = useState(false);
  const [manualMonth, setManualMonth] = useState("");
  const [manualRevenue, setManualRevenue] = useState("");
  const [manualExpenses, setManualExpenses] = useState("");

  const isLoading = isUploading || isSyncing || isMocking || isAppending;

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await uploadCSV(formData).unwrap();
      setStatus("success");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleStripeSync = async () => {
    try {
      await syncStripe().unwrap();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleMockSync = async () => {
    try {
      await syncMock().unwrap();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleManualAppend = async () => {
    try {
      if (!manualMonth || !manualRevenue || !manualExpenses) return;
      await appendManualData({ 
        month: manualMonth, 
        revenue: Number(manualRevenue), 
        expenses: Number(manualExpenses) 
      }).unwrap();
      setStatus("success");
      setManualMonth("");
      setManualRevenue("");
      setManualExpenses("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const resetAndClose = () => {
    setStatus("");
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
              <Box mb="2rem">
                <Typography variant="h5" mb="1rem" fontWeight="800" color={palette.grey[300]} sx={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "10px" }}>
                  I. Automated Pipelines
                </Typography>
                <Button
                  onClick={handleStripeSync}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    height: "64px",
                    borderRadius: "1rem",
                    mb: "1rem",
                    background: `linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.4))`,
                    color: palette.grey[100],
                    fontSize: "16px",
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "none",
                    border: `1px solid rgba(129, 140, 248, 0.5)`,
                    boxShadow: `0 8px 24px rgba(129, 140, 248, 0.2)`,
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px rgba(129, 140, 248, 0.35), 0 0 40px rgba(129, 140, 248, 0.2)`,
                      filter: "brightness(1.1)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(99, 102, 241, 0.1)",
                      color: palette.grey[600],
                    },
                  }}
                >
                  {isSyncing ? "Connecting to Stripe API..." : "Live Sync via Stripe"}
                  <SyncIcon sx={{ ml: "0.5rem" }} />
                </Button>

                <Button
                  onClick={handleMockSync}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    height: "64px",
                    borderRadius: "1rem",
                    background: `linear-gradient(135deg, rgba(26, 255, 214, 0.1), rgba(26, 255, 214, 0.2))`,
                    color: (palette as any).primary[400],
                    fontSize: "16px",
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "none",
                    border: `1px solid rgba(26, 255, 214, 0.3)`,
                    boxShadow: `0 8px 24px rgba(26, 255, 214, 0.1)`,
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px rgba(26, 255, 214, 0.25), 0 0 40px rgba(26, 255, 214, 0.15)`,
                      filter: "brightness(1.2)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(26, 255, 214, 0.05)",
                      color: palette.grey[600],
                    },
                  }}
                >
                  {isMocking ? "Synthesizing Mock Trajectories..." : "Generate AI Mock Ledger"}
                  <ScienceIcon sx={{ ml: "0.5rem" }} />
                </Button>
              </Box>

              <Box mb="2rem" display="flex" alignItems="center" gap="1rem">
                <Box flex={1} height="1px" bgcolor={palette.grey[800]} />
                <Typography variant="h6" color={palette.grey[600]}>OR MANUAL UPLOAD</Typography>
                <Box flex={1} height="1px" bgcolor={palette.grey[800]} />
              </Box>

              <Box display="flex" gap="1rem" mb="2rem">
                <Button 
                  onClick={() => setManualMode(false)}
                  fullWidth
                  sx={{
                    py: "0.75rem",
                    borderRadius: "0.5rem",
                    background: !manualMode ? "rgba(129, 140, 248, 0.15)" : "transparent",
                    color: !manualMode ? (palette as any).primary[400] : palette.grey[500],
                    border: `1px solid ${!manualMode ? (palette as any).primary[500] : palette.grey[800]}`,
                    fontWeight: "bold",
                    "&:hover": { background: "rgba(129, 140, 248, 0.2)" }
                  }}
                >
                  Upload CSV
                </Button>
                <Button 
                  onClick={() => setManualMode(true)}
                  fullWidth
                  sx={{
                    py: "0.75rem",
                    borderRadius: "0.5rem",
                    background: manualMode ? "rgba(26, 255, 214, 0.15)" : "transparent",
                    color: manualMode ? (palette as any).primary[400] : palette.grey[500],
                    border: `1px solid ${manualMode ? (palette as any).primary[500] : palette.grey[800]}`,
                    fontWeight: "bold",
                    "&:hover": { background: "rgba(26, 255, 214, 0.2)" }
                  }}
                >
                  Manual Entry
                </Button>
              </Box>

              <Box>
                <Typography variant="h5" mb="1rem" fontWeight="800" color={palette.grey[300]} sx={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "10px" }}>
                  II. Initialize Stream
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

              <Box mt="2.5rem">
                <Typography variant="h5" mb="1rem" fontWeight="800" color={palette.grey[300]} sx={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "10px" }}>
                  III. {manualMode ? "Data Entry Form" : "Input Archive"}
                </Typography>
                
                {manualMode ? (
                  <Box display="flex" flexDirection="column" gap="1rem">
                    <Select
                      value={manualMonth}
                      onChange={(e) => setManualMonth(e.target.value)}
                      displayEmpty
                      fullWidth
                      sx={{
                        height: "56px",
                        fontWeight: 600,
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <MenuItem value="" disabled>Select Month</MenuItem>
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                      ))}
                    </Select>
                    
                    <Box display="flex" gap="1rem">
                      <Box flex={1} position="relative">
                        <Typography sx={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: palette.grey[500], zIndex: 1, pointerEvents: "none" }}>$</Typography>
                        <input
                          type="number"
                          placeholder="Revenue"
                          value={manualRevenue}
                          onChange={(e) => setManualRevenue(e.target.value)}
                          style={{
                            width: "100%",
                            height: "56px",
                            paddingLeft: "2rem",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            border: `1px solid ${palette.grey[800]}`,
                            borderRadius: "0.25rem",
                            color: "white",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </Box>
                      <Box flex={1} position="relative">
                         <Typography sx={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: palette.grey[500], zIndex: 1, pointerEvents: "none" }}>$</Typography>
                         <input
                          type="number"
                          placeholder="Expenses"
                          value={manualExpenses}
                          onChange={(e) => setManualExpenses(e.target.value)}
                          style={{
                            width: "100%",
                            height: "56px",
                            paddingLeft: "2rem",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            border: `1px solid ${palette.grey[800]}`,
                            borderRadius: "0.25rem",
                            color: "white",
                            fontSize: "1rem",
                            outline: "none"
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : (
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
                    "&::before": isUploading ? {
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
                  {isUploading ? (
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
                )}
              </Box>
            </>
          ) : (
            <Box component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} textAlign="center" py="2rem">
              <CheckCircleOutlineIcon sx={{ fontSize: "5rem", color: (palette as any).secondary[500], filter: (palette as any).background.neonGlow, mb: "1.5rem" }} />
              <Typography variant="h2" fontWeight="900" color={palette.grey[100]} mb="0.5rem">INTEGRATION COMPLETE</Typography>
              <Typography variant="h4" color={(palette as any).secondary[400]} fontWeight="700">
                DATA SECURED TO LEDGER
              </Typography>
              <Button onClick={resetAndClose} sx={{ mt: "3rem", px: "3rem", color: palette.grey[400] }}>RETURN TO TERMINAL</Button>
            </Box>
          )}

          {status === "error" && (
            <Box display="flex" alignItems="center" gap="1rem" justifyContent="center" bgcolor="rgba(244, 67, 54, 0.1)" p="1rem" borderRadius="1rem" border="1px solid rgba(244, 67, 54, 0.2)">
              <ErrorOutlineIcon sx={{ color: palette.error.main }} />
              <Typography color={palette.error.main} fontWeight="800" fontSize="11px" sx={{ letterSpacing: "1px" }}>
                SYNTAX OR NETWORK VIOLATION DETECTED
              </Typography>
            </Box>
          )}

          {status !== "success" && (
            <Button
              onClick={manualMode ? handleManualAppend : handleFileUpload}
              disabled={(manualMode ? (!manualMonth || !manualRevenue || !manualExpenses) : !file) || isLoading}
              fullWidth
              sx={{
                height: "56px",
                borderRadius: "1rem",
                background: ((manualMode ? (!manualMonth || !manualRevenue || !manualExpenses) : !file) || isLoading)
                  ? palette.grey[800]
                  : `linear-gradient(135deg, ${(palette as any).primary[500]}, ${(palette as any).secondary[500]})`,
                color: ((manualMode ? (!manualMonth || !manualRevenue || !manualExpenses) : !file) || isLoading) ? palette.grey[500] : "#0d0d14",
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "none",
                border: "1px solid transparent",
                boxShadow: ((manualMode ? (!manualMonth || !manualRevenue || !manualExpenses) : !file) || isLoading)
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
              {isUploading ? "Syncing Logic..." : manualMode ? "Append Data to Ledger" : "Sync Uploaded File to Ledger"}
              {manualMode && <AddIcon sx={{ ml: "0.5rem" }} />}
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
