import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function CallRoom() {
  const { id } = useParams();
  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h4">Call Room</Typography>
          <Typography>Interview Room ID: {id}</Typography>
          <Typography>This is a placeholder for the inbuilt call/chat/video interface.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
