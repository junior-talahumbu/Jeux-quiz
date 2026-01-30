self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("quiz-cache").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./questions.json"
      ])
    )
  );
});
