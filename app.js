const textInput = document.querySelector(".footer-search-input");
const titleBtn = document.querySelector(".title");
const newsBtn = document.querySelector(".news");
const askBtn = document.querySelector(".ask");
const showBtn = document.querySelector(".show");
const jobsBtn = document.querySelector(".jobs");
const ol = document.querySelector(".ol");
let more = document.querySelector(".more");
let newsId;
let count = 0;

textInput.addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    location.href = `https://hn.algolia.com/?query=${
      e.target.value
    }&sort=byPopularity&prefix&page=0&dateRange=all&type=story`;
  }
});

function bringId(num) {
  let Artext = num;
  let idArr = [
    "topstories",
    "newstories",
    "askstories",
    "showstories",
    "jobstories"
  ];
  let ourRequest = new XMLHttpRequest();
  ourRequest.open(
    "GET",
    `https://hacker-news.firebaseio.com/v0/${idArr[Artext]}.json?print=pretty`,
    false
  );
  ourRequest.onload = function() {
    newsId = JSON.parse(ourRequest.responseText);
  };
  ourRequest.send();
  let last = count + 30;
  if (last > newsId.length) {
    last = newsId.length;
  }
  draw(count, last, num);
}
bringId(0);

function draw(first, last, num) {
  ol.innerHTML = "";
  for (let i = first; i < last; i++) {
    let ourRequest = new XMLHttpRequest();
    let li = document.createElement("li");
    let img = document.createElement("img");
    img.setAttribute("src", "./img/triangle.png");
    img.style = "width: 15px;";
    let listCount = document.createElement("span");
    listCount.classList.add("list-padding-left");
    let mainTitle = document.createElement("span");
    mainTitle.classList.add("main-title");
    let subTitle = document.createElement("span");
    subTitle.classList.add("sub-title");

    ourRequest.onload = function() {
      let Data = JSON.parse(ourRequest.responseText);
      let currentTime = Number(
        new Date()
          .getTime()
          .toString()
          .substr(0, 10)
      );
      let time = Math.floor(currentTime - Data.time);
      let min = 0;
      let hour = 0;
      let DataTime;
      function calTime() {
        if (time > 60) {
          min++;
          time = time - 60;
          calTime();
        } else return;
      }
      calTime();
      if (min > 60) hour = parseInt(min / 60);
      if (hour) {
        if (hour > 1) {
          DataTime = `${hour} hours`;
        } else DataTime = `${hour} hour`;
      } else {
        DataTime = `${min} minutes`;
      }

      let a = document.createElement("a");
      a.href = `${Data.url}`;
      let url;
      if (num === 2) {
        url =
          '<span class="main-sub-title">' +
          "<a href= " +
          `https://news.ycombinator.com/from?site=${a.hostname}` +
          ">" +
          a.hostname +
          "</a></span>";
      } else {
        url =
          '<span class="main-sub-title">( ' +
          "<a href= " +
          `https://news.ycombinator.com/from?site=${a.hostname}` +
          ">" +
          a.hostname +
          "</a>" +
          " )</span>";
      }
      let title = "<a href= " + `${Data.url}` + ">" + Data.title + "</a>";
      mainTitle.innerHTML = ` <span class="link-title">${title}</span> ${url} <br>`;
      listCount.textContent = `${i + 1}. `;
      link = `https://news.ycombinator.com/hide?id=${Data.id}&goto=newest`;
      linkUser = `https://news.ycombinator.com/user?id=${Data.by}`;
      subTitle.innerHTML =
        Data.score +
        " points by " +
        `<p class="link"><a href=${linkUser}>${Data.by}</a></p>` +
        " " +
        `<p class="link"><a href=${link}>${DataTime}</a></p>` +
        " | " +
        `<p class="link"><a href=${link}>hide</a></p>` +
        " | " +
        `<p class="link"><a href=${link}>${Data.descendants} comments</a></p>`;
    };

    li.appendChild(listCount);
    li.appendChild(img);
    li.appendChild(mainTitle);
    li.appendChild(subTitle);
    ol.appendChild(li);
    ourRequest.open(
      "GET",
      `https://hacker-news.firebaseio.com/v0/item/${
        newsId[i]
      }.json?print=pretty`
    );
    ourRequest.send();
  }
}

more.addEventListener("click", function() {
  count = count + 30;
  let last = count + 30;
  if (last > newsId.length) {
    last = newsId.length;
  }
  draw(count, last);
});
titleBtn.addEventListener("click", function() {
  count = 0;
  bringId(0);
});
newsBtn.addEventListener("click", function() {
  count = 0;
  bringId(1);
});
askBtn.addEventListener("click", function() {
  count = 0;
  bringId(2);
});
showBtn.addEventListener("click", function() {
  count = 0;
  bringId(3);
});
jobsBtn.addEventListener("click", function() {
  count = 0;
  bringId(4);
});
