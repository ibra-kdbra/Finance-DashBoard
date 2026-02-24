import React, { ReactNode } from "react";
import { Dialog, DialogContent, Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const ChartExpandOverlay = ({ open, onClose, title, subtitle, children }: Props) => {
  const { palette } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={false}
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.85, y: 40 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            sx: {
              backgroundColor: "rgba(13, 13, 20, 0.97)",
              backdropFilter: "blur(60px)",
              borderRadius: "1.5rem",
              border: `1px solid ${palette.grey[800]}`,
              boxShadow: "0 40px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(129, 140, 248, 0.08)",
              width: "90vw",
              height: "85vh",
              maxWidth: "90vw",
              maxHeight: "85vh",
              overflow: "hidden",
            },
          } as any}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(8px)",
              },
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px="2rem"
              pt="1.5rem"
              pb="1rem"
              borderBottom={`1px solid ${palette.grey[800]}`}
            >
              <Box display="flex" alignItems="center" gap="0.75rem">
                <OpenInFullIcon sx={{ color: (palette as any).primary[500], fontSize: "1.25rem" }} />
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="h6" color={palette.grey[500]} mt="0.15rem">
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: palette.grey[400],
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "0.75rem",
                  border: `1px solid ${palette.grey[800]}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    borderColor: "rgba(244, 67, 54, 0.3)",
                    color: "#f44336",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Chart Area */}
            <Box
              flexGrow={1}
              p="1.5rem 2rem 2rem"
              display="flex"
              flexDirection="column"
              overflow="hidden"
            >
              <Box flexGrow={1} position="relative" minHeight={0}>
                {children}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ChartExpandOverlay;
