<h3>QA Wolf - Take Home Assignment</h3>

Task:<br>
<i>In this assignment, you will create a script on [Hacker News](https://news.ycombinator.com/) using JavaScript and Microsoft's [Playwright](https://playwright.dev/) framework.</i><br>
<i>Edit the `index.js` file in this project to go to [Hacker News/newest](https://news.ycombinator.com/newest) and validate that EXACTLY the first 100 articles are sorted from newest to oldest.</i><br>

My notes:<br>
[Hacker News](https://news.ycombinator.com/newest) has time-stamps in the CSS for each article.<br>
Every time-stamp has a Class ".a", and an atrribute called "title".<br>
The "title" attribute is what holds the actual raw time-stamps (as a string).<br

My approach:<br>
1. Load the website to show the latest articles (only shows 30 articles at a time).<br>
2. Grab the time-stamps ("title" attributes) for these 30 articles.<br>
3. Push these time-stamps to an array called "timeStamps".<br>
4. While pushing the time-stamps, check for duplicates and that there are no more than 100 items/elements.<br>
5. Click the "Next" link to display the next 30 articles.<br>
6. Repeat steps 2, 3, and 4 until the "timeStamps" array contains 100 items/elements.<br>
7. Create a new array called "sortedTimeStamps".<br>
8. Add the contents of "timeStamps" to the new array, while also sorting the items from newest to oldest.<br>
9. Sequentially compare each element in "timeStamps" to "sortedTimeStamps".<br>
10. Output the appropriate message depending on the outcome.<br>
