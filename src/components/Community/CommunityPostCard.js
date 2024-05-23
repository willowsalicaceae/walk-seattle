import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RSVPButton from './RSVPButton';
import { ref, onValue, remove } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';

const CommunityPostCard = ({ post, onDeletePost }) => {
  const [trail, setTrail] = useState(null);
  const [user, setUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const currentUser = auth.currentUser;

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

    fetchTrail();
    fetchUser();
  }, [post]);

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

  return (
    <>
      <Card>
        <CardActionArea component={RouterLink} to={`/post/${post.id}`}>
          {trail && (
            <CardMedia component="img" height="140" image={trail.image} alt={trail.name} />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
            {user && (
              <Typography variant="body2" color="text.secondary">
                Posted by: {user.username}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button component={RouterLink} to={`/post/${post.id}`} size="small">
            View Details
          </Button>
          {post.type === 'event' && <RSVPButton postId={post.id} />}
          {currentUser && currentUser.uid === post.userId && (
            <Button size="small" color="error" onClick={() => setDeleteConfirmationOpen(true)}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunityPostCard;