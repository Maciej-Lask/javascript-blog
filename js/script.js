const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  //console.log(event);
  /* remove class 'active' from all article links  [DONE]*/
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link Work in progress*/
  console.log('clickedElement:', clickedElement);
  /* remove class 'active' from all articles [DONE] */
  const activeArticles = document.querySelectorAll('.posts article.active');
  clickedElement.classList.add('active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};
function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(customSelector);
  console.log(optArticleSelector);
  /* for each article */

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);
    /* insert link into html variable */
    html = html + linkHTML;
    //console.log(html);
  }
  /* insert link into titleList */
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  //console.log(links);
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();
function generateTags() {
  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
    //console.log(tagList);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);
    /* START LOOP: for each tag */
    /* for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);
      /* generate HTML of the link */
      const tagHTML = '<li><a href="#tag-' + tag + '"><p>' + tag + '</p></a></li>';
      /* add generated code to HTML variable */
      html = html + tagHTML;
      //console.log(html);
    }
    /* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  }

  /* END LOOP: for every article: */
}
generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('clickedElement:', clickedElement);
  console.log('Tag was clicked!');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const emptyTags = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let emptyTag of emptyTags) {
    /* add class active */
    emptyTag.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
//Old broken function
//function addClickListenersToTags() {
//  /* find all links to tags */
//  const tags = document.querySelectorAll('a.active[href^="#tag-"]');
//  /* START LOOP: for each link */
//  for (let tag of tags) {
//    /* add tagClickHandler as event listener for that link */
//    tag.addEventListener('click', tagClickHandler);
//    console.log('added event listener');
//  }
//  /* END LOOP: for each link */
//}
function addClickListenersToTags() {
  /* find all links to tags */
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
    console.log('added event listener');
  }
  /* END LOOP: for each link */
}
addClickListenersToTags();