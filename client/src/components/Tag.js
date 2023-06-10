import { Fab } from '@mui/material';

function Tag({ tagName, postId, handleTagClick, selectedTagId }) {
  const dataTestId = postId ? `tag-${tagName}-${postId}` : `tag-${tagName}`;
  const color = selectedTagId === tagName ? 'primary' : 'default';

  return (
    <Fab
      key={tagName}
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={() => handleTagClick(tagName, dataTestId)}
      color={color}
      data-testid={dataTestId}
    >
      {tagName}
    </Fab>
  );
}

export default Tag;
