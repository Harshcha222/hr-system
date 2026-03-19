import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Salarite Virtual HR
        </Typography>
        {role && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              Role: {role}
            </Typography>
            {role === 'admin' && (
              <Button color="inherit" sx={{ mr: 2 }} onClick={() => navigate('/admin')}>Admin Dashboard</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
