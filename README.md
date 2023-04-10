<div align="center">

<!-- <img src="./docs/vault.png" alt="Project Logo" width="256"> -->

<h2>Yet Another Tool - Fin Doc</h2>

<p>Simple plugin to edit a CSV file in Obsidian.</p>
<p>The goal is to show charts using the CSV file as the data source.</p>
<p>This is still a POC, I invite you to create PR and Issues with ideas, improvements and etc.</p>

<p align="center">
  <a href="https://github.com/yet-another-tool/obsidian-findoc/issues">Report Bug</a>
  ·
  <a href="https://github.com/yet-another-tool/obsidian-findoc/issues">Request Feature</a>
</p>
</div>

---

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#changelog">Changelog</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
---

## About

-   Open and Edit CSV Files in Obsidian
-   Generate Charts using the CSV File directly in Obsidian and Custom Code Block

---

## Installation

It is still a POC, so for now you have to build and move the files manually

```bash
npm install
npm run build
```

Move the `main.js` and `manifest.json` to your plugins directory in a directory named `findoc`.

---

## Usage

### Models

-   expenses
-   expensesMonthly
-   portfolio
-   incomeYearly
-   income
-   all
-   mortgage
-   mortgageRate
-   dividend

### Code Block

You can define this code block by specifying your filename, in this example: `finance.csv` and the model to use, in this case `portfolio`. See above for all available models.

<pre>
```findoc
filename: finance.csv
model: portfolio
```
</pre>

Once the code block is defined, the hook will try to generate charts by reading the csv file.

### The CSV File

The Header is :

```csv
Type,Id,Value,TimeStamp,Extra
```

Where **Type** is one of:

-   Portfolio
-   Income
-   Mortgage
-   Mortgage Rate
-   Cotisation
-   Dividend
-   House Expenses

The **Id** is preferably _Unique for a group_, otherwise you will have weird behaviour and wrong grouping.

The **Value** must be a **Number**

The **Timestamp** is only a _Date_ using this format: `'YYYY-MM-DD'`

The **Extra** is not used.

---

## Changelog

The [TODO](./TODO)

### V0.0.0 - Alpha - 2023-04-09

-   Open and Edit CSV Files in Obsidian
-   Generate Charts in Obsidian
-   Provided few models to see financial progress

---

## Contributing

1. Create a Feature Branch
2. Commit your changes
3. Push your changes
4. Create a PR

<details>
<summary>Working with your local branch</summary>

**Branch Checkout:**

```bash
git checkout -b <feature|fix|release|chore|hotfix>/prefix-name
```

> Your branch name must starts with [feature|fix|release|chore|hotfix] and use a / before the name;
> Use hyphens as separator;
> The prefix correspond to your Kanban tool id (e.g. abc-123)

**Keep your branch synced:**

```bash
git fetch origin
git rebase origin/master
```

**Commit your changes:**

```bash
git add .
git commit -m "<feat|ci|test|docs|build|chore|style|refactor|perf|BREAKING CHANGE>: commit message"
```

> Follow this convention commitlint for your commit message structure

**Push your changes:**

```bash
git push origin <feature|fix|release|chore|hotfix>/prefix-name
```

**Examples:**

```bash
git checkout -b release/v1.15.5
git checkout -b feature/abc-123-something-awesome
git checkout -b hotfix/abc-432-something-bad-to-fix
```

```bash
git commit -m "docs: added awesome documentation"
git commit -m "feat: added new feature"
git commit -m "test: added tests"
```

</details>

### Local Development

```bash
npm install
npm run build
```

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

-   Tommy Gingras @ tommy@studiowebux.com | Studio Webux

<div>
<b> | </b>
<a href="https://www.buymeacoffee.com/studiowebux" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 30px !important; width: 105px !important"
/></a>
<b> | </b>
<a href="https://webuxlab.com" target="_blank"
      ><img
        src="https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg"
        alt="Webux Logo"
        style="height: 30px !important"
/> Webux Lab</a>
<b> | </b>
</div>
