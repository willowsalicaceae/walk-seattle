import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = () => {
      const postRef = ref(db, `communityPosts/${id}`);
      onValue(postRef, (snapshot) => {
        const postData = snapshot.val();
        setPost(postData);
      });
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Card>
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
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PostDetailsPage;