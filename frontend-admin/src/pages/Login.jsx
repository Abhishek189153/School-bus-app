import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { loginUser } from "../services/auth.service";
import { loginSuccess } from "../redux/slices/authSlice";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      phone: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data =
        await loginUser(formData);

      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >

        <Paper
          elevation={5}
          sx={{
            width: "100%",
            padding: 4,
          }}
        >

          <Typography
            variant="h4"
            textAlign="center"
            mb={3}
          >
            School Bus Management
          </Typography>

          <form
            onSubmit={handleSubmit}
          >

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Login
            </Button>

          </form>

        </Paper>

      </Box>

    </Container>
  );
};

export default Login;