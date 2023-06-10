import { useState } from 'react';
import axios from 'axios';

import {
  ListItem,
  ListItemButton,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import ClappingIcon from './assets/ClappingIcon';
import AddTagButton from './AddTagButton';
import Tag from './Tag';

const baseURL = 'http://localhost:3080';

function Post({
  postId,
  postTitle,
  postContent,
  postClaps,
  Tags,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  userId,
  option,
  getPosts
}) {
  const getTagsByPostId = (postID) => {
    const tagsArr = [];
    for (const tagName in Tags) {
      // if the post id field is true, push to array
      if (Tags[tagName][postID]) {
        tagsArr.push(tagName);
      }
    }
    return tagsArr;
  };

  const MAX_CLAPS = 5;

  const [claps, setClaps] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const tagsNameArr = getTagsByPostId(postId);
  const isTag = tagsNameArr.length > 0 ? true : false;
  const didUserClappedOnPost = false;

  const handleClapChange = () => {
    if (claps >= MAX_CLAPS) return;
    setClaps(claps + 1);

    axios
      .post(
        `${baseURL}/post/claps`,
        {
          post: { postId: postId },
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        //console.log({response});
      })
      .catch((error) => {
        console.log(error);
      });

    getPosts();
  };

  const handleReadMoreClick = () => {
    setShowFullContent(true);
  };

  return (
    <ListItem
      alignItems='flex-start'
      key={postId}
      className='post'
      data-testid={`post-${postId}`}
    >
      <Card className='post'>
        <ListItemButton disableGutters>
          <CardContent>
            <Typography
              variant='h5'
              gutterBottom
              data-testid={`postTitle-${postId}`}
            >
              {postTitle}
            </Typography>
            <Typography
              variant='body1'
              gutterBottom
              data-testid={`postContent-${postId}`}
            >
              {showFullContent ? postContent : `${postContent.slice(0, 100)}...`}
            </Typography>
            {(!showFullContent && postContent.length > 300) && (
              <button onClick={handleReadMoreClick}>Read More</button>
            )}
          </CardContent>
        </ListItemButton>
        <CardActions>
          <AddTagButton
            dataTestId={`postAddTagBtn-${postId}`}
            onClick={(e) => handleAddTagClick(e, postId, option)}
          />
          {isTag &&
            tagsNameArr.map((tagName) => (
              <Tag
                tagName={tagName}
                postId={postId}
                handleTagClick={handleTagClick}
                selectedTagId={selectedTagId}
              />
            ))}
          <IconButton
            aria-label='clapping'
            size='small'
            data-testid={`postClapsBtn-${postId}`}
            onClick={handleClapChange}
          >
            <ClappingIcon
              didUserClappedOnPost={didUserClappedOnPost}
              dataTestId={`postClappingIcon-${postId}`}
            />
          </IconButton>
          <Typography
            variant='string'
            data-testid={`postClapsNum-${postId}`}
          >
            {postClaps}
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
