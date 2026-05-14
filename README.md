# Glyph Regex Whisperer

Describe a match in **natural language** (plus optional regex “flavor”) → get a **regex**, test cases, and foot-gun warnings—returned as JSON.

## What it is

A BYOK Next.js helper for anyone who **does not live in regex** but needs reliable patterns for logs, editors, validators, or grep. It biases toward safe, testable patterns and calls out catastrophic backtracking risks when relevant.

## Why it’s useful

- Cuts Stack Overflow rabbit holes for **one-off parsers**.
- Ships **positive and negative test strings** you can drop into unit tests.
- Explains **why** a pattern is fragile when the description is ambiguous.
- Supports flavor hints (e.g. JavaScript vs PCRE) for copy-paste correctness.

## Where you can use it

- **SRE & observability** — log line filters and alert routing rules.
- **Data validation** — form and CSV hygiene before heavy processing.
- **Security** — quick extraction patterns for triage (still validate carefully).
- **Editors & IDEs** — multi-cursor search patterns and refactor prep.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/regex` · Header `Authorization: Bearer <key>`

Body: `description` (required), optional `flavor`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
