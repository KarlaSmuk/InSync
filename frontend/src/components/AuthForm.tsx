// src/components/AuthForm.tsx
import { useState } from "react";
import { TextField, Button, Stack, Container } from "@mui/material";

type AuthFormProps = {
  mode: "login" | "register";
  onSubmit: (formData: {
    email: string;
    password: string;
    username?: string;
  }) => void;
};

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email,
      password,
      username: mode === "register" ? username : undefined,
    });
  };

  return (
    <Container
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        height: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={2}>
        {mode === "register" && (
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
