// src/pages/CommunityPage.js
import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import CommunityPostCard from '../components/Community/CommunityPostCard';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      const postsRef = ref(db, 'communityPosts');
      onValue(postsRef, (snapshot) => {
        const postsData = snapshot.val();
        if (postsData) {
          const postsArray = Object.entries(postsData).map(([id, post]) => ({
            id,
            ...post,
          }));
          setPosts(postsArray);
        }
      });
    };

    fetchPosts();
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <CommunityPostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CommunityPage;