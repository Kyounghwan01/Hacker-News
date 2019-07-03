let newsId;
let textInput = document.querySelector(".footer-search-input");
const ol = document.querySelector(".ol");
let ourRequest = new XMLHttpRequest();

textInput.addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    location.href = `https://hn.algolia.com/?query=${
      e.target.value
    }&sort=byPopularity&prefix&page=0&dateRange=all&type=story`;
  }
});

function bringId() {
  ourRequest.open(
    "GET",
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty",
    false
  );
  ourRequest.onload = function() {
    newsId = JSON.parse(ourRequest.responseText);
  };
  ourRequest.send();
}
bringId();

for (let i = 0; i < 30; i++) {
  let li = document.createElement("li");
  let img = document.createElement("img");
  img.setAttribute("class", "tri");
  img.setAttribute("src", "./img/triangle.png");
  img.style = "width: 15px;";
  let mainTitle = document.createElement("span");
  mainTitle.classList.add("main-title");
  let subTitle = document.createElement("span");
  subTitle.classList.add("sub-title");

  ourRequest.open(
    "GET",
    `https://hacker-news.firebaseio.com/v0/item/${newsId[i]}.json?print=pretty`,
    false
  );
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
    let urlData = ((Data.url).split('/'))[2];
    let url = '<span class="main-sub-title">(' + `<a href= ${Data.url}> ${urlData}</a>`+' )</span>'
    
    mainTitle.innerHTML = ` ${Data.title} ${url}<br>`;
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
  ourRequest.send();

  li.appendChild(img);
  li.appendChild(mainTitle);
  li.appendChild(subTitle);
  ol.appendChild(li);
}
