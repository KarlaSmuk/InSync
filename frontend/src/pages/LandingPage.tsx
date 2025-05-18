import { useState } from "react";
import { Container, Typography, Tabs, Tab, Paper } from "@mui/material";
import AuthForm from "../components/AuthForm";

function LandingPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleAuthSubmit = (formData: {
    email: string;
    password: string;
    username?: string;
  }) => {
    console.log("Submit:", formData);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "500px",
          height: "505px",
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight={600}
          color="primary"
          marginBottom={"8px"}
        >
          InSync
        </Typography>
        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          marginBottom={"32px"}
        >
          Project Management App
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ marginBottom: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <AuthForm
          mode={tab === 0 ? "login" : "register"}
          onSubmit={handleAuthSubmit}
        />
      </Paper>
    </Container>
  );
}

export default LandingPage;
