import { Box, Button, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useUploadCSVMutation } from "@/data/api/api";
import DashboardBox from "@/presentation/components/DashboardBox";
import FlexBetween from "@/presentation/components/FlexBetween";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DataSettings = () => {
  const { palette } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("kpi");
  const [uploadCSV, { isLoading }] = useUploadCSVMutation();
  const [status, setStatus] = useState("");

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

  return (
    <Box m="1.5rem">
      <FlexBetween mb="2rem">
        <Typography variant="h2" sx={{ 
          background: (palette as any).background.neon,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold"
        }}>
          Data Management
        </Typography>
      </FlexBetween>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardBox p="2rem">
          <Typography variant="h4" mb="1rem" color={palette.grey[300]}>
            Bulk Import CSV
          </Typography>
          <Typography variant="h6" mb="2rem" color={palette.grey[500]}>
            Upload your organization's data to populate the dashboard. Supports KPI, Product, and Transaction data formats.
          </Typography>

          <Box display="flex" gap="2rem" alignItems="center">
            <Box>
              <Typography variant="h6" mb="0.5rem" color={palette.grey[400]}>
                Data Category
              </Typography>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{
                  color: palette.grey[300],
                  border: `1px solid ${palette.grey[700]}`,
                  minWidth: "200px",
                }}
              >
                <MenuItem value="kpi">Key Performance Indicators</MenuItem>
                <MenuItem value="product">Products</MenuItem>
                <MenuItem value="transaction">Transactions</MenuItem>
              </Select>
            </Box>

            <Box flexGrow={1}>
              <Typography variant="h6" mb="0.5rem" color={palette.grey[400]}>
                CSV File
              </Typography>
              <Box
                sx={{
                  border: `2px dashed ${palette.grey[700]}`,
                  borderRadius: "0.5rem",
                  p: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: (palette as any).primary[500], background: "rgba(255,255,255,0.05)" }
                }}
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <CloudUploadIcon sx={{ fontSize: "3rem", mb: "1rem", color: (palette as any).primary[500] }} />
                <Typography color={palette.grey[400]}>
                  {file ? file.name : "Drag & drop or click to select CSV file"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            onClick={handleFileUpload}
            disabled={!file || isLoading}
            sx={{
              mt: "3rem",
              background: (palette as any).background.neon,
              color: palette.grey[900],
              fontWeight: "900",
              p: "0.75rem 3rem",
              borderRadius: "0.5rem",
              "&:hover": { filter: "brightness(1.1)" },
              "&:disabled": { background: palette.grey[800], color: palette.grey[600] }
            }}
          >
            {isLoading ? "Processing..." : "Import Data"}
          </Button>

          {status === "success" && (
            <Typography mt="1rem" color={(palette as any).secondary[500]}>
              Data imported successfully!
            </Typography>
          )}
          {status === "error" && (
            <Typography mt="1rem" color="error">
              Failed to import data. Please check your CSV format.
            </Typography>
          )}
        </DashboardBox>
      </motion.div>
    </Box>
  );
};

export default DataSettings;
