# ------------- 👋 Welcome to the script for calculating redirect mappings ---------------#
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
# The purpose of this script is to calculate redirect mappings for the `mkdocs.yml` file. #
# The script works by looking at the current file directory in the `master` branch and    #
# on your local branch. It compares the two file structures to see if content has been    #
# moved at all. If any content has been moved, the script will try to match the moved     #
# content and add it to the `redirect_maps` config in `mkdocs.yml`.                       #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
# To use the script, ensure that the `moonbeam-docs` repo is nestled inside of the        #
# `moonbeam-mkdocs` repo and on your branch with the latest changes. Then simply run      #
# `python scripts/calculate-redirects.py <github_repo> <base_branch> <compare_branch>     #
# <language>` in your terminal.                                                           #
#                                                                                         #
# Command-line arguments:                                                                 #
#   - `github_repo`: Repository name (default: moonbeam-foundation/moonbeam-docs)         #
#   - `base_branch`: Base branch name (e.g., main)                                        #
#   - `compare_branch`: Compare branch name (e.g., new_branch)                            #
#   - `language`: Language choice for redirects YAML file (choices: en or cn, default: en)#
#                                                                                         #
# Example usage:                                                                          #
#   python py_scripts/calc_redirects.py wormhole-foundation/wormhole-docs main INSERT_NEW_BRANCH #                                                              #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #

import os
import yaml
import argparse
import requests

def update_redirects(redirect_mappings, yaml_file):
    # Open the YAML file and read its lines
    with open(yaml_file, 'r') as file:
        lines = file.readlines()

    # Initialize a flag to track if the redirect_maps section is found
    redirect_maps_found = False
    redirect_maps_start = -1
    redirect_maps_end = -1

    # Find the start and end indices of the redirect_maps section
    for i, line in enumerate(lines):
        if 'redirect_maps' in line:
            redirect_maps_found = True
            redirect_maps_start = i + 1  # Start after the redirect_maps line
        elif redirect_maps_start != -1 and line.strip() == '- macros:':
            redirect_maps_end = i
            break

    # If redirect_maps section is found, delete the old mappings
    if redirect_maps_found:
        del lines[redirect_maps_start:redirect_maps_end]

    # Insert the new mappings
    if redirect_mappings:
        if not redirect_maps_found:
            # Find the index of the last line before the plugins section
            plugins_index = lines.index('plugins:\n') + 1
            # Insert redirect_maps section before the plugins section
            lines.insert(plugins_index, '  - redirects:\n')
            lines.insert(plugins_index + 1, '      redirect_maps:\n')

        # Find the index of the redirect_maps section
        redirect_maps_index = lines.index('      redirect_maps:\n') + 1

        # Sort the redirect mappings alphabetically by source
        sorted_mappings = sorted(redirect_mappings.items())

        # Insert the new redirect mappings
        for source, destination in sorted_mappings:
            mapping_line = f'        {source}: {destination}\n'
            lines.insert(redirect_maps_index, mapping_line)
            redirect_maps_index += 1

    # Write the updated lines back to the file
    with open(yaml_file, 'w') as file:
        file.writelines(lines)

    print("✅ Process complete! You can review the redirects in the mkdocs.yml file")


# Function to check if a file name is a key or a value
def check_file_in_redirects(file_name, redirects):
    for key, value in redirects.items():
        if file_name == value:
            return key, value
    return None


# Function to generate redirects
def generate_redirects(github_repo, base_branch, compare_branch, language):
    # Load existing redirects from mkdocs.yml
    if language == "cn":
        mkdocs_yaml_path = "mkdocs-cn/mkdocs.yml"
    else:
        mkdocs_yaml_path = "mkdocs.yml"
    redirects = load_redirects_from_mkdocs(mkdocs_yaml_path)

    # Get list of changed files on the compare_branch compared to the base_branch
    compare_commit = get_commit_sha(github_repo, compare_branch)
    base_commit = get_commit_sha(github_repo, base_branch)
    comparison = get_commit_comparison(github_repo, base_commit, compare_commit)
    for file in comparison["files"]:
        filename = file["filename"]
        if filename.endswith(".md") and ".snippets" not in filename:
            if file["status"] == "removed":
                result = check_file_in_redirects(filename, redirects)
                # If there's a previous redirect to the removed page,
                # we need to update the previous redirect and add a new redirect
                if result:
                    key, value = result     
                    print("File deleted with no replacement file found. Please double check the entry with this key:", key)
                    redirects[key] = "index.md" # Set the original redirect to index.md
                    print("File deleted with no replacement file found. Please double check the entry with this key:", value)
                    redirects[value] = "index.md" # Set the original redirected target to index.md

                    # Find all sources that redirect to the same destination
                    sources_to_update = [k for k, v in redirects.items() if v == value]

                    # Update all matching redirects to the new value
                    for src in sources_to_update:
                        print("File deleted with no replacement file found. Please double check the entry with this key:", src)
                        redirects[src] = "index.md"
                else:
                    # Create a new redirect
                    redirects[filename] = "index.md"
            elif file["status"] == "renamed":
                prev_file = file["previous_filename"]
                result = check_file_in_redirects(prev_file, redirects)
                if result:
                    key, value = result

                    # It's possible that a page was previously redirected but now restored. If that's the case
                    # we delete the key. Otherwise, we update the redirect
                    if (key == filename):  
                        del redirects[key]
                    else:
                        redirects[key] = (
                            filename  # Set the original redirect to the new file name
                        )

                    redirects[value] = (
                        filename  # Set the redirected redirect to the new file name
                    )

                    # Find all sources that redirect to the same destination
                    sources_to_update = [k for k, v in redirects.items() if v == value]

                    # Update all matching redirects to the new value
                    for src in sources_to_update:
                        redirects[src] = filename
                else:
                    # Create a new redirect
                    redirects[prev_file] = filename

    # Save updated redirects to mkdocs.yml
    update_redirects(redirects, mkdocs_yaml_path)


# Define custom constructor for !ENV tag
def env_constructor(loader, node):
    value = loader.construct_scalar(node)
    return os.environ.get(value, "")


# Add the custom constructor to the SafeLoader
yaml.SafeLoader.add_constructor("!ENV", env_constructor)


# Ignore unknown entries in the yaml file
def ignore_unknown(loader, tag_suffix, node):
    return None


yaml.SafeLoader.add_multi_constructor("tag:yaml.org,2002:python/", ignore_unknown)


# Function to load redirects from mkdocs.yml
def load_redirects_from_mkdocs(mkdocs_yaml_file):
    redirects = {}
    if os.path.exists(mkdocs_yaml_file):
        with open(mkdocs_yaml_file, "r") as file:
            mkdocs_config = yaml.load(file, Loader=yaml.SafeLoader)
            for plugin in mkdocs_config.get("plugins", []):
                if isinstance(plugin, dict) and "redirects" in plugin:
                    redirects = plugin["redirects"].get("redirect_maps", {})
                    break
    return redirects


# Function to get commit SHA for a given branch
def get_commit_sha(github_repo, branch):
    url = f"https://api.github.com/repos/{github_repo}/commits/{branch}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()["sha"]


# Function to get commit comparison between two commits
def get_commit_comparison(github_repo, base_commit, compare_commit):
    url = f"https://api.github.com/repos/{github_repo}/compare/{base_commit}...{compare_commit}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(
        description="Generate redirects for changed files in a GitHub repository."
    )
    parser.add_argument(
        "github_repo",
        type=str,
        default="moonbeam-foundation/moonbeam-docs",
        help="Repository name (default: moonbeam-foundation/moonbeam-docs-cn)",
    )
    parser.add_argument("base_branch", type=str, help="Base branch name (e.g., main)")
    parser.add_argument(
        "compare_branch", type=str, help="Compare branch name (e.g., new_branch)"
    )
    parser.add_argument(
        "language",
        type=str,
        choices=["en", "cn"],
        nargs="?",
        default="en",
        help="YAML file containing redirects (choices: en or cn, default: en)",
    )

    # Parse arguments
    args = parser.parse_args()

    # Generate redirects
    print("⏱️ Generating redirects... just a few moments...")
    generate_redirects(
        args.github_repo, args.base_branch, args.compare_branch, args.language
    )