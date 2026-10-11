/**
 * GitHub login for the Decap CMS admin (Cloudflare Worker).
 *
 * Decap opens  <worker>/auth  in a popup -> GitHub asks the user to authorize ->
 * GitHub redirects to <worker>/callback -> the worker swaps the code for a token and
 * hands it to the admin window (only to ALLOWED_ORIGIN) with postMessage.
 *
 * Settings -> Variables and Secrets on the Worker:
 *   GITHUB_CLIENT_ID      (Text)    from the GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  (Secret)  from the GitHub OAuth App
 */
const ALLOWED_ORIGIN = "https://icxd162.github.io";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const state = crypto.randomUUID();
      const gh = new URL("https://github.com/login/oauth/authorize");
      gh.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      gh.searchParams.set("redirect_uri", `${url.origin}/callback`);
      gh.searchParams.set("scope", url.searchParams.get("scope") || "repo");
      gh.searchParams.set("state", state);
      return new Response(null, {
        status: 302,
        headers: {
          Location: gh.toString(),
          "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
        },
      });
    }

    if (url.pathname === "/callback") {
      const cookie = request.headers.get("Cookie") || "";
      const saved = (cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/) || [])[1];
      const code = url.searchParams.get("code");
      if (!code || !saved || saved !== url.searchParams.get("state")) {
        return page("error", { message: "Login expired or was tampered with. Close this window and try again." });
      }
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });
      const data = await res.json();
      if (!data.access_token) return page("error", { message: data.error_description || "GitHub did not return a token." });
      return page("success", { token: data.access_token, provider: "github" });
    }

    return new Response("Decap CMS GitHub login is running.", { headers: { "Content-Type": "text/plain" } });
  },
};

// Decap's popup handshake: say "authorizing:github", wait for the admin window to answer,
// then send the result to that window only if it is the portfolio's origin.
function page(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><meta charset="utf-8"><title>Signing in…</title>
<p style="font:15px system-ui;padding:24px">${status === "success" ? "Signed in. You can close this window." : "Sign-in failed. Close this window and try again."}</p>
<script>
  (function () {
    var allowed = ${JSON.stringify(ALLOWED_ORIGIN)};
    function receive(e) {
      if (e.origin !== allowed) return;
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener("message", receive);
      setTimeout(function () { window.close(); }, 300);
    }
    window.addEventListener("message", receive);
    if (window.opener) window.opener.postMessage("authorizing:github", allowed);
  })();
</script>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Set-Cookie": "oauth_state=; Path=/; Max-Age=0" },
  });
}
