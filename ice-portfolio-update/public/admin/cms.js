/* Admin extensions for Decap CMS (loaded by /admin/index.html).
 *
 * 1. "imagecrop" widget: pick/upload an image, then drag to choose the focal point and
 *    slide to zoom. Saved as "path#x=40&y=25&z=1.3" so the site shows the same framing.
 * 2. Live previews of the real site design for the main sections.
 *
 * Uses Decap's globals: CMS, h (React.createElement), createClass.
 */
(function () {
  var CMS = window.CMS;
  var h = window.h;
  var createClass = window.createClass;
  // The site may live under a sub-path (GitHub Pages: /ice-portfolio/admin/), so "/uploads/..." paths
  // stored in the content need that prefix to load in the preview.
  var BASE = location.pathname.replace(/\/admin(\/.*)?$/, "");
  function withBase(p) { return p && p.indexOf("/uploads/") === 0 ? BASE + p : p; }

  /* ---------- crop helpers (mirror lib/crop.ts) ---------- */
  function parseCrop(src) {
    var raw = typeof src === "string" ? src : "";
    var i = raw.indexOf("#");
    if (i < 0) return { url: raw, has: false, x: 50, y: 50, z: 1 };
    var p = new URLSearchParams(raw.slice(i + 1));
    function num(k, d, lo, hi) {
      if (!p.has(k)) return d;
      var v = Number(p.get(k));
      return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d;
    }
    return { url: raw.slice(0, i), has: p.has("x") || p.has("y") || p.has("z"), x: num("x", 50, 0, 100), y: num("y", 50, 0, 100), z: num("z", 1, 1, 4) };
  }
  function buildCrop(url, x, y, z) {
    if (!url) return "";
    if (Math.round(x) === 50 && Math.round(y) === 50 && z === 1) return url;
    return url + "#x=" + Math.round(x) + "&y=" + Math.round(y) + "&z=" + Math.round(z * 100) / 100;
  }
  function cropStyle(c) {
    if (!c.has) return {};
    return { objectPosition: c.x + "% " + c.y + "%", transform: c.z !== 1 ? "scale(" + c.z + ")" : undefined, transformOrigin: c.x + "% " + c.y + "%" };
  }
  // Slides can be short looping videos (.mp4/.webm) as well as images; render the right element for each.
  var VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
  function mediaEl(props) {
    var url = (props.src || "").split("#")[0];
    if (VIDEO_RE.test(url)) return h("video", Object.assign({}, props, { muted: true, autoPlay: true, loop: true, playsInline: true }));
    return h("img", props);
  }
  function assetUrl(getAsset, path, field) {
    if (!path) return "";
    if (/^(https?:)?\/\//.test(path) || path.indexOf("blob:") === 0 || path.indexOf("data:") === 0) return path;
    try {
      // Files sitting directly in /uploads may have been uploaded moments ago and not be
      // on the live site yet. Asking Decap by file name resolves them from its media store
      // (the in-browser upload, or the repository), so the crop frame shows them immediately.
      var m = /^\/uploads\/([^/]+)$/.exec(path);
      var a = getAsset ? getAsset(m ? m[1] : path, field) : null;
      var s = a ? String(a) : "";
      return s && s !== "[object Object]" && s.indexOf("/uploads/") !== 0 ? s : withBase(s && s !== "[object Object]" ? s : path);
    } catch (e) {
      return withBase(path);
    }
  }

  /* ---------- styles for the widget (admin UI) ---------- */
  var css = [
    ".ic-wrap{display:grid;gap:12px;padding:4px 0}",
    ".ic-frame{position:relative;overflow:hidden;border-radius:10px;background:#1b1b1d;cursor:grab;touch-action:none;user-select:none;max-width:520px}",
    ".ic-frame:active{cursor:grabbing}",
    ".ic-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none}",
    ".ic-dot{position:absolute;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;border:2px solid #fff;background:rgba(255,63,30,.85);box-shadow:0 0 0 2px rgba(0,0,0,.35);pointer-events:none}",
    ".ic-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px);background-size:33.333% 33.333%}",
    ".ic-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
    ".ic-btn{border:0;border-radius:999px;padding:8px 14px;font:500 13px/1 system-ui,sans-serif;cursor:pointer;background:#e8e8ec;color:#111}",
    ".ic-btn:hover{background:#dcdce2}",
    ".ic-btn.primary{background:#ff3f1e;color:#fff}",
    ".ic-btn.danger{background:#fde4df;color:#b42a12}",
    ".ic-btn.on{background:#111;color:#fff}",
    ".ic-zoom{display:flex;align-items:center;gap:10px;font:13px system-ui,sans-serif;color:#444;max-width:520px}",
    ".ic-zoom input{flex:1;accent-color:#ff3f1e}",
    ".ic-hint{font:12px/1.4 system-ui,sans-serif;color:#666}",
    ".ic-url{display:flex;gap:8px;max-width:520px}",
    ".ic-url input{flex:1;border:1px solid #c9c9cf;border-radius:8px;padding:8px 10px;font:13px system-ui,sans-serif}",
    ".ic-empty{display:grid;place-items:center;gap:10px;border:2px dashed #c9c9cf;border-radius:10px;padding:28px;max-width:520px;color:#666;font:13px system-ui,sans-serif}",
  ].join("");
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var ASPECTS = [
    { id: "16/9", label: "16:9" },
    { id: "9/16", label: "9:16" },
    { id: "1/1", label: "1:1" },
    { id: "4/5", label: "4:5" },
    { id: "3/1", label: "3:1" },
  ];

  /* ---------- imagecrop control ---------- */
  var ImageCropControl = createClass({
    getInitialState: function () {
      var f = this.props.field;
      var aspect = (f && f.get && f.get("aspect")) || "16/9";
      this.controlID = "ic-" + Math.random().toString(36).slice(2);
      return { aspect: aspect, urlInput: "", showUrl: false };
    },
    shouldComponentUpdate: function (nextProps, nextState) {
      // Decap's wrapper defers to this; re-render on our own state, a new value,
      // or when the media library hands back a picked file for this control.
      if (nextState && nextState !== this.state) return true;
      if (this.props.value !== nextProps.value || this.props.getAsset !== nextProps.getAsset) return true;
      if (this.props.classNameWrapper !== nextProps.classNameWrapper) return true;
      var mp = nextProps.mediaPaths && nextProps.mediaPaths.get ? nextProps.mediaPaths.get(this.controlID) : null;
      return !!mp && parseCrop(nextProps.value).url !== mp;
    },
    componentDidUpdate: function () {
      var mp = this.props.mediaPaths;
      var picked = mp && mp.get ? mp.get(this.controlID) : null;
      if (!picked) return;
      var path = typeof picked === "string" ? picked : picked.get ? picked.get(0) : String(picked);
      var current = parseCrop(this.props.value).url;
      if (path && path !== current) this.props.onChange(path);
      else if (path === current && this.props.onRemoveInsertedMedia) this.props.onRemoveInsertedMedia(this.controlID);
    },
    componentWillUnmount: function () {
      if (this.props.onRemoveMediaControl) this.props.onRemoveMediaControl(this.controlID);
    },
    openLibrary: function (e) {
      e.preventDefault();
      var field = this.props.field;
      this.props.onOpenMediaLibrary({
        controlID: this.controlID,
        forImage: true,
        privateUpload: field.get("private"),
        value: parseCrop(this.props.value).url,
        allowMultiple: false,
        config: field.getIn ? field.getIn(["media_library", "config"]) : undefined,
        field: field,
      });
    },
    setCrop: function (x, y, z) {
      var c = parseCrop(this.props.value);
      this.props.onChange(buildCrop(c.url, x, y, z));
    },
    onPointerDown: function (e) {
      var frame = e.currentTarget;
      var rect = frame.getBoundingClientRect();
      var c = parseCrop(this.props.value);
      var start = { px: e.clientX, py: e.clientY, x: c.x, y: c.y };
      var self = this;
      frame.setPointerCapture(e.pointerId);
      function move(ev) {
        // Dragging the picture right reveals more of its left side, like panning in a photo app.
        var dx = ((ev.clientX - start.px) / rect.width) * 100 / c.z;
        var dy = ((ev.clientY - start.py) / rect.height) * 100 / c.z;
        self.setCrop(Math.min(100, Math.max(0, start.x - dx)), Math.min(100, Math.max(0, start.y - dy)), c.z);
      }
      function up() {
        frame.removeEventListener("pointermove", move);
        frame.removeEventListener("pointerup", up);
        frame.removeEventListener("pointercancel", up);
      }
      frame.addEventListener("pointermove", move);
      frame.addEventListener("pointerup", up);
      frame.addEventListener("pointercancel", up);
    },
    render: function () {
      var self = this;
      var c = parseCrop(this.props.value);
      var src = assetUrl(this.props.getAsset, c.url, this.props.field);

      if (!c.url) {
        return h("div", { className: "ic-wrap" },
          h("div", { className: "ic-empty" },
            h("div", null, "ยังไม่มีรูป"),
            h("div", { className: "ic-row" },
              h("button", { className: "ic-btn primary", onClick: this.openLibrary }, "อัปโหลด / เลือกรูป"),
              h("button", { className: "ic-btn", onClick: function (e) { e.preventDefault(); self.setState({ showUrl: !self.state.showUrl }); } }, "ใส่ลิงก์รูป")
            )
          ),
          this.state.showUrl && this.renderUrl()
        );
      }

      return h("div", { className: "ic-wrap" },
        h("div", { className: "ic-row" },
          ASPECTS.map(function (a) {
            return h("button", {
              key: a.id,
              className: "ic-btn" + (self.state.aspect === a.id ? " on" : ""),
              onClick: function (e) { e.preventDefault(); self.setState({ aspect: a.id }); },
              title: "ดูตัวอย่างในกรอบ " + a.label,
            }, a.label);
          })
        ),
        h("div", {
          className: "ic-frame",
          style: { aspectRatio: this.state.aspect, width: this.state.aspect === "9/16" ? "260px" : "100%" },
          onPointerDown: this.onPointerDown,
          role: "application",
          "aria-label": "ลากเพื่อเลื่อนตำแหน่งรูป",
        },
          mediaEl({ src: src, alt: "", style: { objectPosition: c.x + "% " + c.y + "%", transform: "scale(" + c.z + ")", transformOrigin: c.x + "% " + c.y + "%" } }),
          h("div", { className: "ic-grid" }),
          h("div", { className: "ic-dot", style: { left: c.x + "%", top: c.y + "%" } })
        ),
        h("label", { className: "ic-zoom" },
          "ซูม",
          h("input", {
            type: "range", min: 1, max: 3, step: 0.05, value: c.z,
            onChange: function (e) { self.setCrop(c.x, c.y, Number(e.target.value)); },
          }),
          h("span", null, Math.round(c.z * 100) + "%")
        ),
        h("div", { className: "ic-hint" }, "ลากรูปเพื่อเลือกส่วนที่ต้องการให้เห็น จุดสีส้มคือจุดโฟกัส ปุ่มขนาดด้านบนใช้ดูตัวอย่างเท่านั้น"),
        h("div", { className: "ic-row" },
          h("button", { className: "ic-btn", onClick: this.openLibrary }, "เปลี่ยนรูป"),
          h("button", { className: "ic-btn", onClick: function (e) { e.preventDefault(); self.setCrop(50, 50, 1); } }, "รีเซ็ตการครอป"),
          h("button", { className: "ic-btn danger", onClick: function (e) { e.preventDefault(); if (self.props.onClearMediaControl) self.props.onClearMediaControl(self.controlID); self.props.onChange(""); } }, "ลบรูป")
        )
      );
    },
    renderUrl: function () {
      var self = this;
      return h("div", { className: "ic-url" },
        h("input", {
          type: "url", placeholder: "https://...", value: this.state.urlInput,
          onChange: function (e) { self.setState({ urlInput: e.target.value }); },
        }),
        h("button", {
          className: "ic-btn primary",
          onClick: function (e) { e.preventDefault(); if (self.state.urlInput) { self.props.onChange(self.state.urlInput.trim()); self.setState({ urlInput: "", showUrl: false }); } },
        }, "ใช้ลิงก์นี้")
      );
    },
  });

  var ImageCropPreview = function (props) {
    var c = parseCrop(props.value);
    if (!c.url) return null;
    return mediaEl({ src: assetUrl(props.getAsset, c.url, props.field), style: Object.assign({ maxWidth: "100%", objectFit: "cover" }, cropStyle(c)) });
  };

  CMS.registerWidget("imagecrop", ImageCropControl, ImageCropPreview);

  /* ---------- live previews (use the site's real stylesheet) ---------- */
  function toJS(v) { return v && v.toJS ? v.toJS() : v; }
  function img(getAsset, path, cls, extraStyle) {
    var c = parseCrop(path);
    if (!c.url) return null;
    return mediaEl({ src: assetUrl(getAsset, c.url), className: cls, style: Object.assign({}, extraStyle || {}, cropStyle(c) || {}), alt: "" });
  }
  function shell(children) {
    return h("div", { className: "bg-ink text-paper", style: { minHeight: "100vh", fontFamily: "system-ui, sans-serif" } }, children);
  }
  function head(title, intro) {
    return h("div", { className: "mx-auto flex max-w-[44rem] flex-col items-center text-center" },
      h("h2", { className: "text-4xl leading-[1.1] font-medium tracking-[-0.04em] text-paper" }, title || ""),
      intro ? h("p", { className: "mt-4 text-base leading-relaxed text-mute" }, intro) : null
    );
  }

  var SitePreview = createClass({
    render: function () {
      var d = toJS(this.props.entry.getIn(["data"])) || {};
      var ga = this.props.getAsset;
      var slides = (d.heroSlides || []).filter(function (s) { return s && s.image; });
      var accent = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(d.accent || "") ? d.accent : "#ff3f1e";
      return h("div", { style: { ["--color-accent"]: accent } },
        h("section", {
          className: "relative isolate overflow-hidden",
          style: { minHeight: "640px", background: "radial-gradient(90% 85% at 55% 30%, #ff5a2e 0%, #e8401f 28%, #b42a12 52%, #6e1709 76%, #3a0d06 100%)" },
        },
          slides.length ? h("div", { className: "fade-y absolute top-0 bottom-0 z-10 overflow-hidden", style: { right: "8%", width: "26%" } },
            h("div", { className: "flex flex-col gap-3" }, slides.slice(0, 4).map(function (s, i) {
              return h("div", { key: i }, img(ga, s.image, "aspect-video w-full object-cover rounded-[20px]"));
            }))
          ) : null,
          d.heroImage ? h("div", { className: "portrait-blend absolute z-20", style: { left: "29%", width: "46%", top: 0, bottom: 0 } },
            img(ga, d.heroImage, "h-full w-full object-cover", { objectPosition: "60% top" })
          ) : null,
          h("div", { className: "relative z-40", style: { padding: "180px 40px 40px", maxWidth: "36rem" } },
            h("p", { className: "text-[1.9rem] leading-none font-medium tracking-[-0.04em] text-[#fc826c] uppercase" }, d.name || ""),
            h("h1", { className: "mt-5 text-[2.6rem] leading-[1.15] font-bold tracking-[-0.04em] text-white" }, d.headline || ""),
            d.subtext ? h("p", { className: "mt-4 text-lg leading-relaxed text-white/80" }, d.subtext) : null,
            h("div", { className: "mt-8 flex flex-wrap gap-3" },
              h("span", { className: "inline-flex h-12 items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white" }, "Book a project"),
              h("span", { className: "inline-flex h-12 items-center rounded-full bg-paper px-6 text-[15px] font-medium text-ink" }, "View work")
            )
          )
        ),
        h("section", { className: "bg-paper text-ink", style: { padding: "64px 40px" } },
          h("h2", { className: "text-4xl font-medium tracking-[-0.04em] text-accent" }, d.aboutLabel || ""),
          h("p", { className: "mt-6 max-w-[34ch] text-[1.75rem] leading-[1.3] font-medium tracking-[-0.025em]" }, d.about || ""),
          d.showreelImage ? h("div", { className: "mt-10 aspect-video overflow-hidden rounded-[var(--radius-card)]", style: { position: "relative" } },
            img(ga, d.showreelImage, "absolute inset-0 h-full w-full object-cover")
          ) : null
        )
      );
    },
  });

  var VideosPreview = createClass({
    render: function () {
      var d = toJS(this.props.entry.getIn(["data"])) || {};
      var ga = this.props.getAsset;
      var items = (d.items || []).filter(Boolean);
      var groups = ["Short form", "Long form", "Motion graphics"];
      function yt(u) { var m = (u || "").match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/); return m ? m[1] : null; }
      return shell(h("section", { style: { padding: "64px 32px" } },
        head(d.heading, d.intro),
        groups.map(function (g) {
          var list = items.filter(function (v) { return (v.type || "Long form") === g; });
          if (!list.length) return null;
          var vertical = g === "Short form";
          return h("div", { key: g, style: { marginTop: "48px" } },
            h("p", { className: "text-sm text-mute", style: { marginBottom: "16px" } }, g + " (" + list.length + ")"),
            h("div", { className: vertical ? "grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4" : "grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2" },
              list.map(function (v, i) {
                var id = yt(v.videoUrl);
                var cover = v.cover || (id ? "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg" : "");
                return h("div", { key: i, className: v.featured ? (vertical ? "col-span-2 row-span-2" : "md:col-span-2") : "" },
                  h("div", { className: "relative overflow-hidden rounded-[var(--radius-media)] bg-ink-3 " + (vertical ? "aspect-[9/16]" : "aspect-video") },
                    img(ga, cover, "absolute inset-0 h-full w-full object-cover")
                  ),
                  h("p", { className: "pt-3 text-[15px] font-medium text-paper" }, v.title || ""),
                  v.client ? h("p", { className: "mt-1 text-sm text-mute" }, v.client) : null
                );
              })
            )
          );
        })
      ));
    },
  });

  var FRAMES = { square: "1 / 1", portrait: "4 / 5", landscape: "16 / 9", banner: "3 / 1" };
  var DesignsPreview = createClass({
    render: function () {
      var d = toJS(this.props.entry.getIn(["data"])) || {};
      var ga = this.props.getAsset;
      var items = (d.items || []).filter(function (x) { return x && x.image; });
      return shell(h("section", { style: { padding: "64px 32px" } },
        head(d.heading, d.intro),
        h("div", { className: "mt-12 columns-2 gap-3 md:columns-3", style: { columnGap: "12px" } },
          items.map(function (it, i) {
            var frame = FRAMES[it.frame];
            return h("figure", { key: i, className: "mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-media)] bg-ink-2", style: { position: "relative", aspectRatio: frame || undefined } },
              frame ? img(ga, it.image, "absolute inset-0 h-full w-full object-cover") : img(ga, it.image, "block h-auto w-full")
            );
          })
        )
      ));
    },
  });

  CMS.registerPreviewTemplate("site", SitePreview);
  CMS.registerPreviewTemplate("videos", VideosPreview);
  CMS.registerPreviewTemplate("designs", DesignsPreview);

  /* Pull the site's compiled stylesheet(s) into the preview pane, then start the CMS. */
  fetch(BASE + "/", { cache: "no-store" })
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var re = /href="([^"]+\.css)"/g, m, seen = {};
      while ((m = re.exec(html))) {
        if (!seen[m[1]]) { seen[m[1]] = 1; CMS.registerPreviewStyle(m[1]); }
      }
    })
    .catch(function () {})
    .then(function () {
      CMS.registerPreviewStyle("body{background:#101010}", { raw: true });
      CMS.init();
    });
})();
