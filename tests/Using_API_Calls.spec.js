import { test, expect, request } from "@playwright/test";

/*
Author: Ryan Docherty
LinkedIn: https://linkedin.com/in/ryansdocherty/
GitHub: https://github.com/ryandocherty


In this test, I want to assert that the first 100 articles 
on "news.ycombinator.com/newest" are sorted by newest to oldest.

I'll utilise API calls for this test.
1. Make API call to GET the newest 500 storyID's (newStories_Response).
2. Loop through topStoriesResponse, grab the storyIDs, then use them to make 100 API GET calls (storyIDResponse)
3. Loop through storyIDResponse, grab the "time" properties.
4. Push the timestamps to an array.
5. Duplicate the array, then programatically sort the duplicated array.
6. Compare arrays.
7. Output the appropriate message (sorted/not sorted)

I need to use this API:
This API returns story IDs sorted by submission time, newest first — matching the behavior of news.ycombinator.com/newest.
https://hacker-news.firebaseio.com/v0/newstories.json?

*/

//Top Stories API: https://hacker-news.firebaseio.com/v0/topstories.json?
//New Stories API: https://hacker-news.firebaseio.com/v0/newstories.json?
//Items API: https://hacker-news.firebaseio.com/v0/item/[ITEM NUMBER].json?

test("Hacker News: First 100 articles are sorted by newest to oldest (using APIs)", async () => {
  const APIContext = await request.newContext();
  const newStories = await getNewStoryIDs(APIContext);
  const timeStamps = await getTimeStamps(APIContext, newStories);
  const areArticlesSorted = sortAndCompareTimespamps(timeStamps);
  console.log(`\nAre the Articles Sorted?: ${areArticlesSorted}`);
  expect(areArticlesSorted).toBe(true);
});

async function getNewStoryIDs(APIContext) {
  //API call to GET the newest 500 stories (as "Story IDs"):
  const newStories_Response = await APIContext.get(`https://hacker-news.firebaseio.com//v0/newstories.json`);
  expect(newStories_Response.ok()).toBeTruthy();
  const newStories_Response_JSON = await newStories_Response.json();

  console.log(`\nFetched ${newStories_Response_JSON.length} new Story IDs.`);
  return newStories_Response_JSON;
}

async function getTimeStamps(APIContext, newStories_Response_JSON) {
  let initialTimeStamps = [];

  for (let i = 0; initialTimeStamps.length < 100; i++) {
    //API call to GET the individual article details (they each (should) include a timestamp):
    const storyIDResponse = await APIContext.get(`https://hacker-news.firebaseio.com/v0/item/${newStories_Response_JSON[i]}.json`);
    expect(storyIDResponse.ok()).toBeTruthy();
    const storyIDResponse_JSON = await storyIDResponse.json();

    if (storyIDResponse_JSON && storyIDResponse_JSON.time) {
      //Pushing the "time" properties to an array:
      initialTimeStamps.push(storyIDResponse_JSON.time);
    } else {
      console.warn(`\nStory #${i} has no "time" property!`);
    }
  }
  console.log(`\nFetched ${initialTimeStamps.length} time stamps.`);
  return initialTimeStamps;
}

function sortAndCompareTimespamps(timeStamps) {
  const sortedTimeStamps = timeStamps.toSorted().toReversed();
  console.log(`\nTime stamps sorted.`);
  console.log(`\nComparing time stamps...`);

  let areArticlesSorted = false;
  for (let i = 0; i < timeStamps.length; i++) {
    if (sortedTimeStamps[i] !== timeStamps[i]) {
      console.log(`\nArticle timestamps MISMATCH!\nArticles are unlikely to be in order.`);
      console.log(timeStamps[i], ` | `, sortedTimeStamps[i]);
    } else {
      areArticlesSorted = true;
    }
  }
  return areArticlesSorted;
}
