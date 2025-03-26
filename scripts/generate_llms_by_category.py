import re
import os

docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
llms_input_path = os.path.join(docs_dir, 'llms.txt') # points to the full llms.txt
output_dir = os.path.join(docs_dir, 'llms-download')  # where we store individual category llms files
os.makedirs(output_dir, exist_ok=True) # makes the directory 

def extract_category(category, core_content=None): # function that will look for all pages tagged with a specific category
    with open(llms_input_path, 'r', encoding='utf-8') as f:
        llms = f.read() # opens and reads the full llms.txt 

    blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---", # uses regex to extract each full doc block
        llms, re.DOTALL
    )

    index_lines = []
    content_blocks = []

    for url, content in blocks: 
        metadata_match = re.search(r"---\n(.*?)\n---", content, re.DOTALL) # search metadata for category tags
        if not metadata_match:
            continue

        metadata = metadata_match.group(1)
        category_line = re.search(r"categories:\s*(.*)", metadata) # looks for categories
        if not category_line:
            continue

        tags = [tag.strip().lower() for tag in category_line.group(1).split(',')] # splits tags by comma 
        if category.lower() in tags:
            index_lines.append(f"Doc-Page: {url}") # store url
            content_blocks.append(f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---") # store full page

    if not content_blocks:
        print(f"[!] Skipping {category} – no matching pages.")
        return

    output_file = os.path.join(output_dir, f"{category.lower()}.llms.txt") # write to output file
    with open(output_file, 'w', encoding='utf-8') as f:

        # Intro context block
        f.write(f"# Wormhole Developer Documentation (LLMS Format)\n\n")
        f.write(f"This file contains documentation for Wormhole (https://wormhole.com), a cross-chain messaging protocol.\n")
        f.write("It is intended for use with large language models (LLMs) to assist developers integrating Wormhole.\n\n")
        f.write(f"This file includes documentation related to: {category}\n\n")

        # Index section
        f.write(f"# List of doc pages:\n")
        f.write('\n'.join(index_lines))
        f.write("\n\n# Full content for each doc page\n\n")
        f.write('\n\n'.join(content_blocks))

        # Attach core content 
        if core_content and category.lower() != "core":
            f.write("\n\n# Shared Core Concepts\n")
            f.write("The following section contains shared core documentation relevant to all Wormhole products.\n")
            f.write("It includes essential messaging infrastructure concepts such as VAA structure, guardians, modules, and message flow.\n")
            f.write("\n---\n\n")
            f.write(core_content.strip())
    print(f"[✓] Generated {output_file} with {len(content_blocks)} pages + core" if core_content and category.lower() != "core" else f"[✓] Generated {output_file} with {len(content_blocks)} pages")

def generate_all_categories():
    # First, extract and store core content
    extract_category('Core')

    core_path = os.path.join(output_dir, 'core.llms.txt')
    with open(core_path, 'r', encoding='utf-8') as f:
        core_content = f.read()

    categories = [
        'NTT',
        'Connect',
        'Token Bridge',
        'Settlement',
        'Relayers',
        'MultiGov',
        'Queries',
        'Transfer'
    ]

    # Now extract other categories and append core
    for cat in categories:
        extract_category(cat, core_content)


# Only run this if script is executed directly
if __name__ == "__main__":
    generate_all_categories()


