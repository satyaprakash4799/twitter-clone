import React, {createContext, useContext, useState} from "react";
import {Alert, Snackbar, Stack} from "@mui/material";

interface SnackbarMessage {
  id: number;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface SnackbarContextType {
  addSnackbar: (message: string, severity: "success" | "error" | "warning" | "info") => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider = ({children}: SnackbarProviderProps) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const addSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    const newMessage: SnackbarMessage = {
      id: Math.floor((Math.random() * 1000000000000000000) + 1),
      message,
      severity,
    };
    setSnackbars((prev) => [...prev, newMessage]);
  };

  const handleCloseSnackbar = (id: number) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{addSnackbar}}>
      {children}
      <Stack spacing={2} sx={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 1301,
        display: 'flex',
        gap: 2,
        flexDirection: 'column'
      }}>
        {snackbars.map((snackbar, index) => (
          <Snackbar
            key={snackbar.id}
            sx={{
              bottom: `${(index) * 60}px !important`,
              marginTop: '20px',
            }}
            open={true}
            autoHideDuration={4000}
            onClose={(_event, reason) => reason === 'timeout' && handleCloseSnackbar(snackbar.id)}
            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
          >
            <Alert
              onClose={() => handleCloseSnackbar(snackbar.id)}
              severity={snackbar.severity}
              sx={{width: "100%"}}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
