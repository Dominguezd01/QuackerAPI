# Ducker API

This is the api of [Ducker](https://github.com/Dominguezd01/Ducker "Ducker Repo") a Twitter inspired social media that I'm making for my final project.

## Development

Clone the repository:

```bash
git clone https://github.com/Dominguezd01/duckerAPI.git
```

Go to the directory

```bash
cd duckerAPI
```

Install dependencies

```bash
bun install
```

To run the project you can either use two of this commands:

    If you dont want the server to restart with every change run this command:

```bash
bun index.ts
```

   If you want the server to reload every time a change occurs in the code run this command:

```bash
bun run dev
```

## Building

To build the app, run the following command to compile to JS all the project.

`--outdir` sets the output directory where the index.js file will be created

`--target` sets, in this case the target of usage to NodeJS

```bash
bun build index.ts --outdir build --target node
```
