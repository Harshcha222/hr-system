import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'employer') navigate('/employer');
      else if (res.data.role === 'hr') navigate('/hr');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Card sx={{ minWidth: 350 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Login</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
          </form>
          <Box mt={2}>
            {/* <Typography variant="body2">Demo users:</Typography>
            <Typography variant="caption">employer@salarite.com / employer123</Typography><br/>
            <Typography variant="caption">hr@salarite.com / hr123</Typography><br/>
            <Typography variant="caption">candidate@salarite.com / candidate123</Typography> */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
