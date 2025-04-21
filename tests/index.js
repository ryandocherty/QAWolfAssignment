import { test, expect, chromium } from "@playwright/test";

/*
Author: Ryan Docherty
LinkedIn: www.linkedin.com/in/ryansdocherty/


In this test, I want to assert that the first 100 articles 
on "news.ycombinator.com/newest" are sorted by newest to oldest.

The website has time-stamps in the CSS for each article.
Every time-stamp has a Class ".a", and an atrribute called "title".
The "title" attribute is what holds the actual raw time-stamps (as a string).

My approach:
1. Load the website to show the latest articles (only shows 30 articles at a time).
2. Grab the time-stamps ("title" attributes) for these first 30 articles.
3. Push these time-stamps to an array called "timeStamps".
4. While pushing the time-stamps, check for duplicates and that there are no more than 100 items.
5. Click the "Next" link to display the next 30 atricles.
6. Repeat steps 2, 3, and 4 until the "timeStamps" array contains 100 items.
8. Create a new array called "sortedTimeStamps".
9. Add the contents of "timeStamps" to the new array, while also sorting the items (time-stamps) from newest to oldest.
10. Compare each element sequentially in "timeStamps" to "sortedTimeStamps".
11. Output the appropriate message depending on the outcome.
*/

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  //The website only shows 30 articles at a time.
  //I'm going to need to click the "More" link to show more.
  //Locator for the "More" link:
  const moreLink = page.locator(`.morelink`);

  //Initialise an array to eventually hold the raw time-stamps:
  const timeStamps = [];

  while (timeStamps.length < 100) {
    /*
    The "$$eval" method evaluates a function on multiple elements in the browser context,
    which is useful here because I need to ultimately grab 100 elements (time-stamps).

    The 1st parameter provided is the CSS selector ".age" (the associated Class name of each time-stamp).
    The 2nd parameter is a function that uses the ".age" Class to retrieve the
    associated attributes called "title" (the attribute name of the actual raw time-stamps).
    Finally I'm then mapping these "title" attributes to the freshTimeStamps array.
    */
    const freshTimeStamps = await page.$$eval(`.age`, (elements) => {
      return elements.map((elements) => elements.getAttribute(`title`));
    });

    /*
    Loop through the freshTimeStamps array:
    1. Check the current timeStamp does not exist in the final timeStamps array to avoid duplication.
    2. Check that the timeStamps array contains no more than 100 elements.
    3. If both conditions are satisfied, push current timeStamp to the final timeStamps array:
    */
    freshTimeStamps.forEach((timeStamp) => {
      if (!timeStamps.includes(timeStamp) && timeStamps.length < 100) {
        timeStamps.push(timeStamp);
      }
    });

    //Click "More" to load the next 30 articles:
    await moreLink.click();
  }

  console.log(`"timeStamps" array length: ${timeStamps.length}`);
  console.log(`\nInitial timestamps:`);
  console.log(timeStamps);

  //Using toSorted() to create a NEW sorted array.
  //However, toSorted() was sorting the time-stamps in accending order (oldest article first),
  //but the raw time-stamps are in decending order (newest article first).
  //So if I reverse-sort the raw time-stamps using toReversed(), the sorted time-stamps should be
  //in the same format as the raw time-stamps, plus sorted programatically.
  const sortedTimeStamps = timeStamps.toSorted().toReversed();

  console.log(`\nSorted timestamps:`);
  console.log(sortedTimeStamps);

  //Loop through the timeStamps and sortedTimeStamps arrays and compare each element.
  //I'm storing the result in boolean form, so that I can output a simple "true/false" later on.
  const compareTimestamps = () => {
    let areArticlesSorted = false;
    for (let i = 0; i < timeStamps.length; i++) {
      if (timeStamps[i] !== sortedTimeStamps[i]) {
        console.log(`\nArticle timestamps MISMATCH!\nArticles are unlikely to be in order.`);
        console.log(timeStamps[i], ` | `, sortedTimeStamps[i]);
      } else {
        //Assert that each timestamp matches:
        expect(timeStamps[i] === sortedTimeStamps[i]);

        //Only set "areArticlesSorted" to true if no mismatches were found:
        areArticlesSorted = true;
      }
    }
    //If true, no time-stamp mismatches were found, meaning the articles are sorted.
    //If false, time-stamp mismatches were found, meaning the articles aren't sorted.
    return areArticlesSorted;
  };

  //Assert that the result of compareTimestamps() is true:
  expect(compareTimestamps);

  //Output a message depending on the result of compareTimestamps():
  if (compareTimestamps()) {
    console.log(`All timestamps match!\nThe first 100 articles are likely sorted by newest to oldest.`);
  } else {
    console.log(`Timestamp(s) mismatch found!\nThe articles are unlikely sorted by newest to oldest.`);
  }

  await context.close();
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
