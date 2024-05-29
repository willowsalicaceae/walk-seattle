import React, { useState, useEffect } from 'react';
import { Box, Stack, Paper, Card, CardContent, CardActions, Typography, Button, CardMedia, CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RSVPButton from './RSVPButton';
import { ref, onValue, remove } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import PersonIcon from '@mui/icons-material/Person';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CommunityPostCard = ({ post, onDeletePost }) => {
  const [trail, setTrail] = useState(null);
  const [user, setUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const currentUser = auth.currentUser;
  const [isRSVP, setIsRSVP] = useState(false);

  useEffect(() => {
    const fetchTrail = () => {
      if (post.trailId) {
        const trailRef = ref(db, `trails/${post.trailId}`);
        onValue(trailRef, (snapshot) => {
          const trailData = snapshot.val();
          setTrail(trailData);
        });
      }
    };

    const fetchUser = () => {
      const userRef = ref(db, `users/${post.userId}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUser(userData);
      });
    };

    const fetchRSVPStatus = () => {
      if (currentUser) {
        const rsvpRef = ref(db, `users/${currentUser.uid}/rsvps/${post.id}`);
        onValue(rsvpRef, (snapshot) => {
          setIsRSVP(snapshot.exists());
        });
      }
    };

    fetchTrail();
    fetchUser();
    fetchRSVPStatus();
  }, [post, currentUser]);

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeletePost = () => {
    const postRef = ref(db, `communityPosts/${post.id}`);
    remove(postRef)
      .then(() => {
        onDeletePost(post.id);
        setDeleteConfirmationOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };
  const handleRSVPChange = (newRSVPStatus) => {
    setIsRSVP(newRSVPStatus);
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardActionArea component={RouterLink} to={`/post/${post.id}`} sx={{ flexGrow: 1 }}>
          {trail && (
            <CardMedia component="img" height="140" image={trail.image} alt={trail.name} />
          )}
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              {post.type === 'event' && post.date && (
                <Paper elevation={1} sx={{ px: 1 }}>
                  <Stack spacing={0}>
                    <Typography variant="h6" textAlign="center" lineHeight={1} mt={.5}>
                      {new Date(post.date).getDate()}
                    </Typography>
                    <Typography variant="body1" textAlign="center" lineHeight={1} mb={.5}>
                      {months[new Date(post.date).getMonth()]}
                    </Typography>
                  </Stack>
                </Paper>
              )}
              {user && (
                <Typography variant="h6" color="text.secondary" fontSize={20} display="flex" alignItems="center">
                  <PersonIcon sx={{ mr: 0.5 }}/> {user.username}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {post.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button component={RouterLink} to={`/post/${post.id}`} size="small">
            View Details
          </Button>
          {post.type === 'event' && <RSVPButton postId={post.id} isRSVP={isRSVP} onRSVPChange={handleRSVPChange} />}
          {currentUser && currentUser.uid === post.userId && (
            <Button size="small" color="error" onClick={() => setDeleteConfirmationOpen(true)}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunityPostCard;