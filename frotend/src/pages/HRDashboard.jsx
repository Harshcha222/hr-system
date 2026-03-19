// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel } from '@mui/material';
// import { api } from '../api';
// import TopBar from './TopBar';

// const API = 'http://localhost:5000'; // Change if backend runs elsewhere

// export default function HRDashboard() {
//   const [tasks, setTasks] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [interviewForm, setInterviewForm] = useState({ candidate_id: '', datetime: '', mode: 'Voice', task_id: '' });
//   const [candidates, setCandidates] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const fetchAll = async () => {
//     const [tasksRes, candidatesRes] = await Promise.all([
//       api.get(`${API}/tasks/assigned`),
//       api.get(`${API}/users?role=candidate`)
//     ]);
//     setTasks(tasksRes.data);
//     setCandidates(candidatesRes.data);
//   };

//   useEffect(() => {
//     fetchAll();
//     const interval = setInterval(fetchAll, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleStatusChange = async (task, status) => {
//     await api.put(`${API}/tasks/${task.id}/status`, { status });
//     fetchAll();
//   };

//   const handleOpenInterview = (task) => {
//     setSelectedTask(task);
//     setInterviewForm(f => ({ ...f, task_id: task.id }));
//     setOpen(true);
//   };

//   const handleInterviewChange = e => setInterviewForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const handleInterviewSubmit = async e => {
//     e.preventDefault();
//     await api.post(`${API}/interviews`, interviewForm);
//     setOpen(false);
//     setInterviewForm({ candidate_id: '', datetime: '', mode: 'Voice', task_id: '' });
//   };

//   return (
//     <>
//       <TopBar />
//       <Box p={3}>
//         <Typography variant="h4" gutterBottom>HR Dashboard</Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={8}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Assigned Tasks</Typography>
//                 <List>
//                   {tasks.map(t => (
//                     <ListItem key={t.id} divider>
//                       <ListItemText primary={t.title} secondary={`Status: ${t.status} | Priority: ${t.priority}`} />
//                       <Select
//                         value={t.status}
//                         onChange={e => handleStatusChange(t, e.target.value)}
//                         sx={{ minWidth: 120, mr: 2 }}
//                       >
//                         <MenuItem value="Pending">Pending</MenuItem>
//                         <MenuItem value="In Progress">In Progress</MenuItem>
//                         <MenuItem value="Completed">Completed</MenuItem>
//                       </Select>
//                       <Button variant="outlined" onClick={() => handleOpenInterview(t)}>Schedule Interview</Button>
//                     </ListItem>
//                   ))}
//                 </List>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//         <Dialog open={open} onClose={() => setOpen(false)}>
//           <DialogTitle>Schedule Interview</DialogTitle>
//           <form onSubmit={handleInterviewSubmit}>
//             <DialogContent>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Candidate</InputLabel>
//                 <Select name="candidate_id" value={interviewForm.candidate_id} onChange={handleInterviewChange} required>
//                   {candidates.map(c => <MenuItem key={c.id} value={c.id}>{c.name || `Candidate #${c.id}`}</MenuItem>)}
//                 </Select>
//               </FormControl>
//               <TextField
//                 label="Date & Time"
//                 name="datetime"
//                 type="datetime-local"
//                 value={interviewForm.datetime}
//                 onChange={handleInterviewChange}
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 required
//               />
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Mode</InputLabel>
//                 <Select name="mode" value={interviewForm.mode} onChange={handleInterviewChange} required>
//                   <MenuItem value="Voice">Voice</MenuItem>
//                   <MenuItem value="Video">Video</MenuItem>
//                   <MenuItem value="Chat">Chat</MenuItem>
//                 </Select>
//               </FormControl>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpen(false)}>Cancel</Button>
//               <Button type="submit" variant="contained">Schedule</Button>
//             </DialogActions>
//           </form>
//         </Dialog>
//       </Box>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, List,
  ListItem, ListItemText, MenuItem, Select, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel
} from '@mui/material';
import { api } from '../api';
import TopBar from './TopBar';

export default function HRDashboard() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    candidate_id: '',
    datetime: '',
    mode: 'Voice',
    task_id: ''
  });
  const [candidates, setCandidates] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAll = async () => {
    const [tasksRes, candidatesRes] = await Promise.all([
      api.get('/tasks/assigned'),          // ✅ FIXED
      api.get('/users?role=candidate')     // ✅ FIXED
    ]);
    setTasks(tasksRes.data);
    setCandidates(candidatesRes.data);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (task, status) => {
    await api.put(`/tasks/${task.id}/status`, { status }); // ✅ FIXED
    fetchAll();
  };

  const handleOpenInterview = (task) => {
    setSelectedTask(task);
    setInterviewForm(f => ({ ...f, task_id: task.id }));
    setOpen(true);
  };

  const handleInterviewChange = e =>
    setInterviewForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    await api.post('/interviews', interviewForm); // ✅ FIXED
    setOpen(false);
    setInterviewForm({
      candidate_id: '',
      datetime: '',
      mode: 'Voice',
      task_id: ''
    });
  };

  return (
    <>
      <TopBar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>HR Dashboard</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Assigned Tasks</Typography>

                <List>
                  {tasks.map(t => (
                    <ListItem key={t.id} divider>
                      <ListItemText
                        primary={t.title}
                        secondary={`Status: ${t.status} | Priority: ${t.priority}`}
                      />

                      <Select
                        value={t.status}
                        onChange={e => handleStatusChange(t, e.target.value)}
                        sx={{ minWidth: 120, mr: 2 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>

                      <Button
                        variant="outlined"
                        onClick={() => handleOpenInterview(t)}
                      >
                        Schedule Interview
                      </Button>
                    </ListItem>
                  ))}
                </List>

              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Schedule Interview</DialogTitle>

          <form onSubmit={handleInterviewSubmit}>
            <DialogContent>

              <FormControl fullWidth margin="normal">
                <InputLabel>Candidate</InputLabel>
                <Select
                  name="candidate_id"
                  value={interviewForm.candidate_id}
                  onChange={handleInterviewChange}
                  required
                >
                  {candidates.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name || `Candidate #${c.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Date & Time"
                name="datetime"
                type="datetime-local"
                value={interviewForm.datetime}
                onChange={handleInterviewChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Mode</InputLabel>
                <Select
                  name="mode"
                  value={interviewForm.mode}
                  onChange={handleInterviewChange}
                  required
                >
                  <MenuItem value="Voice">Voice</MenuItem>
                  <MenuItem value="Video">Video</MenuItem>
                  <MenuItem value="Chat">Chat</MenuItem>
                </Select>
              </FormControl>

            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Schedule</Button>
            </DialogActions>
          </form>
        </Dialog>

      </Box>
    </>
  );
}