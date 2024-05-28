import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, CardActionArea, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ref, onValue, remove } from 'firebase/database';
import { db, auth } from '../../firebase/firebase';
import RSVPButton from './RSVPButton';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [rsvpUsers, setRSVPUsers] = useState([]);
  const [trail, setTrail] = useState(null);
  const [isRSVP, setIsRSVP] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPost = () => {
      const postRef = ref(db, `communityPosts/${id}`);
      onValue(postRef, (snapshot) => {
        const postData = snapshot.val();
        setPost(postData);
      });
    };

    const fetchRSVPUsers = () => {
      const rsvpRef = ref(db, `users`);
      onValue(rsvpRef, (snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          const rsvpUsersList = Object.entries(usersData)
            .filter(([_, userData]) => userData.rsvps && userData.rsvps[id])
            .map(([_, userData]) => userData);
          setRSVPUsers(rsvpUsersList);
        } else {
          setRSVPUsers([]);
        }
      });
    };

    const fetchTrail = () => {
      if (post && post.trailId) {
        const trailRef = ref(db, `trails/${post.trailId}`);
        onValue(trailRef, (snapshot) => {
          const trailData = snapshot.val();
          setTrail(trailData);
        });
      }
    };

    fetchPost();
    fetchRSVPUsers();
    fetchTrail();
  }, [id]);

  useEffect(() => {
    const fetchRSVPStatus = () => {
      if (currentUser) {
        const rsvpRef = ref(db, `users/${currentUser.uid}/rsvps/${id}`);
        onValue(rsvpRef, (snapshot) => {
          setIsRSVP(snapshot.exists());
        });
      }
    };

    fetchRSVPStatus();
  }, [currentUser, id]);

  const handleDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeletePost = () => {
    const postRef = ref(db, `communityPosts/${id}`);
    remove(postRef)
      .then(() => {
        navigate('/community');
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        {trail && (
          <CardActionArea onClick={() => navigate(`/trail/${trail.id}`)}>
            <CardMedia
              component="img"
              height="300"
              image={trail.image}
              alt={trail.name}
            />
          </CardActionArea>
        )}
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {post.description}
          </Typography>
          {post.type === 'event' && (
            <>
              {trail && (
                <Typography variant="body2" color="text.secondary">
                  Trail: {trail.name}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(post.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {new Date(post.time).toLocaleTimeString()}
              </Typography>
              <RSVPButton postId={post.id} isRSVP={isRSVP} />
              <Typography variant="h6" gutterBottom>
                RSVPs:
              </Typography>
              <List>
                {rsvpUsers.map((user) => (
                  <ListItem key={user.uid}>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          {currentUser && currentUser.uid === post.userId && (
            <Button variant="contained" color="error" onClick={handleDeleteConfirmation}>
              Delete Post
            </Button>
          )}
        </CardContent>
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
    </Container>
  );
};

export default PostDetailsPage;