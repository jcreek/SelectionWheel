# SelectionWheel

A fun and simple selection wheel.

Enter a list of names to shuffle them, with a spinning wheel animation.

Add `?imgUrl=` to the end of the address bar with the URL of an image you want to have in the middle.

## Developing locally

My recommendation is to use [vscode](https://code.visualstudio.com/), install [Docker](https://www.docker.com/products/docker-desktop/), and install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. This will allow you to open the project in a Docker container, with no need to install anything else on your machine. No dependencies, nothing. Everything you need to run the project is commited to the repo and will be installed automatically into the Docker container.

To run the project locally with hot reload, use the command `npm run dev`.

All linting errors can be automatically fixed (usually) by running `npm run lint -- --fix` before you commit your changes.

This project uses symantic versioning. `Major.Minor.Patch` e.g. 1.1.2

When you create your Pull Request, ensure you add the relevant git tag using something like `git tag -a 1.1.0 -m "Add PWA support"` or `git tag -a 1.1.1 -m "Fix input duplication"`, then `git push origin --tags` to push the tag to the repository.

## Development notes

You can access a list of all the assets when debugging by visiting `http://localhost:3000/webpack-dev-server`

## Credits

### Favicon

This favicon was [generated](https://favicon.io/favicon-generator/) using the following font:

- Font Title: Fuzzy Bubbles
- Font Author: Copyright 2005 The Fuzzy Bubbles Project Authors (https://github.com/googlefonts/fuzzy-bubbles)
- Font Source: http://fonts.gstatic.com/s/fuzzybubbles/v5/6qLbKZMbrgv9pwtjPEVNV0F2Ds_WQxMAZkM1pn4.ttf
- Font License: SIL Open Font License, 1.1 (http://scripts.sil.org/OFL))
