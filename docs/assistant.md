# AI Assistant

`/dashboard/assistant` is separate from person-to-person Chat. It renders bounded summaries, cards, statistics, badges, lists, tables and bar/line charts using the existing components. Charts include data tables. It cannot read workspace records, browse, use tools or change data. Output is untrusted: a restricted literal-language gate and independent Zod validation reject unsupported expressions, components and props before rendering. No generated HTML, script, iframe, links, styles, forms or actions are supported.

## Recorded and configured modes

No keys means recorded replies. Examples use synthetic illustrative data, and unmatched prompts receive an explicitly labelled recorded fallback. Both sources use POST `/api/assistant` and the same bounded SSE text-delta/finish/error envelope. The repository live demo and every `tenboards-preview` version stay recorded-only.

Adopters can set any subset of these **server-only** variables. Only a nonblank key enables a provider, in this order; model variables alone enable none. The selector shows enabled names and effective models. It sends only the provider ID; the server resolves the key and model on each request. Invalid configuration, removed/revoked keys and upstream errors fail explicitly, with no provider or recorded fallback.

| Provider | Key | Override | Default |
| --- | --- | --- | --- |
| Anthropic | `ANTHROPIC_API_KEY` | `ANTHROPIC_MODEL` | `claude-sonnet-5-5` |
| OpenAI | `OPENAI_API_KEY` | `OPENAI_MODEL` | `gpt-6.1-sol` |
| xAI | `XAI_API_KEY` | `XAI_MODEL` | `grok-4.7` |
| Meta | `META_API_KEY` | `META_MODEL` | `muse-spark-1.3` |
| Google | `GOOGLE_GENERATIVE_AI_API_KEY` | `GOOGLE_GENERATIVE_AI_MODEL` | `gemini-3.8-flash` |

Use private Node environment variables or adopter-owned Worker secret bindings. Worker bindings take precedence without merging process environment; Hyperdrive/DB/session resources are request scoped. Browser metadata contains names, IDs and models only. Never use `VITE_` keys, put keys in source/config vars, or supply real credentials to tests. The client has no key input. Exact SDK pins are recorded in the milestone README and lockfile.

For local Node, the actual loopback origin is accepted. Hosted live auth-off deployments require `ASSISTANT_ORIGIN=https://your-own-dashboard.example`. Auth-on uses validated `BETTER_AUTH_URL`; an additional `ASSISTANT_ORIGIN` must agree. Recorded mode without an explicit origin uses the request URL's origin. POST requires an exact non-null Origin and JSON content type; forwarded origin/host headers are ignored. These checks mitigate CSRF; open auth-off access remains open. With auth enabled, config and POST independently require a valid session. All responses are private/no-store and nosniff.

## Limits and request lifetime

| Boundary | Limit |
| --- | --- |
| Request body | 64 KiB counted while reading; 10-second input deadline |
| Messages | 20; user 8 KiB and assistant 32 KiB UTF-8 each; aggregate within body cap |
| Server instructions | 32 KiB; registry specification and deterministic examples only |
| Reply | 64 KiB visible text; 4,096 requested output tokens |
| Deadlines | 20 seconds to first visible content, 15 seconds idle, 60 seconds total |
| Render | 200 nodes, 12 levels, 50 table rows × 8 columns, 4 series × 50 points |
| Provider wire | 2 MiB cap, including metadata; bounded independently of visible output |

Only user/assistant text is accepted. Client system/developer/tool roles, arbitrary destinations, headers, models and unknown fields are rejected. Requests contain entered text and library instructions, never profile/session/database/Chat data. SDK retries are disabled. Stop, disconnect, timeout and overflow cancel upstream. Truncated, empty, refused or invalid replies never receive a completed marker. Exactly one terminal event closes a response; safe HTTP errors before streaming are distinct from error events after headers. DB and session work finishes before the stream returns.

Admission uses fixed 60-second windows: 10 per authenticated user plus 30 per trusted IP, or 10 per IP with auth off. 429 includes Retry-After; aborts are not refunded. DB mode uses atomic conditional upserts in existing `auth_rate_limit`, hashed identifiers and `assistant:v1:` keys; cleanup touches only Assistant keys. Storage errors return 503 without memory fallback. Workers trust only `cf-connecting-ip` on their actual request path. Node ignores forwarding headers and uses one conservative unknown-IP bucket (30 across authenticated users). Fixed-window boundaries can admit twice the stated limit in a short burst; each IPv6 /128 has its own bucket.

No-DB mode uses a maximum 10,000-bucket TTL map, rejecting new buckets at capacity. Its scope is one Node process or Worker isolate and it resets on restart: **it is not a global spend quota**. Public paid deployments across isolates need adopter-owned shared ingress/provider budgets; that infrastructure is outside this template.

## Privacy and provider access

Conversation UI is mounted-view state only, cleared on navigation or reload. There is no transcript database, localStorage, cookie, URL or provider conversation ID. This layer supplies Send, Stop and New conversation; full bounded history and Regenerate are completed in task 003. No prompts, keys, output, provider errors or authorization headers are logged/traced. SDK telemetry and provider-warning logging are disabled. OpenUI devtools and observability are disabled.

OpenAI and xAI explicitly use Responses with `store: false`. Meta uses `https://api.meta.ai/v1/chat/completions`, its own key and a developer instruction message. Google uses streamed generateContent, Anthropic Messages. Application storage choices do not promise zero provider retention: account terms, abuse monitoring and regional policies still apply. Check entitlement/billing and availability with your provider before enabling it; mocks prove integration, not account access.

Official model/protocol references rechecked 2026-10-24: [Anthropic catalog](https://platform.claude.com/docs/en/models/overview), [OpenAI Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [OpenAI storage](https://developers.openai.com/api/docs/guides/conversation-state), [xAI 4.7](https://docs.x.ai/developers/models/grok-4.7), [Meta catalog](https://dev.meta.ai/docs/models), [Meta protocol](https://dev.meta.ai/docs/protocols/chat-completions), [Google 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash). Meta's standard `muse-spark-1.3` is used, never its contributor variant by default. Geographic access and account-level eligibility may differ from model catalog availability; adopters must verify both.

## Validation and deployment

`npm run assistant:test` checks the registry/language/decoder. `npm run assistant:server` runs synthetic direct-adapter wires and pure bounds. `npm run assistant:worker` exercises the actual Node route and compiled workerd behind a test-only provider egress barrier, plus isolated local Postgres admission/auth checks. Use `TEST_PORT_OFFSET` and a dedicated test DB; no real provider call is required or permitted in these tests. Local workerd evidence is not hosted provider or Hyperdrive acceptance.

`npm run assistant:browser` targets `ASSISTANT_TEST_URL`; set `ASSISTANT_ENDPOINT_TEST=1` to space each visual mode into a fresh rate-limit window when using the real endpoint. Evidence is written to `ASSISTANT_EVIDENCE_ROOT`. The reusable preview guard rejects all key/model/origin variables, dotenv/dev-vars contamination and any remote binding except ASSETS. See [deployment](deploy.md) for private adopter setup. Contributors use only `npm run preview:deploy -- --preview-alias pr-NNN`; never deploy PR builds to the production Worker.
