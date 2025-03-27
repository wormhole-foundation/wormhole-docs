import re
import os

# --- Context Configuration ---
PROJECT_NAME = "Wormhole"
PROJECT_URL = "https://wormhole.com"
PROJECT_DESCRIPTION = (
    f"{PROJECT_NAME} ({PROJECT_URL}) is a cross-chain messaging protocol used to move data and assets between blockchains."
)

AI_PROMPT_TEMPLATE = f"""# AI Prompt Template

You are an AI developer assistant for {PROJECT_NAME} ({PROJECT_URL}). Your task is to assist developers in understanding and using the product described in this file.
- Provide accurate answers based only on the included documentation.
- Do not assume undocumented features, behaviors, or APIs.
- If unsure, respond with “Not specified in the documentation.”
- Prefer concise explanations and code snippets where appropriate.

"""

CORE_CONTEXT_DESCRIPTION = (
    "The following section contains foundational documentation shared across all "
    f"{PROJECT_NAME} products.\n"
    "It covers core messaging infrastructure concepts such as the core contracts, VAA (Verifiable Action Approval) structure,"
    "guardian set functionality, and cross-chain message flow.\n"
    "This context is critical to understanding how any integration works.\n"
)

# Define order in which sections sections should be prioritized when sorting pages
SECTION_PRIORITY = ["learn", "build", "tutorials"]

docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) # path to docs directory 
llms_input_path = os.path.join(docs_dir, 'full-llms.txt') # points to the full full-llms.txt
output_dir = os.path.join(docs_dir, 'llms-download')  # path where we store individual category llms files
os.makedirs(output_dir, exist_ok=True) # make the directory if it doesn't exist

# Extracts and writes a per-category LLMS file with optional shared core content.
def extract_category(category, core_data=None): 
    with open(llms_input_path, 'r', encoding='utf-8') as f: # Read the full LLMS input file
        llms = f.read() 

    # Extract all documentation blocks based on URL and content boundaries
    blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---", # regex 
        llms, re.DOTALL
    )

    index_lines = [] 
    content_blocks = [] 

    for url, content in blocks: 
        metadata_match = re.search(r"---\n(.*?)\n---", content, re.DOTALL) # extract the metadata block to find categories
        if not metadata_match:
            continue

        metadata = metadata_match.group(1)

        category_line = re.search(r"categories:\s*(.*)", metadata) # looks for a line starting with 'categories:' in the metadata
        if not category_line:
            continue

        # Helper function to classify the doc page based on URL path
        def infer_section_label(url):
            for section in SECTION_PRIORITY:
                if f"/{section}/" in url:
                    return section
            return "other"

        # Check if the given category is listed in the metadata
        tags = [tag.strip().lower() for tag in category_line.group(1).split(',')] # splits tags by comma 
        if category.lower() in tags:
            section_label = infer_section_label(url)
            index_lines.append(f"Doc-Page: {url} [type: {section_label}]") # store url
            content_blocks.append(f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---") # store full page

    # If no pages matched the category, skip 
    if not content_blocks:
        print(f"[!] Skipping {category} – no matching pages.")
        return

    # Output file for this category
    output_file = os.path.join(output_dir, f"{category.lower()}.llms.txt") # write to output file
    with open(output_file, 'w', encoding='utf-8') as f:

        # Intro context block to help LLMs understand purpose of the file
        f.write(f"# {PROJECT_NAME} Developer Documentation (LLMS Format)\n\n")
        f.write(f"This file contains documentation for {PROJECT_DESCRIPTION}\n")
        f.write("It is intended for use with large language models (LLMs) to support developers working with Wormhole. The content includes selected pages from the official docs, organized by product category and section.\n\n")
        f.write(f"This file includes documentation related to: {category}\n")
        f.write("Each listed page may include implementation guides, conceptual overviews, or reference material.\n\n")

        # Prompt block to guide the AI assistant's behavior
        f.write(AI_PROMPT_TEMPLATE)

        # Sort the documentation blocks by section priority
        def sort_key(pair):
            url = pair[0]
            for i, section in enumerate(SECTION_PRIORITY):
                if f"/{section}/" in url:
                    return (i, url)
            return (len(SECTION_PRIORITY), url)  # fallback for anything not matching

        combined = list(zip(index_lines, content_blocks))
        combined.sort(key=sort_key)
        sorted_index_lines, sorted_content_blocks = zip(*combined) if combined else ([], [])

        # Write the index and content blocks
        f.write(f"# List of doc pages:\n")
        f.write('\n'.join(sorted_index_lines))
        f.write("\n\n# Full content for each doc page\n\n")
        f.write('\n\n'.join(sorted_content_blocks))

        # Attach shared core documentation
        if core_data and category.lower() != "core":
            core_index, core_content = core_data  # unpack the tuple
            f.write("\n\n# Core Concepts [shared: true]\n")
            f.write(CORE_CONTEXT_DESCRIPTION)
            f.write("\n---\n\n")
            f.write("# List of core concept pages:\n")
            f.write(core_index + "\n\n")
            f.write("# Full content for core concepts:\n\n")
            f.write(core_content)
    print(f"[✓] Generated {output_file} with {len(content_blocks)} pages") # log successful generation

# Generate LLMS files for all categories including shared core content.
def generate_all_categories():
   
    extract_category('Core') # generate and store the core concepts file
    core_path = os.path.join(output_dir, 'core.llms.txt')
    with open(core_path, 'r', encoding='utf-8') as f:
        raw_core = f.read()

    # Extract just the index and content sections from the core file
    core_index_match = re.search(r"# List of doc pages:\n(.*?)\n\n# Full content", raw_core, re.DOTALL)
    core_index = core_index_match.group(1).strip() if core_index_match else ""

    core_blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---",
        raw_core, re.DOTALL
    )

    core_content = ""
    for url, content in core_blocks:
        core_content += f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---\n\n"

    # Bundle core info into a reusable tuple
    core_data = (core_index, core_content.strip())

    # Define the list of categories to extract from the full LLMS file
    categories = ['NTT', 'Connect', 'Token Bridge', 'Settlement', 'Relayers', 'MultiGov', 'Queries', 'Transfer']

    # # Generate each category file
    for cat in categories:
        extract_category(cat, core_data)

# Only run this if script is executed directly
if __name__ == "__main__":
    generate_all_categories()


