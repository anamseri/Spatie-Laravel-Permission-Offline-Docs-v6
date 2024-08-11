(() => {
  "use strict";
  var e,
    t = {
      48: () => {
        function e(e) {
          return Array.isArray ? Array.isArray(e) : "[object Array]" === o(e);
        }
        function t(e) {
          return "string" == typeof e;
        }
        function n(e) {
          return "number" == typeof e;
        }
        function s(e) {
          return (
            !0 === e ||
            !1 === e ||
            ((function (e) {
              return i(e) && null !== e;
            })(e) &&
              "[object Boolean]" == o(e))
          );
        }
        function i(e) {
          return "object" == typeof e;
        }
        function r(e) {
          return null != e;
        }
        function c(e) {
          return !e.trim().length;
        }
        function o(e) {
          return null == e
            ? void 0 === e
              ? "[object Undefined]"
              : "[object Null]"
            : Object.prototype.toString.call(e);
        }
        const h = Object.prototype.hasOwnProperty;
        class a {
          constructor(e) {
            (this._keys = []), (this._keyMap = {});
            let t = 0;
            e.forEach((e) => {
              let n = l(e);
              (t += n.weight),
                this._keys.push(n),
                (this._keyMap[n.id] = n),
                (t += n.weight);
            }),
              this._keys.forEach((e) => {
                e.weight /= t;
              });
          }
          get(e) {
            return this._keyMap[e];
          }
          keys() {
            return this._keys;
          }
          toJSON() {
            return JSON.stringify(this._keys);
          }
        }
        function l(n) {
          let s = null,
            i = null,
            r = null,
            c = 1;
          if (t(n) || e(n)) (r = n), (s = u(n)), (i = d(n));
          else {
            if (!h.call(n, "name"))
              throw new Error(((e) => `Missing ${e} property in key`)("name"));
            const e = n.name;
            if (((r = e), h.call(n, "weight") && ((c = n.weight), c <= 0)))
              throw new Error(
                ((e) =>
                  `Property 'weight' in key '${e}' must be a positive integer`)(
                  e
                )
              );
            (s = u(e)), (i = d(e));
          }
          return { path: s, id: i, weight: c, src: r };
        }
        function u(t) {
          return e(t) ? t : t.split(".");
        }
        function d(t) {
          return e(t) ? t.join(".") : t;
        }
        var p = {
          isCaseSensitive: !1,
          includeScore: !1,
          keys: [],
          shouldSort: !0,
          sortFn: (e, t) =>
            e.score === t.score
              ? e.idx < t.idx
                ? -1
                : 1
              : e.score < t.score
              ? -1
              : 1,
          includeMatches: !1,
          findAllMatches: !1,
          minMatchCharLength: 1,
          location: 0,
          threshold: 0.6,
          distance: 100,
          ...{
            useExtendedSearch: !1,
            getFn: function (i, c) {
              let o = [],
                h = !1;
              const a = (i, c, l) => {
                if (r(i))
                  if (c[l]) {
                    const u = i[c[l]];
                    if (!r(u)) return;
                    if (l === c.length - 1 && (t(u) || n(u) || s(u)))
                      o.push(
                        (function (e) {
                          return null == e
                            ? ""
                            : (function (e) {
                                if ("string" == typeof e) return e;
                                let t = e + "";
                                return "0" == t && 1 / e == -1 / 0 ? "-0" : t;
                              })(e);
                        })(u)
                      );
                    else if (e(u)) {
                      h = !0;
                      for (let e = 0, t = u.length; e < t; e += 1)
                        a(u[e], c, l + 1);
                    } else c.length && a(u, c, l + 1);
                  } else o.push(i);
              };
              return a(i, t(c) ? c.split(".") : c, 0), h ? o : o[0];
            },
            ignoreLocation: !1,
            ignoreFieldNorm: !1,
          },
        };
        const g = /[^ ]+/g;
        class f {
          constructor({ getFn: e = p.getFn } = {}) {
            (this.norm = (function (e = 3) {
              const t = new Map(),
                n = Math.pow(10, e);
              return {
                get(e) {
                  const s = e.match(g).length;
                  if (t.has(s)) return t.get(s);
                  const i = 1 / Math.sqrt(s),
                    r = parseFloat(Math.round(i * n) / n);
                  return t.set(s, r), r;
                },
                clear() {
                  t.clear();
                },
              };
            })(3)),
              (this.getFn = e),
              (this.isCreated = !1),
              this.setIndexRecords();
          }
          setSources(e = []) {
            this.docs = e;
          }
          setIndexRecords(e = []) {
            this.records = e;
          }
          setKeys(e = []) {
            (this.keys = e),
              (this._keysMap = {}),
              e.forEach((e, t) => {
                this._keysMap[e.id] = t;
              });
          }
          create() {
            !this.isCreated &&
              this.docs.length &&
              ((this.isCreated = !0),
              t(this.docs[0])
                ? this.docs.forEach((e, t) => {
                    this._addString(e, t);
                  })
                : this.docs.forEach((e, t) => {
                    this._addObject(e, t);
                  }),
              this.norm.clear());
          }
          add(e) {
            const n = this.size();
            t(e) ? this._addString(e, n) : this._addObject(e, n);
          }
          removeAt(e) {
            this.records.splice(e, 1);
            for (let t = e, n = this.size(); t < n; t += 1)
              this.records[t].i -= 1;
          }
          getValueForItemAtKeyId(e, t) {
            return e[this._keysMap[t]];
          }
          size() {
            return this.records.length;
          }
          _addString(e, t) {
            if (!r(e) || c(e)) return;
            let n = { v: e, i: t, n: this.norm.get(e) };
            this.records.push(n);
          }
          _addObject(n, s) {
            let i = { i: s, $: {} };
            this.keys.forEach((s, o) => {
              let h = this.getFn(n, s.path);
              if (r(h))
                if (e(h)) {
                  let n = [];
                  const s = [{ nestedArrIndex: -1, value: h }];
                  for (; s.length; ) {
                    const { nestedArrIndex: i, value: o } = s.pop();
                    if (r(o))
                      if (t(o) && !c(o)) {
                        let e = { v: o, i, n: this.norm.get(o) };
                        n.push(e);
                      } else
                        e(o) &&
                          o.forEach((e, t) => {
                            s.push({ nestedArrIndex: t, value: e });
                          });
                  }
                  i.$[o] = n;
                } else if (!c(h)) {
                  let e = { v: h, n: this.norm.get(h) };
                  i.$[o] = e;
                }
            }),
              this.records.push(i);
          }
          toJSON() {
            return { keys: this.keys, records: this.records };
          }
        }
        function m(e, t, { getFn: n = p.getFn } = {}) {
          const s = new f({ getFn: n });
          return s.setKeys(e.map(l)), s.setSources(t), s.create(), s;
        }
        function y(
          e,
          {
            errors: t = 0,
            currentLocation: n = 0,
            expectedLocation: s = 0,
            distance: i = p.distance,
            ignoreLocation: r = p.ignoreLocation,
          } = {}
        ) {
          const c = t / e.length;
          if (r) return c;
          const o = Math.abs(s - n);
          return i ? c + o / i : o ? 1 : c;
        }
        const M = 32;
        function x(
          e,
          t,
          n,
          {
            location: s = p.location,
            distance: i = p.distance,
            threshold: r = p.threshold,
            findAllMatches: c = p.findAllMatches,
            minMatchCharLength: o = p.minMatchCharLength,
            includeMatches: h = p.includeMatches,
            ignoreLocation: a = p.ignoreLocation,
          } = {}
        ) {
          if (t.length > M)
            throw new Error(`Pattern length exceeds max of ${M}.`);
          const l = t.length,
            u = e.length,
            d = Math.max(0, Math.min(s, u));
          let g = r,
            f = d;
          const m = o > 1 || h,
            x = m ? Array(u) : [];
          let v;
          for (; (v = e.indexOf(t, f)) > -1; ) {
            let e = y(t, {
              currentLocation: v,
              expectedLocation: d,
              distance: i,
              ignoreLocation: a,
            });
            if (((g = Math.min(e, g)), (f = v + l), m)) {
              let e = 0;
              for (; e < l; ) (x[v + e] = 1), (e += 1);
            }
          }
          f = -1;
          let k = [],
            w = 1,
            L = l + u;
          const S = 1 << (l - 1);
          for (let s = 0; s < l; s += 1) {
            let r = 0,
              o = L;
            for (; r < o; ) {
              y(t, {
                errors: s,
                currentLocation: d + o,
                expectedLocation: d,
                distance: i,
                ignoreLocation: a,
              }) <= g
                ? (r = o)
                : (L = o),
                (o = Math.floor((L - r) / 2 + r));
            }
            L = o;
            let h = Math.max(1, d - o + 1),
              p = c ? u : Math.min(d + o, u) + l,
              M = Array(p + 2);
            M[p + 1] = (1 << s) - 1;
            for (let r = p; r >= h; r -= 1) {
              let c = r - 1,
                o = n[e.charAt(c)];
              if (
                (m && (x[c] = +!!o),
                (M[r] = ((M[r + 1] << 1) | 1) & o),
                s && (M[r] |= ((k[r + 1] | k[r]) << 1) | 1 | k[r + 1]),
                M[r] & S &&
                  ((w = y(t, {
                    errors: s,
                    currentLocation: c,
                    expectedLocation: d,
                    distance: i,
                    ignoreLocation: a,
                  })),
                  w <= g))
              ) {
                if (((g = w), (f = c), f <= d)) break;
                h = Math.max(1, 2 * d - f);
              }
            }
            if (
              y(t, {
                errors: s + 1,
                currentLocation: d,
                expectedLocation: d,
                distance: i,
                ignoreLocation: a,
              }) > g
            )
              break;
            k = M;
          }
          const I = { isMatch: f >= 0, score: Math.max(0.001, w) };
          if (m) {
            const e = (function (e = [], t = p.minMatchCharLength) {
              let n = [],
                s = -1,
                i = -1,
                r = 0;
              for (let c = e.length; r < c; r += 1) {
                let c = e[r];
                c && -1 === s
                  ? (s = r)
                  : c ||
                    -1 === s ||
                    ((i = r - 1), i - s + 1 >= t && n.push([s, i]), (s = -1));
              }
              return e[r - 1] && r - s >= t && n.push([s, r - 1]), n;
            })(x, o);
            e.length ? h && (I.indices = e) : (I.isMatch = !1);
          }
          return I;
        }
        function v(e) {
          let t = {};
          for (let n = 0, s = e.length; n < s; n += 1) {
            const i = e.charAt(n);
            t[i] = (t[i] || 0) | (1 << (s - n - 1));
          }
          return t;
        }
        class k {
          constructor(
            e,
            {
              location: t = p.location,
              threshold: n = p.threshold,
              distance: s = p.distance,
              includeMatches: i = p.includeMatches,
              findAllMatches: r = p.findAllMatches,
              minMatchCharLength: c = p.minMatchCharLength,
              isCaseSensitive: o = p.isCaseSensitive,
              ignoreLocation: h = p.ignoreLocation,
            } = {}
          ) {
            if (
              ((this.options = {
                location: t,
                threshold: n,
                distance: s,
                includeMatches: i,
                findAllMatches: r,
                minMatchCharLength: c,
                isCaseSensitive: o,
                ignoreLocation: h,
              }),
              (this.pattern = o ? e : e.toLowerCase()),
              (this.chunks = []),
              !this.pattern.length)
            )
              return;
            const a = (e, t) => {
                this.chunks.push({
                  pattern: e,
                  alphabet: v(e),
                  startIndex: t,
                });
              },
              l = this.pattern.length;
            if (l > M) {
              let e = 0;
              const t = l % M,
                n = l - t;
              for (; e < n; ) a(this.pattern.substr(e, M), e), (e += M);
              if (t) {
                const e = l - M;
                a(this.pattern.substr(e), e);
              }
            } else a(this.pattern, 0);
          }
          searchIn(e) {
            const { isCaseSensitive: t, includeMatches: n } = this.options;
            if ((t || (e = e.toLowerCase()), this.pattern === e)) {
              let t = { isMatch: !0, score: 0 };
              return n && (t.indices = [[0, e.length - 1]]), t;
            }
            const {
              location: s,
              distance: i,
              threshold: r,
              findAllMatches: c,
              minMatchCharLength: o,
              ignoreLocation: h,
            } = this.options;
            let a = [],
              l = 0,
              u = !1;
            this.chunks.forEach(
              ({ pattern: t, alphabet: d, startIndex: p }) => {
                const {
                  isMatch: g,
                  score: f,
                  indices: m,
                } = x(e, t, d, {
                  location: s + p,
                  distance: i,
                  threshold: r,
                  findAllMatches: c,
                  minMatchCharLength: o,
                  includeMatches: n,
                  ignoreLocation: h,
                });
                g && (u = !0), (l += f), g && m && (a = [...a, ...m]);
              }
            );
            let d = {
              isMatch: u,
              score: u ? l / this.chunks.length : 1,
            };
            return u && n && (d.indices = a), d;
          }
        }
        class w {
          constructor(e) {
            this.pattern = e;
          }
          static isMultiMatch(e) {
            return L(e, this.multiRegex);
          }
          static isSingleMatch(e) {
            return L(e, this.singleRegex);
          }
          search() {}
        }
        function L(e, t) {
          const n = e.match(t);
          return n ? n[1] : null;
        }
        class S extends w {
          constructor(
            e,
            {
              location: t = p.location,
              threshold: n = p.threshold,
              distance: s = p.distance,
              includeMatches: i = p.includeMatches,
              findAllMatches: r = p.findAllMatches,
              minMatchCharLength: c = p.minMatchCharLength,
              isCaseSensitive: o = p.isCaseSensitive,
              ignoreLocation: h = p.ignoreLocation,
            } = {}
          ) {
            super(e),
              (this._bitapSearch = new k(e, {
                location: t,
                threshold: n,
                distance: s,
                includeMatches: i,
                findAllMatches: r,
                minMatchCharLength: c,
                isCaseSensitive: o,
                ignoreLocation: h,
              }));
          }
          static get type() {
            return "fuzzy";
          }
          static get multiRegex() {
            return /^"(.*)"$/;
          }
          static get singleRegex() {
            return /^(.*)$/;
          }
          search(e) {
            return this._bitapSearch.searchIn(e);
          }
        }
        class I extends w {
          constructor(e) {
            super(e);
          }
          static get type() {
            return "include";
          }
          static get multiRegex() {
            return /^'"(.*)"$/;
          }
          static get singleRegex() {
            return /^'(.*)$/;
          }
          search(e) {
            let t,
              n = 0;
            const s = [],
              i = this.pattern.length;
            for (; (t = e.indexOf(this.pattern, n)) > -1; )
              (n = t + i), s.push([t, n - 1]);
            const r = !!s.length;
            return { isMatch: r, score: r ? 0 : 1, indices: s };
          }
        }
        const C = [
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "exact";
              }
              static get multiRegex() {
                return /^="(.*)"$/;
              }
              static get singleRegex() {
                return /^=(.*)$/;
              }
              search(e) {
                const t = e === this.pattern;
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [0, this.pattern.length - 1],
                };
              }
            },
            I,
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "prefix-exact";
              }
              static get multiRegex() {
                return /^\^"(.*)"$/;
              }
              static get singleRegex() {
                return /^\^(.*)$/;
              }
              search(e) {
                const t = e.startsWith(this.pattern);
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [0, this.pattern.length - 1],
                };
              }
            },
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "inverse-prefix-exact";
              }
              static get multiRegex() {
                return /^!\^"(.*)"$/;
              }
              static get singleRegex() {
                return /^!\^(.*)$/;
              }
              search(e) {
                const t = !e.startsWith(this.pattern);
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [0, e.length - 1],
                };
              }
            },
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "inverse-suffix-exact";
              }
              static get multiRegex() {
                return /^!"(.*)"\$$/;
              }
              static get singleRegex() {
                return /^!(.*)\$$/;
              }
              search(e) {
                const t = !e.endsWith(this.pattern);
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [0, e.length - 1],
                };
              }
            },
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "suffix-exact";
              }
              static get multiRegex() {
                return /^"(.*)"\$$/;
              }
              static get singleRegex() {
                return /^(.*)\$$/;
              }
              search(e) {
                const t = e.endsWith(this.pattern);
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [e.length - this.pattern.length, e.length - 1],
                };
              }
            },
            class extends w {
              constructor(e) {
                super(e);
              }
              static get type() {
                return "inverse-exact";
              }
              static get multiRegex() {
                return /^!"(.*)"$/;
              }
              static get singleRegex() {
                return /^!(.*)$/;
              }
              search(e) {
                const t = -1 === e.indexOf(this.pattern);
                return {
                  isMatch: t,
                  score: t ? 0 : 1,
                  indices: [0, e.length - 1],
                };
              }
            },
            S,
          ],
          _ = C.length,
          $ = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
        const b = new Set([S.type, I.type]);
        class O {
          constructor(
            e,
            {
              isCaseSensitive: t = p.isCaseSensitive,
              includeMatches: n = p.includeMatches,
              minMatchCharLength: s = p.minMatchCharLength,
              ignoreLocation: i = p.ignoreLocation,
              findAllMatches: r = p.findAllMatches,
              location: c = p.location,
              threshold: o = p.threshold,
              distance: h = p.distance,
            } = {}
          ) {
            (this.query = null),
              (this.options = {
                isCaseSensitive: t,
                includeMatches: n,
                minMatchCharLength: s,
                findAllMatches: r,
                ignoreLocation: i,
                location: c,
                threshold: o,
                distance: h,
              }),
              (this.pattern = t ? e : e.toLowerCase()),
              (this.query = (function (e, t = {}) {
                return e.split("|").map((e) => {
                  let n = e
                      .trim()
                      .split($)
                      .filter((e) => e && !!e.trim()),
                    s = [];
                  for (let e = 0, i = n.length; e < i; e += 1) {
                    const i = n[e];
                    let r = !1,
                      c = -1;
                    for (; !r && ++c < _; ) {
                      const e = C[c];
                      let n = e.isMultiMatch(i);
                      n && (s.push(new e(n, t)), (r = !0));
                    }
                    if (!r)
                      for (c = -1; ++c < _; ) {
                        const e = C[c];
                        let n = e.isSingleMatch(i);
                        if (n) {
                          s.push(new e(n, t));
                          break;
                        }
                      }
                  }
                  return s;
                });
              })(this.pattern, this.options));
          }
          static condition(e, t) {
            return t.useExtendedSearch;
          }
          searchIn(e) {
            const t = this.query;
            if (!t) return { isMatch: !1, score: 1 };
            const { includeMatches: n, isCaseSensitive: s } = this.options;
            e = s ? e : e.toLowerCase();
            let i = 0,
              r = [],
              c = 0;
            for (let s = 0, o = t.length; s < o; s += 1) {
              const o = t[s];
              (r.length = 0), (i = 0);
              for (let t = 0, s = o.length; t < s; t += 1) {
                const s = o[t],
                  { isMatch: h, indices: a, score: l } = s.search(e);
                if (!h) {
                  (c = 0), (i = 0), (r.length = 0);
                  break;
                }
                if (((i += 1), (c += l), n)) {
                  const e = s.constructor.type;
                  b.has(e) ? (r = [...r, ...a]) : r.push(a);
                }
              }
              if (i) {
                let e = { isMatch: !0, score: c / i };
                return n && (e.indices = r), e;
              }
            }
            return { isMatch: !1, score: 1 };
          }
        }
        const E = [];
        function A(e, t) {
          for (let n = 0, s = E.length; n < s; n += 1) {
            let s = E[n];
            if (s.condition(e, t)) return new s(e, t);
          }
          return new k(e, t);
        }
        const R = "$and",
          D = "$or",
          F = "$path",
          j = "$val",
          N = (e) => !(!e[R] && !e[D]),
          q = (e) => ({
            [R]: Object.keys(e).map((t) => ({ [t]: e[t] })),
          });
        function P(n, s, { auto: r = !0 } = {}) {
          const c = (n) => {
            let o = Object.keys(n);
            const h = ((e) => !!e[F])(n);
            if (!h && o.length > 1 && !N(n)) return c(q(n));
            if (((t) => !e(t) && i(t) && !N(t))(n)) {
              const e = h ? n[F] : o[0],
                i = h ? n[j] : n[e];
              if (!t(i))
                throw new Error(((e) => `Invalid value for key ${e}`)(e));
              const c = { keyId: d(e), pattern: i };
              return r && (c.searcher = A(i, s)), c;
            }
            let a = { children: [], operator: o[0] };
            return (
              o.forEach((t) => {
                const s = n[t];
                e(s) &&
                  s.forEach((e) => {
                    a.children.push(c(e));
                  });
              }),
              a
            );
          };
          return N(n) || (n = q(n)), c(n);
        }
        function W(e, t) {
          const n = e.matches;
          (t.matches = []),
            r(n) &&
              n.forEach((e) => {
                if (!r(e.indices) || !e.indices.length) return;
                const { indices: n, value: s } = e;
                let i = { indices: n, value: s };
                e.key && (i.key = e.key.src),
                  e.idx > -1 && (i.refIndex = e.idx),
                  t.matches.push(i);
              });
        }
        function z(e, t) {
          t.score = e.score;
        }
        class J {
          constructor(e, t = {}, n) {
            (this.options = { ...p, ...t }),
              this.options.useExtendedSearch,
              (this._keyStore = new a(this.options.keys)),
              this.setCollection(e, n);
          }
          setCollection(e, t) {
            if (((this._docs = e), t && !(t instanceof f)))
              throw new Error("Incorrect 'index' type");
            this._myIndex =
              t ||
              m(this.options.keys, this._docs, {
                getFn: this.options.getFn,
              });
          }
          add(e) {
            r(e) && (this._docs.push(e), this._myIndex.add(e));
          }
          remove(e = () => !1) {
            const t = [];
            for (let n = 0, s = this._docs.length; n < s; n += 1) {
              const i = this._docs[n];
              e(i, n) && (this.removeAt(n), (n -= 1), (s -= 1), t.push(i));
            }
            return t;
          }
          removeAt(e) {
            this._docs.splice(e, 1), this._myIndex.removeAt(e);
          }
          getIndex() {
            return this._myIndex;
          }
          search(e, { limit: s = -1 } = {}) {
            const {
              includeMatches: i,
              includeScore: r,
              shouldSort: c,
              sortFn: o,
              ignoreFieldNorm: h,
            } = this.options;
            let a = t(e)
              ? t(this._docs[0])
                ? this._searchStringList(e)
                : this._searchObjectList(e)
              : this._searchLogical(e);
            return (
              (function (e, { ignoreFieldNorm: t = p.ignoreFieldNorm }) {
                e.forEach((e) => {
                  let n = 1;
                  e.matches.forEach(({ key: e, norm: s, score: i }) => {
                    const r = e ? e.weight : null;
                    n *= Math.pow(
                      0 === i && r ? Number.EPSILON : i,
                      (r || 1) * (t ? 1 : s)
                    );
                  }),
                    (e.score = n);
                });
              })(a, { ignoreFieldNorm: h }),
              c && a.sort(o),
              n(s) && s > -1 && (a = a.slice(0, s)),
              (function (
                e,
                t,
                {
                  includeMatches: n = p.includeMatches,
                  includeScore: s = p.includeScore,
                } = {}
              ) {
                const i = [];
                return (
                  n && i.push(W),
                  s && i.push(z),
                  e.map((e) => {
                    const { idx: n } = e,
                      s = { item: t[n], refIndex: n };
                    return (
                      i.length &&
                        i.forEach((t) => {
                          t(e, s);
                        }),
                      s
                    );
                  })
                );
              })(a, this._docs, {
                includeMatches: i,
                includeScore: r,
              })
            );
          }
          _searchStringList(e) {
            const t = A(e, this.options),
              { records: n } = this._myIndex,
              s = [];
            return (
              n.forEach(({ v: e, i: n, n: i }) => {
                if (!r(e)) return;
                const { isMatch: c, score: o, indices: h } = t.searchIn(e);
                c &&
                  s.push({
                    item: e,
                    idx: n,
                    matches: [{ score: o, value: e, norm: i, indices: h }],
                  });
              }),
              s
            );
          }
          _searchLogical(e) {
            const t = P(e, this.options),
              n = (e, t, s) => {
                if (!e.children) {
                  const { keyId: n, searcher: i } = e,
                    r = this._findMatches({
                      key: this._keyStore.get(n),
                      value: this._myIndex.getValueForItemAtKeyId(t, n),
                      searcher: i,
                    });
                  return r && r.length ? [{ idx: s, item: t, matches: r }] : [];
                }
                switch (e.operator) {
                  case R: {
                    const i = [];
                    for (let r = 0, c = e.children.length; r < c; r += 1) {
                      const c = e.children[r],
                        o = n(c, t, s);
                      if (!o.length) return [];
                      i.push(...o);
                    }
                    return i;
                  }
                  case D: {
                    const i = [];
                    for (let r = 0, c = e.children.length; r < c; r += 1) {
                      const c = e.children[r],
                        o = n(c, t, s);
                      if (o.length) {
                        i.push(...o);
                        break;
                      }
                    }
                    return i;
                  }
                }
              },
              s = this._myIndex.records,
              i = {},
              c = [];
            return (
              s.forEach(({ $: e, i: s }) => {
                if (r(e)) {
                  let r = n(t, e, s);
                  r.length &&
                    (i[s] ||
                      ((i[s] = { idx: s, item: e, matches: [] }), c.push(i[s])),
                    r.forEach(({ matches: e }) => {
                      i[s].matches.push(...e);
                    }));
                }
              }),
              c
            );
          }
          _searchObjectList(e) {
            const t = A(e, this.options),
              { keys: n, records: s } = this._myIndex,
              i = [];
            return (
              s.forEach(({ $: e, i: s }) => {
                if (!r(e)) return;
                let c = [];
                n.forEach((n, s) => {
                  c.push(
                    ...this._findMatches({
                      key: n,
                      value: e[s],
                      searcher: t,
                    })
                  );
                }),
                  c.length && i.push({ idx: s, item: e, matches: c });
              }),
              i
            );
          }
          _findMatches({ key: t, value: n, searcher: s }) {
            if (!r(n)) return [];
            let i = [];
            if (e(n))
              n.forEach(({ v: e, i: n, n: c }) => {
                if (!r(e)) return;
                const { isMatch: o, score: h, indices: a } = s.searchIn(e);
                o &&
                  i.push({
                    score: h,
                    key: t,
                    value: e,
                    idx: n,
                    norm: c,
                    indices: a,
                  });
              });
            else {
              const { v: e, n: r } = n,
                { isMatch: c, score: o, indices: h } = s.searchIn(e);
              c &&
                i.push({
                  score: o,
                  key: t,
                  value: e,
                  norm: r,
                  indices: h,
                });
            }
            return i;
          }
        }
        (J.version = "6.4.6"),
          (J.createIndex = m),
          (J.parseIndex = function (e, { getFn: t = p.getFn } = {}) {
            const { keys: n, records: s } = e,
              i = new f({ getFn: t });
            return i.setKeys(n), i.setIndexRecords(s), i;
          }),
          (J.config = p),
          (J.parseQuery = P),
          (function (...e) {
            E.push(...e);
          })(O);
        const K = J;
        window.LivewireUISpotlight = function (e) {
          return {
            inputPlaceholder: e.placeholder,
            searchEngine: "commands",
            commands: e.commands,
            commandSearch: null,
            selectedCommand: null,
            dependencySearch: null,
            dependencyQueryResults: window.Livewire.find(
              e.componentId
            ).entangle("dependencyQueryResults"),
            requiredDependencies: [],
            currentDependency: null,
            resolvedDependencies: {},
            showResultsWithoutInput: e.showResultsWithoutInput,
            init: function () {
              var t = this;
              (this.commandSearch = new K(this.commands, {
                threshold: 0.3,
                keys: ["name", "description", "synonyms"],
              })),
                (this.dependencySearch = new K([], {
                  threshold: 0.3,
                  keys: ["name", "description", "synonyms"],
                })),
                this.$watch("dependencyQueryResults", function (e) {
                  t.dependencySearch.setCollection(e);
                }),
                this.$watch("input", function (e) {
                  0 === e.length && (t.selected = 0),
                    null !== t.selectedCommand &&
                      null !== t.currentDependency &&
                      "search" === t.currentDependency.type &&
                      t.$wire.searchDependency(
                        t.selectedCommand.id,
                        t.currentDependency.id,
                        e,
                        t.resolvedDependencies
                      );
                }),
                this.$watch("isOpen", function (n) {
                  !1 === n &&
                    setTimeout(function () {
                      (t.input = ""),
                        (t.inputPlaceholder = e.placeholder),
                        (t.searchEngine = "commands"),
                        (t.resolvedDependencies = {}),
                        (t.selectedCommand = null),
                        (t.currentDependency = null),
                        (t.selectedCommand = null),
                        (t.requiredDependencies = []);
                    }, 300);
                });
            },
            isOpen: !1,
            toggleOpen: function () {
              var e = this;
              this.isOpen
                ? (this.isOpen = !1)
                : ((this.input = ""),
                  (this.isOpen = !0),
                  setTimeout(function () {
                    e.$refs.input.focus();
                  }, 100));
            },
            input: "",
            filteredItems: function () {
              return "commands" === this.searchEngine
                ? !this.input && this.showResultsWithoutInput
                  ? this.commandSearch.getIndex().docs.map(function (e, t) {
                      return [{ item: e }, t];
                    })
                  : this.commandSearch.search(this.input).map(function (e, t) {
                      return [e, t];
                    })
                : "search" === this.searchEngine
                ? !this.input && this.showResultsWithoutInput
                  ? this.dependencySearch.getIndex().docs.map(function (e, t) {
                      return [{ item: e }, t];
                    })
                  : this.dependencySearch
                      .search(this.input)
                      .map(function (e, t) {
                        return [e, t];
                      })
                : [];
            },
            selectUp: function () {
              var e = this;
              (this.selected = Math.max(0, this.selected - 1)),
                this.$nextTick(function () {
                  e.$refs.results.children[e.selected + 1].scrollIntoView({
                    block: "nearest",
                  });
                });
            },
            selectDown: function () {
              var e = this;
              (this.selected = Math.min(
                this.filteredItems().length - 1,
                this.selected + 1
              )),
                this.$nextTick(function () {
                  e.$refs.results.children[e.selected + 1].scrollIntoView({
                    block: "nearest",
                  });
                });
            },
            go: function (e) {
              var t,
                n = this;
              (null === this.selectedCommand &&
                ((this.selectedCommand = this.commands.find(function (t) {
                  return (
                    t.id === (e || n.filteredItems()[n.selected][0].item.id)
                  );
                })),
                (this.requiredDependencies = JSON.parse(
                  JSON.stringify(this.selectedCommand.dependencies)
                ))),
              null !== this.currentDependency) &&
                ((t =
                  "search" === this.currentDependency.type
                    ? e || this.filteredItems()[this.selected][0].item.id
                    : this.input),
                (this.resolvedDependencies[this.currentDependency.id] = t));
              this.requiredDependencies.length > 0
                ? ((this.input = ""),
                  (this.currentDependency = this.requiredDependencies.pop()),
                  (this.inputPlaceholder = this.currentDependency.placeholder),
                  (this.searchEngine =
                    "search" === this.currentDependency.type && "search"))
                : ((this.isOpen = !1),
                  this.$wire.execute(
                    this.selectedCommand.id,
                    this.resolvedDependencies
                  ));
            },
            selected: 0,
          };
        };
      },
      578: () => {},
    },
    n = {};
  function s(e) {
    var i = n[e];
    if (void 0 !== i) return i.exports;
    var r = (n[e] = { exports: {} });
    return t[e](r, r.exports, s), r.exports;
  }
  (s.m = t),
    (e = []),
    (s.O = (t, n, i, r) => {
      if (!n) {
        var c = 1 / 0;
        for (a = 0; a < e.length; a++) {
          for (var [n, i, r] = e[a], o = !0, h = 0; h < n.length; h++)
            (!1 & r || c >= r) && Object.keys(s.O).every((e) => s.O[e](n[h]))
              ? n.splice(h--, 1)
              : ((o = !1), r < c && (c = r));
          o && (e.splice(a--, 1), (t = i()));
        }
        return t;
      }
      r = r || 0;
      for (var a = e.length; a > 0 && e[a - 1][2] > r; a--) e[a] = e[a - 1];
      e[a] = [n, i, r];
    }),
    (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (() => {
      var e = { 569: 0, 880: 0 };
      s.O.j = (t) => 0 === e[t];
      var t = (t, n) => {
          var i,
            r,
            [c, o, h] = n,
            a = 0;
          for (i in o) s.o(o, i) && (s.m[i] = o[i]);
          if (h) var l = h(s);
          for (t && t(n); a < c.length; a++)
            (r = c[a]), s.o(e, r) && e[r] && e[r][0](), (e[c[a]] = 0);
          return s.O(l);
        },
        n = (self.webpackChunk = self.webpackChunk || []);
      n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })(),
    s.O(void 0, [880], () => s(48));
  var i = s.O(void 0, [880], () => s(578));
  i = s.O(i);
})();
