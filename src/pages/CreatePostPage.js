import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Switch, FormControlLabel, Button, Grid } from '@mui/material';import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { ref, push } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Autocomplete } from '@mui/material';

const CreatePostPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = () => {
      const cachedTrails = localStorage.getItem('trails');
      if (cachedTrails) {
        setTrails(JSON.parse(cachedTrails));
      }
    };

    fetchTrails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      const newPost = {
        title,
        description,
        type: isEvent ? 'event' : 'text',
        userId: currentUser.uid,
      };

      if (isEvent) {
        newPost.trailId = selectedTrail?.id;
        newPost.date = eventDate.toISOString();
        newPost.time = eventTime.toISOString();
      }

      const postRef = await push(ref(db, 'communityPosts'), newPost);

      setTitle('');
      setDescription('');
      setIsEvent(false);
      setSelectedTrail(null);
      setEventDate(null);
      setEventTime(null);

      navigate(`/post/${postRef.key}`);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <FormControlLabel
          control={<Switch checked={isEvent} onChange={(e) => setIsEvent(e.target.checked)} />}
          label="Event"
        />
        {isEvent && (
          <>
            <Autocomplete
              options={trails}
              getOptionLabel={(option) => option.name}
              value={selectedTrail}
              onChange={(event, newValue) => setSelectedTrail(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Trail" margin="normal" />}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Event Date"
                  value={eventDate}
                  onChange={(newValue) => setEventDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Event Time"
                  value={eventTime}
                  onChange={(newValue) => setEventTime(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  required
                />
              </Grid>
            </Grid>
          </>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Create Post
        </Button>
      </form>
    </Container>
  );
};

export default CreatePostPage;