const feeds = [
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/businessNews" },
  { name: "Financial Times", url: "https://www.ft.com/?format=rss" },
  { name: "Bloomberg", url: "https://www.bloomberg.com/feed/podcast/etf-report.xml" },
  { name: "El País Economía", url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia" }
];

// Proxy para evitar bloqueo CORS
const proxy = "https://api.allorigins.win/get?url=";

async function loadNews() {
  const container = document.getElementById("news");
  container.innerHTML = "⏳ Cargando noticias...";

  let allArticles = [];

  for (const feed of feeds) {
    const res = await fetch(proxy + encodeURIComponent(feed.url));
    const data = await res.json();

    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");
    const items = xml.querySelectorAll("item");

    items.forEach((item, index) => {
      if (index < 3) {
        allArticles.push({
          title: item.querySelector("title").textContent,
          source: feed.name
        });
      }
    });
  }

  renderNews(allArticles);
}

function renderNews(articles) {
  const container = document.getElementById("news");
  container.innerHTML = "";

  articles.forEach(article => {
    const div = document.createElement("div");
    div.className = "article";
    div.innerHTML = `
      <strong>${article.title}</strong>
      <div class="source">${article.source}</div>
    `;
    container.appendChild(div);
  });
}
