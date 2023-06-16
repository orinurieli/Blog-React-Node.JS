# Blog Website 

## Prerequisites:

- NPM (version 8 or 9)
- Node (version 18)

## Instructions

- open a terminal and navigate to this project's dir
- run `npm install` (in case of errors check the troubleshooting section of this README)
- run `npm start`
- to check out example tests run `npm test` while your app is running

## Main Features
✅ Implement claps behavior - up to 5 claps per user are allowed

✅ By popularity - clicking on popularity from the menu should change the url and show only posts with higher popularity (claps). Currently clicking on a dropdown item will redirect but no filtering will occur
✅ By tag - Clicking on a tag from the tags list, or from a post's tags should change the url and show only posts with the selected tag. Currently clicking on them does nothing
☀️ Support filtering by both tag and popularity by url, for example `tag=frontend&popularity=20`. If a user clicks on a tag from the tags list, and then on popularity, both should be in the url
✅ Mark the selected tag and/or popularity option using the components' apis, selected tag color should be `primary`.

✅ Clicking on the submit button should not submit anything if required fields are empty. Instead an empty required field should indicate an error
✅ Use actual tags instead of hardcoded ones
✅ Should submit when all required fields are filled, and then redirect to the home page
✅ Limit the title to 100 characters and show an error message for longer values

✅ Add a `My Claps` button to the header menu, should have `data-testid=myClapsBtn`. Clicking on that button will filter only posts that the user clapped for, and not other users. To simulate multiple users, you can just browse the app from different browsers, or clear the user cookie
✅ Provide an ellipsis solution for content longer than 300 characters with a read more button. Read more button should have `data-testid=postContent-readMoreButton`
