import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Button, Skeleton } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import CommunityPostCard from '../components/Community/CommunityPostCard';
import { Link as RouterLink } from 'react-router-dom';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      const cachedPosts = localStorage.getItem('communityPosts');

      if (cachedPosts) {
        const parsedPosts = JSON.parse(cachedPosts);
        setPosts(parsedPosts);
        setLoading(false);

        // Check for new posts
        const postsRef = ref(db, 'communityPosts');
        onValue(postsRef, (snapshot) => {
          const postsData = snapshot.val();
          if (postsData) {
            const postsArray = Object.entries(postsData).map(([id, post]) => ({
              id,
              ...post,
            }));
            if (JSON.stringify(postsArray) !== JSON.stringify(parsedPosts)) {
              setPosts(postsArray);
              localStorage.setItem('communityPosts', JSON.stringify(postsArray));
            }
          }
        });
      } else {
        const postsRef = ref(db, 'communityPosts');
        onValue(postsRef, (snapshot) => {
          const postsData = snapshot.val();
          if (postsData) {
            const postsArray = Object.entries(postsData).map(([id, post]) => ({
              id,
              ...post,
            }));
            setPosts(postsArray);
            localStorage.setItem('communityPosts', JSON.stringify(postsArray));
          }
          setLoading(false);
        });
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      <Button component={RouterLink} to="/community/create-post" variant="contained" sx={{ mb: 2 }}>
        Create New Post
      </Button>
      <Grid container spacing={2}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))
        ) : (
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <CommunityPostCard post={post} onDeletePost={handleDeletePost} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default CommunityPage;