# Layout

> A component-based site builder made with React, NextJS and NodeJS.

## Running Locally
Clone the repository and install modules:

```bash
npm install
# or
yarn
```

Start MongoDB and create a database called `layout`.

Add environment variables:
```bash
cp api/.env.example api/.env
cp www/.env.example www/.env
# Then add the required environment variables.
```

Start the frontend:

```bash
cd packages/www

npm run dev
```

Start the backend:

```bash
cd packages/api

npm run dev
```

## Folder Structure
The site is broken up into interdependent packages with [Lerna](https://lerna.js.org).

### api
A Node server using express to interact with a MongoDB database.

### components
React components compiled with Babel at built time to be used on the built sites.

### renderer
Basically a custom implementation of the React component tree to generate either static HTML or a React component tree for a given page on a site. Also parses a custom styled components api and adds styles to the page.

### sections
React components compiled with Babel at built time to be used on the built sites, meant to contain components.

### util
Shared utility components between the frontend and backend.

### www
The frontend of the app using NextJS.

## Deploying
If any of the packages other than `api` or `www` run these commands in the root directory.

```bash
npm run update-packages

npm run publish-packges
```

SSH into the deployment server and navigate to the root directory. Then run:

```bash
git pull

npm run build

npm run restart
```
