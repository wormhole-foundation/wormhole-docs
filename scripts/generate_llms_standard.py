# Wormhole-specific input
docs_repo = 'wormhole-docs'
docs_url = 'https://wormhole.com/docs/'

import yaml
import os
import re
import requests
import json
from transform_tables import transform_html_tables_to_markdown

# Load configuration from llms_config.json
config_path = os.path.join(os.path.dirname(__file__), 'llms_config.json')
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# Configuration variables
PROJECT_NAME = config["projectName"]
PROJECT_URL = config["projectUrl"]
PROJECT_DESCRIPTION = config["projectDescription"]

# Set the base directory to the root of docs
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
docs_dir = os.path.join(base_dir, docs_repo)
yaml_dir = os.path.join(base_dir, docs_repo, 'variables.yml')
output_file = os.path.join(docs_dir, 'llms-full.txt')
snippet_dir = os.path.join(docs_dir, '.snippets')
# GitHub raw URL base (instead of website)
raw_base_url = "https://raw.githubusercontent.com/wormhole-foundation/wormhole-docs/refs/heads/main"

# Regex to find lines like: --8<-- 'code/build/applications/...' and --8<-- 'http....'
SNIPPET_REGEX = r"--8<--\s*['\"](https?://[^'\"]+|[^'\"]+)['\"]"

def get_all_markdown_files(directory):
    """
    Recursively collect all markdown (.md, .mdx) files from subdirectories of the given directory,
    skipping files directly in the root of docs.
    """
    results = []
    if not os.path.exists(directory):
        print(f"Docs directory not found: {directory}")
        return results

    for root, _, files in os.walk(directory):
        # Skip the root directory
        if root == directory:
            continue

        # Skip any hidden directory (starts with '.')
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue

        # Skip standard noise folders
        if any(excluded in root.split(os.sep) for excluded in ['.github', 'node_modules', 'venv']):
            continue

        for file in files:
            if file.endswith(('.md', '.mdx')):
                results.append(os.path.join(root, file))

    # Sort the files to ensure consistent order
    results.sort()  # Sorting alphabetically
    return results

def build_index_section(files):
    section = "## List of doc pages:\n"

    for file in files:
        relative_path = os.path.relpath(file, docs_dir)

        # Skip .snippets from the index
        if '.snippets' in relative_path.split(os.sep):
            continue

        # Use the raw GitHub URL directly with the .md/.mdx file intact
        rel_path = os.path.relpath(file, docs_dir)
        raw_url = f"{raw_base_url}/{rel_path.replace(os.sep, '/')}"
        section += f"Doc-Page: {raw_url}\n"
    return section

# Parse snippet paths to extract file and line ranges if available.
def parse_line_range(snippet_path):

    parts = snippet_path.split(':')
    file_only = parts[0]
    line_start = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else None
    line_end = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else None
    return file_only, line_start, line_end

def replace_snippet_placeholders(markdown, snippet_directory, yaml_file):
    def replacement(match):
        snippet_ref = match.group(1)

        # Handle local file or remote GitHub snippet
        if snippet_ref.startswith("http"):
            return fetch_remote_snippet(snippet_ref, yaml_file)
        else:
            return fetch_local_snippet(snippet_ref, snippet_directory)

    return re.sub(SNIPPET_REGEX, replacement, markdown)

def fetch_local_snippet(snippet_ref, snippet_directory):
    file_only, line_start, line_end = parse_line_range(snippet_ref)
    absolute_snippet_path = os.path.join(snippet_directory, file_only)

    if not os.path.exists(absolute_snippet_path):
        print(f"Snippet file not found: {absolute_snippet_path}. Leaving placeholder unchanged.")
        return snippet_ref

    with open(absolute_snippet_path, 'r', encoding='utf-8') as snippet_file:
        snippet_content = snippet_file.read()
        snippet_content = transform_html_tables_to_markdown(snippet_content)

    if line_start is not None and line_end is not None:
        lines = snippet_content.split('\n')
        snippet_content = '\n'.join(lines[line_start:line_end])

    return snippet_content.strip()

def fetch_remote_snippet(snippet_ref, yaml_data):
    
    # Match URL with optional line range (start:end)
    match = re.match(r'^(https?://[^:]+)(?::(\d+))?(?::(\d+))?$', snippet_ref)

    if not match:
        print(f"Invalid snippet reference format: {snippet_ref}")
        return f"Invalid snippet reference: {snippet_ref}"

    url = match.group(1)
    line_start = int(match.group(2)) if match.group(2) else None
    line_end = int(match.group(3)) if match.group(3) else None

    url = resolve_placeholders(url, yaml_data) # resolve any template placeholders using the yaml_data

    # Skip URLs containing unresolved template placeholders
    if "{{" in url:
        print(f"Skipping snippet with unresolved template: {url}")
        return f"Unresolved template: {url}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        snippet_content = response.text        

        # Extract specific lines if requested
        if line_start is not None and line_end is not None:
            lines = snippet_content.split('\n')
            snippet_content = '\n'.join(lines[line_start-1:line_end])

        return snippet_content.strip()
    except requests.RequestException as e:
        print(f"Failed to fetch snippet from {url}: {e}")
        return f"Error fetching snippet from {url}"

def resolve_placeholders(text, data):
    # Replace placeholders like {{dependencies.asset_transfer_api.version}}
    while True:
        match = re.search(r'{{(.*?)}}', text)
        if not match:
            break
        key_path = match.group(1).strip()
        value = get_value_from_path(data, key_path)
        if value is None:
            print(f"Warning: Unresolved key path {key_path} in {text}")
            break
        text = text.replace(match.group(0), str(value))
    return text

def get_value_from_path(data, path):
    keys = path.split('.')
    value = data
    for key in keys:
        if key not in value:
            return None
        value = value[key]
    return value

def build_content_section(files,yaml_file):
    section = "\n## Full content for each doc page\n\n"

    for file in files:
        relative_path = os.path.relpath(file, docs_dir)

        # Skip printing .snippets individually
        if '.snippets' in relative_path.split(os.sep):
            continue

        doc_url = f"{raw_base_url}/{relative_path.replace(os.sep, '/')}"

        with open(file, 'r', encoding='utf-8') as file_content:
            content = file_content.read()

        # Replace snippet placeholders
        content = replace_snippet_placeholders(content, snippet_dir, yaml_file)

        section += f"Doc-Content: {doc_url}\n"
        section += "--- BEGIN CONTENT ---\n"
        section += content.strip()
        section += "\n--- END CONTENT ---\n\n"

    return section

def load_yaml(yaml_file):
    with open(yaml_file, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)

# generate lms.txt – a streamlined view of the documentation structure
# Format: [Page Title](URL): description
def generate_llms_structure_txt(files):

    structure_output = os.path.join(docs_dir, 'llms.txt')
    
    structure_lines = [
        f"# {PROJECT_NAME}",
        "", 
        f"> {PROJECT_DESCRIPTION}",
        "",  
        "## Docs",
        ""
    ]

    for file in files:
        if not os.path.exists(file) or '.snippets' in file:
            continue

        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract metadata frontmatter
        metadata_match = re.search(r"---\n(.*?)\n---", content, re.DOTALL)
        if metadata_match:
            try:
                metadata_yaml = yaml.safe_load(metadata_match.group(1))
                title = metadata_yaml.get('title', 'Untitled')
                description = metadata_yaml.get('description', 'No description available.')
            except yaml.YAMLError:
                title = 'Untitled'
                description = 'No description available.'
        else:
            title = 'Untitled'
            description = 'No description available.'

        # Use the raw GitHub URL directly with the .md/.mdx file intact
        rel_path = os.path.relpath(file, docs_dir)
        doc_url = f"{raw_base_url}/{rel_path.replace(os.sep, '/')}"

        structure_lines.append(f"- [{title}]({doc_url}): {description}")

    # Write output file
    with open(structure_output, 'w', encoding='utf-8') as f:
        f.write('\n'.join(structure_lines))

    print(f"[✓] Generated llms.txt at: {structure_output}")

def generate_standard_llms():
    files = get_all_markdown_files(docs_dir)
    yaml_file = load_yaml(yaml_dir)

    # Header
    llms_content = f"# {PROJECT_NAME} llms-full.txt\n"
    llms_content += f"{PROJECT_NAME}. {PROJECT_DESCRIPTION}\n\n"
    llms_content += "## Generated automatically. Do not edit directly.\n\n"
    llms_content += f"Documentation: {docs_url}\n\n"

    # Add the index of pages
    llms_content += build_index_section(files)

    # Add the full content
    llms_content += build_content_section(files, yaml_file)

    # Write to llms-full.txt
    with open(output_file, 'w', encoding='utf-8') as output:
        output.write(llms_content)

    print(f"llms-full.txt created or updated at: {output_file}")

    # generate to llms.txt
    generate_llms_structure_txt(files)

if __name__ == "__main__":
    generate_standard_llms()
