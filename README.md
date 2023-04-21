<div align="center">

<img src="./docs/findoc-logo-256.png" alt="Findoc Logo" width="256">

<h2>Yet Another Tool - Fin Doc</h2>

<p>Obsidian.md plugin to read and edit a CSV file, then use it as a data source to generate charts.</p>
<p>I invite you to create PR and Issues with ideas, improvements and etc.</p>

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
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
---

## About

-   Open and Edit CSV Files in Obsidian
-   Generate Charts using the CSV File directly in Obsidian and a Custom Code Block
-   Configurable using Few Settings
-   Support Desktop and Mobile
-   Using [Chart.js](https://www.chartjs.org)
-   Plugin for [Obsidian.md](https://obsidian.md)

---

## Installation

It is still a POC, you can download a release and install it in your local obsidian plugin.

> As soon as the CSV aspect is stable, I will open a PR in the Obsidian Plugin registry.

```bash
npm install
npm run build
```

Move the `main.js` and `manifest.json` to your plugins directory in a directory named `findoc`.

### Releases and Github Actions

```bash
git tag -a X.Y.Z -m "Version X.Y.Z"
git push origin tags/X.Y.Z
```

---

## Usage

### Models

-   **expenses**
-   **expensesMonthly**
-   **portfolio**
-   **incomeYearly**
-   **income**
-   **all**
-   **mortgage**
-   **mortgageRate**
-   **dividend**

Create a PR to create new One.  
You can edit those directly in the setting tab.

### Code Block

You can define this code block directly in your notes.

<pre>
```findoc
filename: finance.csv
model: portfolio
```
</pre>

> See above for all available models.

Once the code block is defined, the hook will try to generate a chart by reading the csv file.

### The CSV File

The CSV Header is :

```csv
Type,Id,Value,TimeStamp,Extra
```

Where **Type** is one of:

-   **Portfolio**
-   **Income**
-   **Mortgage**
-   **Mortgage Rate**
-   **Cotisation**
-   **Dividend**
-   **House Expenses**
-   **Expenses**

The **Id** is preferably _Unique for a group_, otherwise you will have weird behaviour and wrong grouping. Also used in the code as a _category_

The **Value** must be a **Number**

The **Timestamp** is only a _Date_ using this format: `'YYYY-MM-DD'`

The **Extra** is not used.

**Can I use any software and export a CSV File**: Yes.

**What is a category?**: This is the _Id_, for example, you can have an expense (<-Type) for the house (<-Category)

---

## Screenshots

![Dividend Chart](./docs/DividendChart.png)
![Income Chart with Missing Datapoints](./docs/IncomeChartMissingData.png)
![Finance CSV File](./docs/FinanceCSV.png)
![Income Snippet](./docs/IncomeSnippet.png)

---

## Changelog

### TODO

-   [x] Github Actions and create a release to publish this alpha version to Obsidian repo
-   [x] Fix the saving system for CSV Files (Using debounce of at least 1000)
-   [] Improve the setting tab (edit, add and remove colors and models)
-   [] Add more functions to process and analyze the data
-   [] Write better documentation
-   [] Add more Chart types, currently only line chart is supported
-   [x] Support Mobile
-   [x] Support Windows
-   [x] Bug with default dropdown values in the settings tab
-   [-] Copy paste is broken while editing a CSV File (not able to reproduce)

### V0.3.4 - Alpha - 2023-04-20

-   Fixed Mobile CSV Edition, adding margin to show all text (Tested on Iphone only)
-   Improve error handling and user interaction
-   updated method name to prepare the data
-   Added chart details in the footer

<details>
  <summary>### V0.3.3 - Alpha - 2023-04-20</summary>

-   Fixed mobile support
-   Fixed dropdown current value selection

</details>

<details>
  <summary>### V0.3.2 - Alpha - 2023-04-19</summary>

-   Added new Methods to prepare the chart
-   Filter per types instead of categories
-   ISSUE Found: **Not Fixed**. Saw saving issues while copy pasting row in the CSV File

</details>

<details>
  <summary>### V0.3.1 - Alpha - 2023-04-13</summary>

-   Added Windows Support

</details>

<details>
  <summary>### V0.3.0 - Alpha - 2023-04-13</summary>

-   Added Mobile Support

</details>

<details>
  <summary>### V0.2.0 - Alpha - 2023-04-13</summary>

-   Added new type: `Expenses`
-   Started to switch the typescript `any` to correct types
-   Moving code to smaller files
-   Added Github Action Pipeline
-   The debounce seems to be better using this implementation (Still backup your file often)
-   Handle data type to show proper symbol
-   bug fixes
-   Handling invalid CSV lines
-   Handling empty lines

</details>

<details>
  <summary>### V0.1.0 - Alpha - 2023-04-11</summary>

-   Refactor code
-   Added configuration using Obsidian Settings
-   Added screenshots
-   Fix few bugs
-   Specifying default values and test them
-   Fix few issues with the inline CSV file. (Backup your file often !)
-   There still a bug regarding the saving system, I had to find a dirty workaround.

</details>

<details>
  <summary>### V0.0.0 - Alpha - 2023-04-09</summary>

-   Open and Edit CSV Files in Obsidian
-   Generate Charts in Obsidian
-   Provided few models to see financial progress

</details>

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
