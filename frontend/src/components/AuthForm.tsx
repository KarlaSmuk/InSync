// src/components/AuthForm.tsx
import { useState } from "react";
import { TextField, Button, Stack, Container } from "@mui/material";
import type { LoginRequest, UserCreate } from "../api/fastAPI.schemas";

type AuthFormProps = {
  mode: "login" | "register";
  onSubmit: (
    data: LoginRequest | UserCreate,
    mode: "login" | "register"
  ) => void;
};

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState(""); //for login it can be email or username
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  const handleSubmit = (e: React.FormEvent, mode: "login" | "register") => {
    e.preventDefault();
    if (mode === "login") {
      const loginData: LoginRequest = {
        username,
        password,
      };
      onSubmit(loginData, mode);
    } else {
      const registerData: UserCreate = {
        email,
        password,
        username,
        fullName: "",
      };
      onSubmit(registerData, mode);
    }
  };

  return (
    <Container
      component="form"
      onSubmit={(e) => handleSubmit(e, mode)}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 4,
      }}
    >
      <Stack spacing={2}>
        {mode === "register" && (
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        )}
        {mode === "register" && (
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {mode === "login" ? "Login" : "Register"}
      </Button>
    </Container>
  );
}
