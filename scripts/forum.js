const API_URL = "http://localhost:3000/api/posts";

async function fetchPosts() {
  const res = await fetch(API_URL);
  const posts = await res.json();
  renderPosts(posts);
}

function renderPosts(posts) {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  const rootPosts = posts.filter(p => !p.parentId);

  rootPosts.forEach(p => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <div><strong>${escapeHtml(p.user)}</strong> - ${new Date(p.created).toLocaleString()}</div>
      <p>${escapeHtml(p.text)}</p>
      ${p.image ? `<img src="${p.image}">` : ""}
      <button class="reply-btn" data-id="${p.id}">Responder</button>
      <div class="comments" id="c-${p.id}"></div>
    `;
    feed.appendChild(el);
    renderComments(p, posts);
  });

  document.querySelectorAll(".reply-btn").forEach(btn => {
    btn.addEventListener("click", () => showReplyForm(btn.dataset.id));
  });
}

function renderComments(post, allPosts) {
  const box = document.getElementById(`c-${post.id}`);
  if (!box) return;

  const comments = allPosts.filter(c => c.parentId === post.id);
  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `<strong>${escapeHtml(c.user)}</strong>: ${escapeHtml(c.text)}${c.image ? `<br><img src="${c.image}">` : ""}`;
    box.appendChild(div);
    renderComments(c, allPosts); // recursivo
  });
}

function showReplyForm(parentId) {
  const box = document.getElementById(`c-${parentId}`);
  if (box.querySelector("form")) return;

  const form = document.createElement("form");
  form.innerHTML = `
    <input name="user" placeholder="Seu nome">
    <textarea name="text" placeholder="Responder..."></textarea>
    <input type="file" name="image" accept="image/*">
    <button type="submit">Enviar</button>
  `;
  box.appendChild(form);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    fd.append("id", Date.now().toString(36));
    fd.append("parentId", parentId);
    await fetch(API_URL, { method: "POST", body: fd });
    fetchPosts();
  });
}

document.getElementById("postForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.append("id", Date.now().toString(36));
  await fetch(API_URL, { method: "POST", body: fd });
  e.target.reset();
  fetchPosts();
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[m]));
}

// inicial
fetchPosts();
