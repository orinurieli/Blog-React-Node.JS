export const getTagsArray = (Tags) => {
      const tagsArr = [];
      for (const tagName in Tags) {
          tagsArr.push(tagName);
      return tagsArr;
    };
  }