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

## About

-   Open and Edit CSV Files in Obsidian
-   Generate Charts using the CSV File directly in Obsidian and a Custom Code Block
-   Configurable using Few Settings
-   Support Desktop and Mobile (tested on Windows, MacOS and Iphone)
-   Using [Chart.js](https://www.chartjs.org)
-   Plugin for [Obsidian.md](https://obsidian.md)

---

## Installation and Usage

Documentation is available here: https://studiowebux.github.io/obsidian-plugins-docs/docs/category/plugin-financial-doc

### Releases and Github Actions

```bash
git tag -a X.Y.Z -m "Version X.Y.Z"
git push origin tags/X.Y.Z
```

---

## Screenshots

![Dividend Chart](./docs/DividendChart.png)
![Income Chart with Missing Datapoints](./docs/IncomeChartMissingData.png)
![Income Snippet](./docs/IncomeSnippet.png)
![Select Categories in Settings](./docs/V0.5.0/categories-settings.png)
![New Interface](./docs/v0.5.4/new-interface.png)
![Auto complete](./docs/v0.5.4/autocomplete.png)

---

## Changelog

### TODO

-   [-] Copy paste is broken while editing a CSV File (not able to reproduce)
-   [] Improve the setting tab (edit, add and remove models)
-   [] Add more functions to process and analyze the data
-   [] Write better documentation
-   [] Add more Chart types, currently only line chart is supported
-   [] Add reports using pie chart or something like that
-   [POC] Add reports in table view
-   [] configurable autocomplete (toggle on/off)

### V0.5.4 - Beta - 2023-09-28

-   Added autocomplete for IDs (auto fill the type and the id when clicked)
-   Allow to use the last row as a template when clicking Add New Row
-   Added configuration to enable/disable the add new row template
-   Added Button to duplicate an entry (it is appended at the end of the table)

![New Interface](./docs/v0.5.4/new-interface.png)
![Auto complete](./docs/v0.5.4/autocomplete.png)

See [CHANGELOG](./CHANGELOG)

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
