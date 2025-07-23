<h3>QA Wolf - Take Home Assignment</h3>

Task:<br>
<i>In this assignment, you will create a script on [Hacker News](https://news.ycombinator.com/) using JavaScript and Microsoft's [Playwright](https://playwright.dev/) framework.</i><br>
<i>Edit the `index.js` file in this project to go to [Hacker News/newest](https://news.ycombinator.com/newest) and validate that EXACTLY the first 100 articles are sorted from newest to oldest.</i><br>

Approach 1:<br>
Use UI automation on the "title" attributes, which is what holds the actual raw time-stamps (as a string).<br>

Approach 2:<br>
Extract the time-stamps using the APIs:<br> 
https://hacker-news.firebaseio.com/v0/newstories.json<br>
https://hacker-news.firebaseio.com/v0/item/[ITEM_NUMBER].json
