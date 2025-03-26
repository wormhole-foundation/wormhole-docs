import re
import os

# Customize the order of sections as they appear in URLs
SECTION_PRIORITY = ["learn", "build", "tutorials"]

docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
llms_input_path = os.path.join(docs_dir, 'full-llms.txt') # points to the full full-llms.txt
output_dir = os.path.join(docs_dir, 'llms-download')  # where we store individual category llms files
os.makedirs(output_dir, exist_ok=True) # makes the directory 

def extract_category(category, core_data=None): # function that will look for all pages tagged with a specific category
    with open(llms_input_path, 'r', encoding='utf-8') as f:
        llms = f.read() # opens and reads the full-llms.txt 

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

        def infer_section_label(url):
            for section in SECTION_PRIORITY:
                if f"/{section}/" in url:
                    return section
            return "other"

        tags = [tag.strip().lower() for tag in category_line.group(1).split(',')] # splits tags by comma 
        if category.lower() in tags:
            section_label = infer_section_label(url)
            index_lines.append(f"Doc-Page: {url} [type: {section_label}]") # store url
            content_blocks.append(f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---") # store full page

    if not content_blocks:
        print(f"[!] Skipping {category} – no matching pages.")
        return

    output_file = os.path.join(output_dir, f"{category.lower()}.llms.txt") # write to output file
    with open(output_file, 'w', encoding='utf-8') as f:

        # Intro context block
        f.write(f"# Wormhole Developer Documentation (LLMS Format)\n\n")
        f.write("This file contains documentation for Wormhole (https://wormhole.com), a cross-chain messaging protocol used to move data and assets between blockchains.\n")
        f.write("It is intended for use with large language models (LLMs) to support developers working with Wormhole. The content includes selected pages from the official docs, organized by product category and section.\n\n")
        f.write(f"This file includes documentation related to: {category}\n")
        f.write("Each listed page may include implementation guides, conceptual overviews, or reference material.\n\n")

        # AI Prompt Template block
        f.write("# AI Prompt Template\n\n")
        f.write("You are an AI developer assistant for Wormhole (https://wormhole.com). Your task is to assist developers in understanding and using the product described in this file.\n")
        f.write("- Provide accurate answers based only on the included documentation.\n")
        f.write("- Do not assume undocumented features, behaviors, or APIs.\n")
        f.write("- If unsure, respond with “Not specified in the documentation.”\n")
        f.write("- Prefer concise explanations and code snippets where appropriate.\n\n")

        # Sort index/content pairs using SECTION_PRIORITY
        def sort_key(pair):
            url = pair[0]
            for i, section in enumerate(SECTION_PRIORITY):
                if f"/{section}/" in url:
                    return (i, url)
            return (len(SECTION_PRIORITY), url)  # fallback for anything not matching

        combined = list(zip(index_lines, content_blocks))
        combined.sort(key=sort_key)
        sorted_index_lines, sorted_content_blocks = zip(*combined) if combined else ([], [])

        # Index section
        f.write(f"# List of doc pages:\n")
        f.write('\n'.join(sorted_index_lines))
        f.write("\n\n# Full content for each doc page\n\n")
        f.write('\n\n'.join(sorted_content_blocks))

        # Attach core content 
        if core_data and category.lower() != "core":
            core_index, core_content = core_data  # unpack the tuple
            f.write("\n\n# Core Concepts [shared: true]\n")
            f.write("The following section contains foundational documentation shared across all Wormhole products.\n")
            f.write("It covers core messaging infrastructure concepts such as the Wormhole core contracts, VAA (Verifiable Action Approval) structure, guardian set functionality, and cross-chain message flow.\n")
            f.write("This context is critical to understanding how any Wormhole integration works.\n")
            f.write("\n---\n\n")
            f.write("# List of core concept pages:\n")
            f.write(core_index + "\n\n")
            f.write("# Full content for core concepts:\n\n")
            f.write(core_content)
    print(f"[✓] Generated {output_file} with {len(content_blocks)} pages")

def generate_all_categories():
    # First, extract and store core content
    extract_category('Core')

    core_path = os.path.join(output_dir, 'core.llms.txt')

    with open(core_path, 'r', encoding='utf-8') as f:
        raw_core = f.read()

    # Extract index block
    core_index_match = re.search(r"# List of doc pages:\n(.*?)\n\n# Full content", raw_core, re.DOTALL)
    core_index = core_index_match.group(1).strip() if core_index_match else ""

    # Extract all content blocks
    core_blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---",
        raw_core, re.DOTALL
    )

    core_content = ""
    for url, content in core_blocks:
        core_content += f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---\n\n"

    core_data = (core_index, core_content.strip())

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
        extract_category(cat, core_data)

# Only run this if script is executed directly
if __name__ == "__main__":
    generate_all_categories()


