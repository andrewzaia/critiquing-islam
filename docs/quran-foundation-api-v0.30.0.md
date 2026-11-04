# Quran Foundation live Qira'at integration (v0.30.0)

The original locally hosted Quran reading explorer remains available without credentials. Live Quran Foundation matrices are an optional second source, displayed under the local comparison. The two sources are not silently merged.

## Cloudflare Pages configuration

Configure the following bindings for the Pages project (both production and any preview environment that needs to exercise the API):

- `QF_CLIENT_ID`: Secret - app Client ID.
- `QF_CLIENT_SECRET`: Secret - app Client Secret.
- `QF_ENV`: Plain variable - `prelive` or `production`.
- `QF_QIRAAT_SCOPE`: Optional plain variable - set to `qiraat` only when that parent scope (rather than `qiraat.read`) is the one approved for your client. Otherwise omit it. The proxy only permits these two Qira'at scopes.
- `QF_CONTENT_SCOPE`: Optional plain variable for Content permissions, normally `content`. New applications receiving granular content scopes should use the exact approved content scope.

Use Pages project Settings > Variables and Secrets. Do not commit values to GitHub, place them in front-end JavaScript or add them as a GitHub Actions build environment value. After changing bindings, redeploy.

## Provider permissions and access

The live matrix endpoint `/content/api/v4/qiraat/matrix/by_verse/{verse_key}` requires production credentials with approved `qiraat.read` or parent `qiraat` scope; prelive has no Qira'at endpoints. The proxy requests `qiraat.read` by default, or the parent scope when explicitly configured, independently of ordinary Content permissions. The displayed page uses the local seven-reader dataset until production API approval is available.

Provider references:
- https://api-docs.quran.com/docs/quickstart/
- https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/get-qiraat-matrix-by-verse/
- https://api-docs.quran.com/docs/user_related_apis_versioned/scopes/

## Deployment and verification

The function is a Cloudflare Pages Function in `functions/api/quran.js`. Confirm the Cloudflare project uses Pages Functions, and that its deployment pipeline includes the root `functions/` directory, not just the built static `dist/`. A deployment configured solely for static assets will not serve `/api/quran`.

Run `npm run check` or `npm run check:qf`. The latter uses mocked HTTP for OAuth and matrix reads. It checks invalid inputs, unset credentials, production-only access, cached access tokens, absence of secrets in responses, allowable parent scopes, documented matrix response fields and simulated browser rendering. These are contract tests using a fixture based on the published schema, not a live authenticated integration test.

After production approval, open `/api/quran?kind=qiraat&verse=1:4` and confirm `status:ok`, then open `/quran/?verse=1:4` to compare the two individually attributed sources. Confirm that an ordinary verse with no approved junctures reports no matrix instead of a false statement of universal agreement.

The provider's matrix categories reflect its own taxonomy: A (potentially meaning-affecting), B (orthographic, same meaning) and C (phonetic). A category is not a logical or historical verdict. Live material requires separate licence and attribution review before offline redistribution.

## Security and reliability

- Only accepts GET and fixed verse references and route types, never arbitrary remote URLs.
- OAuth Client Credentials remain server-side; tokens are cached in a worker isolate until nearing expiry and never returned to the browser.
- Environment URL pairs are fixed to Quran Foundation hosts; credentials and tokens cannot be sent to a user-controlled host.
- One token refresh is allowed after a 401; 403/429 and upstream failures have distinct statuses.
- Browser receives only a status and approved source data; local corpus remains accessible if the provider fails.
- Production API scope approval and real matrix rendering must be verified separately. The build checks cannot establish what scopes Quran Foundation has actually approved.
