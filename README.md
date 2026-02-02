# Wormhole Documentation

This repository contains the documentation content and MkDocs framework for the Wormhole documentation site. Wormhole is an interoperability platform powering multichain apps and bridges.

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

## Workflows

The CI workflows in this repository were adapted from (and inspired by) [PaperMoon](https://papermoon.io/)’s MkDocs workflows previously used for Wormhole Docs.

Original reference implementation: [PaperMoon Workflows](https://github.com/papermoonio/wormhole-mkdocs/tree/main/.github/workflows)

## Repository Structure

```text
wormhole-docs/
|--- /docs/                  # Documentation content (markdown files, images, snippets)
|--- /material-overrides/    # Theme customizations and overrides
|--- /scripts/               # Build and utility scripts
|--- /py_scripts/            # Python scripts
|--- mkdocs.yml              # MkDocs configuration
|--- requirements.txt        # Python dependencies
```

## Install Dependencies

To get started, install the required dependencies:

```bash
pip install -r requirements.txt
```

## Getting Started

To build and serve the site locally:

```bash
mkdocs serve
```

After a successful build, the site should be available at `http://127.0.0.1:8000`.

## Editing Theme Files

If you're editing any of the files in the `material-overrides` directory, run the following command to watch for changes and render them automatically:

```bash
mkdocs serve --watch-theme
```

Otherwise, you'll need to stop the server (`control + C`) and restart it (`mkdocs serve`) to see the changes.

## AI Resources

This repository includes AI-ready files generated from the documentation to support large language models (LLMs) and developer tools:

- **`llms.txt`**: A plain-text index of all documentation pages with titles and URLs.
- **`llms-full.jsonl`**: The complete content of all documentation pages in a single file.
- **`<category>.md`**: Category-specific files for products like NTT, Token Bridge, Connect, and others.

These files power AI assistants, enable semantic code search, and integrate Wormhole docs into tools like Cursor. For details, visit the [AI Resources](https://wormhole.com/docs/ai-resources/ai-resources/) page.

## Contributing

If you're interested in contributing to this repository, please feel free to clone the repo, make changes, and open a PR. Please review the guidelines in the [.CONTRIBUTING.md](.CONTRIBUTING.md) file before making any changes.

## Disclaimer

This software and its content are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. All content is provided for educational purposes. See the License for the specific language governing permissions and limitations under the License.
