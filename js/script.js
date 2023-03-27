const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optArticleAuthorSelector = '.post-author',
  optAuthorsListSelector = '.authors.list';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
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

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
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

function calculateTagsParams(tags) {
  console.log(tags);
  const params = {
    min: 999999,
    max: 0
  };

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  console.log(params);
  return params;
}
function calculateTagClass(count, params) {
  let tagSize = optCloudClassPrefix;
  if (count == params.max) {
    tagSize += optCloudClassCount;
  } else if (count == params.min) {
    tagSize += params.min;
  } else {
    tagSize += Math.round(count * (optCloudClassCount / params.max));
  }
  return tagSize;
}
function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
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
      //console.log(tag);
      /* generate HTML of the link */
      //const tagHTML = '<li><a href="#tag-' + tag + '"><p>' + tag + '</p></a></li>';

      const tagHTMLData = { tag: tag };
      const tagHTML = templates.tagLink(tagHTMLData);

      /* add generated code to HTML variable */
      html = html + tagHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */

    tagList.innerHTML = html;
  }

  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  //New
  const allTagsData = { tags: [] };

  for (let tag in allTags) {
    const tagClass = calculateTagClass(allTags[tag], tagsParams);
    //allTagsHTML += '<li><a class = "' + tagClass + '"href="#tag-' + tag + '"><p>' + tag + ' </p></a></li>';
    //New
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: tagClass
    });
    //console.log(tag);
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  //New
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
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
  //console.log(href);
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
  const linksToTags = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let linkToTag of linksToTags) {
    /* add class active */
    linkToTag.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
    //console.log('added event listener');
  }
  /* END LOOP: for each link */
}
addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  let allAuthors = {};

  //let allAuthorsHTML = '';
  const allAuthorsData = { authors: [] };
  const authorList = document.querySelector(optAuthorsListSelector);

  for (let article of articles) {
    const author = article.querySelector(optArticleAuthorSelector);
    /* get Author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    //stare przypisanie html
    //author.innerHTML = '<a href="#author-' + articleAuthor + '"><p>' + articleAuthor + ' </p></a>';

    const authorHTMLData = { articleAuthor: articleAuthor };
    author.innerHTML = templates.authorLink(authorHTMLData);
    if (!allAuthors[articleAuthor]) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allAuthorsHTML += '<li><a href="#author-' + author + '"><p>' + author + ' (' + allAuthors[author] + ') </p></a></li>';
    //new
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    });
  }

  //authorList.innerHTML = allAuthorsHTML;
  authorList.innerHTML = templates.authorListLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  console.log('click handler runed');
  event.preventDefault();
  const clickedElement = this;
  console.log('clickedElement:', clickedElement);
  console.log('Author was clicked!');
  const hrefAuthor = clickedElement.getAttribute('href');
  const author = hrefAuthor.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
    console.log('Removed active class from author');
  }
  const linkAuthors = document.querySelectorAll('a[href="' + hrefAuthor + '"]');

  for (let linkAuthor of linkAuthors) {
    linkAuthor.classList.add('active');
    console.log('Addend active class to author');
  }
  //generateTitleLinks('[data-authors="' + author + '"]');
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authors = document.querySelectorAll('a[href^="#author-"]');

  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
    //console.log('added event listener');
  }
}
addClickListenersToAuthors();