import { List } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import TagsCloud from '../components/TagsCloud';
import Post from '../components/Post';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


const baseURL = 'http://localhost:3080';


function Home({
  Posts,
  Tags,
  tagsList,
  handleAddNewTag,
  selectedTagId,
  selectedPopularityQuery,
  userId,
  getTags, 
  getPosts
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [option, setOption] = useState('TEST');
  const [anchorEl, setAnchorEl] = useState(null);

  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity');

  useEffect(() => {
    if (selectedPopularityQuery !== '') {
      setSearchParams({ popularity: `${selectedPopularityQuery}` });
    }
  }, [selectedPopularityQuery, setSearchParams]);

axios.defaults.withCredentials = true;

  ///////////////////////////////////// handle tag click /////////////////////////////////////
  // clicking on add a tag button +
  // couldnt get the tag name from select component
  const handleAddTagClick = (event, selectedPostId, tagName="TEST") => {
    setAnchorEl(event.currentTarget);
    axios
      .post(
        `${baseURL}/post/tagName`,
         {
          post: { newId: selectedPostId, tag: tagName },
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        //console.log({response});
      })
      .catch((error) => {
        console.log(error);
      });

    getTags();    
  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    setOption(selectedOption);
  };

  // clicking on tag itself
  const handleTagClick = (tagName, tagId) => {
    // filter array of posts based on the tag

    axios
      .post(
        `${baseURL}/posts/byTag`,
         {
          tag: { tagId: tagId, tagName: tagName },
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });

      getPosts();
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  return (
    <div className='container'>
      <List sx={{ width: '650px' }}>
        {Posts.map((post) => (
          <Post
            postId={post.id}
            postTitle={post.title}
            postContent={post.content}
            postClaps={post.claps}
            Tags={Tags}
            handleAddTagClick={handleAddTagClick}
            userId={userId}
            handleTagClick={handleTagClick}
            selectedTagId={selectedTagId}
            option={option}
            getPosts={getPosts}
          />
        ))}
      </List>
      <TagsCloud
        tagsList={tagsList}
        handleAddNewTag={handleAddNewTag}
        selectedTagId={selectedTagId}
        handleTagClick={handleTagClick}
      />
      <FloatingMenu
        menuOptions={tagsList}
        anchorElement={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
}

export default Home;
