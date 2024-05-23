import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Button } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import RSVPButton from './RSVPButton';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [rsvpUsers, setRSVPUsers] = useState([]);
  const [trail, setTrail] = useState(null);

  useEffect(() => {
    const fetchPost = () => {
      const postRef = ref(db, `communityPosts/${id}`);
      onValue(postRef, (snapshot) => {
        const postData = snapshot.val();
        setPost(postData);
      });
    };

    const fetchRSVPUsers = () => {
      const rsvpRef = ref(db, `eventRSVPs/${id}`);
      onValue(rsvpRef, (snapshot) => {
        const rsvpData = snapshot.val();
        if (rsvpData) {
          const userIds = Object.keys(rsvpData);
          Promise.all(
            userIds.map((userId) => {
              const userRef = ref(db, `users/${userId}`);
              return onValue(userRef, (userSnapshot) => {
                return userSnapshot.val();
              });
            })
          ).then((users) => {
            setRSVPUsers(users);
          });
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
  }, [id, post]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        {trail && (
          <>
            <CardMedia
              component={RouterLink}
              to={`/trail/${trail.id}`}
              height="200"
              image={trail.image}
              alt={trail.name}
            />
            <CardContent>
              <Typography variant="h6" component={RouterLink} to={`/trail/${trail.id}`}>
                {trail.name}
              </Typography>
            </CardContent>
          </>
        )}
        <CardContent>
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.description}
          </Typography>
          {post.type === 'event' && (
            <>
              <Typography variant="body2" color="text.secondary">
                Trail: {post.trailId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(post.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {new Date(post.time).toLocaleTimeString()}
              </Typography>
              <RSVPButton postId={post.id} />
              <Typography variant="h6">RSVPs:</Typography>
              <List>
                {rsvpUsers.map((user) => (
                  <ListItem key={user.uid}>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostDetailsPage;