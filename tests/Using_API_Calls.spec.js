import { test, expect, request } from "@playwright/test";

/*
Author: Ryan Docherty
LinkedIn: https://linkedin.com/in/ryansdocherty/
GitHub: https://github.com/ryandocherty


In this test, I want to assert that the first 100 articles 
on "news.ycombinator.com/newest" are sorted by newest to oldest.

I'll utilise API calls for this test.
1. Make API call to GET the top 500 storyID's (topStoriesResponse).
2. Loop through topStoriesResponse, grab the storyIDs, then use them to make 100 API GET calls (storyIDResponse)
3. Loop through storyIDResponse, grab the "time" properties.
4. Push the timestamps to an array.
5. Duplicate the array, then sort the duplicated array.
6. Compare arrays.
*/

//Top Stories API: https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty
//Items API: https://hacker-news.firebaseio.com/v0/item/[ITEM NUMBER].json?print=pretty

test("Hacker News: First 100 articles are sorted by newest to oldest (using APIs)", async ({ page }) => {
  const APIContext = await request.newContext();

  //API call to GET the top 500 stories (as "Story IDs"):
  const topStoriesResponse = await APIContext.get(`https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`);
  expect(topStoriesResponse.ok()).toBeTruthy();

  //This returns an array of Story IDs
  //E.g. [44604050, 44603066, 44604257,...]
  const topStoriesResponse_JSON = await topStoriesResponse.json();

  console.log(`\nStory ID's:`);
  console.log(topStoriesResponse_JSON);

  let initialTimeStamps = [];

  for (let i = 0; i < 100; i++) {
    //API call to GET the individual article details (includes a timestamp):
    const storyIDResponse = await APIContext.get(`https://hacker-news.firebaseio.com/v0/item/${topStoriesResponse_JSON[i]}.json?print=pretty`);
    expect(storyIDResponse.ok()).toBeTruthy();
    const storyIDResponse_JSON = await storyIDResponse.json();

    if (storyIDResponse_JSON && storyIDResponse_JSON.time) {
      //Pushing the "time" properties to an array:
      initialTimeStamps.push(storyIDResponse_JSON.time);
    } else {
      console.warn(`\nStory #${i} has no "time" property!`);
    }
  }
  console.log(`\nInitial Time Stamps:`);
  console.log(initialTimeStamps);
});
