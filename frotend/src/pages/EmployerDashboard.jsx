import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';
import { api } from '../api';
import TopBar from './TopBar';

const API = 'http://localhost:5000'; // Change if backend runs elsewhere

export default function EmployerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, in_progress: 0 });
  const [activity, setActivity] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assigned_to: '', priority: 'Medium' });
  const [hrUsers, setHrUsers] = useState([]);

  // Fetch tasks, summary, activity, HR users
  const fetchAll = async () => {
    const [tasksRes, summaryRes, activityRes, hrRes] = await Promise.all([
      api.get(`${API}/tasks/my`),
      api.get(`${API}/summary`),
      api.get(`${API}/activity`),
      api.get(`${API}/users?role=hr`)
    ]);
    setTasks(tasksRes.data);
    setSummary(summaryRes.data);
    setActivity(activityRes.data);
    setHrUsers(hrRes.data);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post(`${API}/tasks`, form);
    setForm({ title: '', description: '', assigned_to: '', priority: 'Medium' });
    fetchAll();
  };

  return (
    <>
      <TopBar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>Employer Dashboard</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Task Summary</Typography>
                <Typography>Total: {summary.total}</Typography>
                <Typography>Completed: {summary.completed}</Typography>
                <Typography>Pending: {summary.pending}</Typography>
                <Typography>In Progress: {summary.in_progress}</Typography>
              </CardContent>
            </Card>
            <Box mt={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Assign Task</Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Assign to HR</InputLabel>
                      <Select name="assigned_to" value={form.assigned_to} onChange={handleChange} required>
                        {hrUsers.map(hr => <MenuItem key={hr.id} value={hr.id}>{hr.name || `HR #${hr.id}`}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Priority</InputLabel>
                      <Select name="priority" value={form.priority} onChange={handleChange}>
                        <MenuItem value="Normal">Normal</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth>Assign Task</Button>
                  </form>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">My Tasks</Typography>
                <List>
                  {tasks.map(t => (
                    <ListItem key={t.id} divider>
                      <ListItemText primary={t.title} secondary={`Status: ${t.status} | Assigned to: ${t.assigned_to}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            <Box mt={2}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Activity Feed</Typography>
                  <List>
                    {activity.map((a, i) => (
                      <ListItem key={i} divider>
                        <ListItemText primary={a.message} secondary={a.timestamp} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
