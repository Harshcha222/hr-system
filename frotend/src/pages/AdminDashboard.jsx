import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert, List, ListItem, ListItemText } from '@mui/material';
import { api } from '../api';
import TopBar from './TopBar';

const API = 'http://localhost:5000';
const roles = ['admin', 'employer', 'hr', 'candidate'];

export default function AdminDashboard() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`${API}/users`);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post(`${API}/users`, form);
      setSuccess('User created successfully!');
      setForm({ name: '', email: '', password: '', role: 'employer' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create user');
    }
  };

  return (
    <>
      <TopBar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Card sx={{ maxWidth: 400, mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Register New User</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select name="role" value={form.role} onChange={handleChange} required>
                  {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register User</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">All Users</Typography>
            <List>
              {users.map(u => (
                <ListItem key={u.id} divider>
                  <ListItemText primary={`${u.name} (${u.email})`} secondary={`Role: ${u.role}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
