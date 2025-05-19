import { useState } from "react";
import { Container, Typography, Tabs, Tab, Paper } from "@mui/material";
import AuthForm from "../components/AuthForm";
import { getAuth } from "../api/auth/auth";
import type { LoginRequest, UserCreate } from "../api/fastAPI.schemas";

function LandingPage() {
  const [tab, setTab] = useState(0);
  const { registerUserApiAuthRegisterPost, loginApiAuthLoginPost } = getAuth();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleAuthSubmit = async (
    data: LoginRequest | UserCreate,
    mode: "login" | "register"
  ) => {
    try {
      if (mode === "login") {
        const response = await loginApiAuthLoginPost(data as LoginRequest);
        const accessToken = response.accessToken;
        console.log("Logged in! Token:", accessToken);
      } else {
        const response = await registerUserApiAuthRegisterPost(
          data as UserCreate
        );
        console.log("User registered:", response);
      }
    } catch (error) {
      console.error("Auth failed:", error);
    }
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
          height: "580px",
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
