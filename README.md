# SSS — Secret Society of Sisyphus

Monorepo for the SSS project.

## Packages

- **packages/web** — Next.js website (port 3380)
- **packages/contracts** — Solidity contracts (Foundry, Base chain)

## Docs

Project specs and research in `docs/`.

## Development

```bash
pnpm install
pnpm build           # Build web app
pnpm build:contracts # Build Solidity contracts
pnpm test:contracts  # Run contract tests
```
