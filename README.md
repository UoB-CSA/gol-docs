# Gol docs

The documentation is hosted at <https://uob-csa.github.io/gol-docs/>

This site is powered by [VitePress](https://vitepress.dev/),
for specific configuration details, please refer to the VitePress [documentation](https://vitepress.dev/guide/what-is-vitepress).

>[!NOTE]
> **This repository is configured with GitHub Actions to automatically build and deploy the documentation,
> so you can edit Markdown and configuration files directly on GitHub — no need to clone the repository locally for editing.**

## Config

To manage the website and sidebar config, edit `docs/.vitepress/config.mts`.

For more info, please refer <https://vitepress.dev/reference/site-config>

## Routing

The `docs` directory is the root directory of the website, and all documents are under `docs` directory with file-based routing.

When you are accessing resources, please discard `docs/` in your path.
e.g. You want to insert an image `docs/assets/example.png`, you need to type `![PNG](/assets/example.png)` in the markdown.

For more info, please refer <https://vitepress.dev/guide/routing>

## Develop Locally

If you wish to preview, develop or build the docs locally, please ensure you have:

- [Node.js](https://nodejs.org/) installed (version 22 or higher recommended)
- [pnpm](https://pnpm.io/) installed via Node.js Corepack by typing

  ```bash
  corepack enable pnpm
  ```

To launch the local dev server, type

``` bash
pnpm install
pnpm dev
```

To generate static doc files, type

```bash
pnpm install
pnpm build
```
