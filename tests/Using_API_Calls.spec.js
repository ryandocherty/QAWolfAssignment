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
https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty

*/

//Top Stories API: https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty
//New Stories API: https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty
//Items API: https://hacker-news.firebaseio.com/v0/item/[ITEM NUMBER].json?print=pretty

test("Hacker News: First 100 articles are sorted by newest to oldest (using APIs)", async ({ page }) => {
  const APIContext = await request.newContext();
  const newStories = await getNewStoryIDs(APIContext);
  const timeStamps = await getTimeStamps(APIContext, newStories);
  const areArticlesSorted = await sortAndCompareTimespamps(timeStamps);

  if (areArticlesSorted) {
    console.log(`All timestamps match!\nThe first 100 articles are likely sorted by newest to oldest.`);
  } else {
    console.log(`Timestamp(s) mismatch found!\nThe articles are unlikely sorted by newest to oldest.`);
  }
});

async function getNewStoryIDs(APIContext) {
  //API call to GET the newest 500 stories (as "Story IDs"):
  const newStories_Response = await APIContext.get(`https://hacker-news.firebaseio.com//v0/newstories.json?print=pretty`);
  expect(newStories_Response.ok()).toBeTruthy();
  const newStories_Response_JSON = await newStories_Response.json();

  console.log(`\nStory ID's:`);
  console.log(newStories_Response_JSON);

  return newStories_Response_JSON;
}

async function getTimeStamps(APIContext, newStories_Response_JSON) {
  let initialTimeStamps = [];

  for (let i = 0; initialTimeStamps.length < 100; i++) {
    //API call to GET the individual article details (they each include a timestamp):
    const storyIDResponse = await APIContext.get(`https://hacker-news.firebaseio.com/v0/item/${newStories_Response_JSON[i]}.json?print=pretty`);
    expect(storyIDResponse.ok()).toBeTruthy();
    const storyIDResponse_JSON = await storyIDResponse.json();

    if (storyIDResponse_JSON && storyIDResponse_JSON.time) {
      //Pushing the "time" properties to an array:
      initialTimeStamps.push(storyIDResponse_JSON.time);
    } else {
      console.warn(`\nStory #${i} has no "time" property!`);
    }
  }
  console.log(`\n"initialTimeStamps" array length: ${initialTimeStamps.length}`);
  console.log(`Initial Time Stamps:`);
  console.log(initialTimeStamps);

  return initialTimeStamps;
}

async function sortAndCompareTimespamps(timeStamps) {
  const sortedTimeStamps = timeStamps.toSorted().toReversed();

  console.log(`sortedTimeStamps:`);
  console.log(sortedTimeStamps);

  let areArticlesSorted = false;
  for (let i = 0; i < timeStamps.length; i++) {
    if (sortedTimeStamps[i] !== timeStamps[i]) {
      console.log(`\nArticle timestamps MISMATCH!\nArticles are unlikely to be in order.`);
      console.log(timeStamps[i], ` | `, sortedTimeStamps[i]);
    } else {
      expect(timeStamps[i] === sortedTimeStamps[i]);
      areArticlesSorted = true;
    }
  }
  console.log(`Articles Sorted?: ${areArticlesSorted}`);
  return areArticlesSorted;
}
