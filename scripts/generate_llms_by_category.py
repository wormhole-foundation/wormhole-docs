import re
import os
import json

# Load configuration from llms_config.json
CONFIG_FILE = 'llms_config.json'  
script_dir = os.path.dirname(__file__)
config_path = os.path.join(script_dir, CONFIG_FILE)

with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# Configuration variables
PROJECT_NAME = config["projectName"]
PROJECT_URL = config["projectUrl"]
RAW_BASE_URL = config["raw_base_url"]
PROJECT_DESCRIPTION = config["projectDescription"]
SECTION_PRIORITY = config["sectionPriority"]
AI_PROMPT_TEMPLATE = config["aiPromptTemplate"].format(PROJECT_NAME=PROJECT_NAME, PROJECT_URL=PROJECT_URL)
CATEGORIES = config.get("categories", [])
SHARED_CATEGORIES = config.get("sharedCategories", [])

docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) # path to docs directory 
llms_input_path = os.path.join(docs_dir, 'llms-full.txt') # points to the full llms-full.txt
output_dir = os.path.join(docs_dir, 'llms-files')  # path where we store individual category llms files
os.makedirs(output_dir, exist_ok=True) # make the directory if it doesn't exist

def infer_section_label(url, section_priority): # if we reorganize the website this will need to be changed
    """
    Returns which section label from section_priority is present in the URL path, or defaults to 'other' if none match.
    """
    for section in section_priority:
        if f"/{section}/" in url:
            return section
    return "other"

def sort_key_by_section(index_line, section_priority):
    """
    Used to sort doc pages by the order in `section_priority`.
    Parses the 'type: {section_label}' from index_line, then look it up in section_priority.
    """
    match = re.search(r"\[type: (.+?)\]", index_line)
    if not match:
        return (len(section_priority), index_line)  # fallback
    section_label = match.group(1)
    try:
        i = section_priority.index(section_label)
        return (i, index_line)
    except ValueError:
        return (len(section_priority), index_line)

# Extracts and writes a per-category LLMS file 
def extract_category(category, section_priority, shared_data=None): 
    """
    Reads the entire llms-full.txt file, finds all doc blocks that list `category`, writes them into llms-{category}.txt.
    If shared_data is passed, also append the “shared categories” data to the end of the final file (i.e., basics, reference).
    """
    with open(llms_input_path, 'r', encoding='utf-8') as f: # read the full LLMS input file
        llms = f.read() 

    blocks = re.findall(
        r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---", # extract all documentation blocks
        llms, 
        re.DOTALL
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

        tags = [tag.strip().lower() for tag in category_line.group(1).split(',')] # the categories line into tags

        # Check if the given category is listed in the metadata
        if category.lower() in tags:
            section_label = infer_section_label(url, SECTION_PRIORITY) # determine section based on url  !!! this to be adjusted once we reorganize the website 

            # Fix: Convert /docs/.../page -> relative GitHub path
            if "/docs/" in url:
                rel_path = url.split("/docs/")[1].rstrip("/") + ".md"
                raw_url = f"{RAW_BASE_URL}/{rel_path}"
            else:
                raw_url = url  # fallback

            index_lines.append(f"Doc-Page: {raw_url} [type: {section_label}]")
            content_blocks.append(f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{content.strip()}\n--- END CONTENT ---") # store full page

    if not content_blocks: # # if no doc pages matched, skip writing a file.
        print(f"[!] Skipping {category} – no matching pages.")
        return

    # Output file for this category
    output_file = os.path.join(output_dir, f"llms-{category.lower()}.txt") # write to output file
    with open(output_file, 'w', encoding='utf-8') as f:

        # I# 1) Intro context block for LLMs purpose 
        f.write(f"# {PROJECT_NAME} Developer Documentation (LLMS Format)\n\n")
        f.write(f"This file contains documentation for {PROJECT_NAME} ({PROJECT_URL}). {PROJECT_DESCRIPTION}\n")
        f.write("It is intended for use with large language models (LLMs) to support developers working with Wormhole. The content includes selected pages from the official docs, organized by product category and section.\n\n")

        # 2) check if it’s a “shared” category or a normal product category and write the prompt
        if category.lower() in [sc['name'].lower() for sc in SHARED_CATEGORIES]:
            f.write(f"This file includes shared documentation for the category: {category}\n\n")
        else:
            f.write(f"This file includes documentation for the product: {category}\n\n")
            f.write(AI_PROMPT_TEMPLATE)
            f.write("\n")

        combined = list(zip(index_lines, content_blocks))
        combined.sort(key=lambda p: sort_key_by_section(p[0], SECTION_PRIORITY))
        sorted_index_lines, sorted_content_blocks = zip(*combined) if combined else ([], [])

        # 3) List of doc pages (sorted)
        f.write(f"## List of doc pages:\n")
        f.write('\n'.join(sorted_index_lines))
        f.write("\n\n## Full content for each doc page\n\n")
        f.write('\n\n'.join(sorted_content_blocks))

        # 4) Append shared data if we are generating a normal category
        if shared_data and category.lower() not in [sc['name'].lower() for sc in SHARED_CATEGORIES]:
            for shared_cat_name, shared_cat_info in shared_data.items():
                context_index = shared_cat_info["index"]
                context_content = shared_cat_info["content"]
                context_description = shared_cat_info["contextDescription"]

                f.write(f"\n\n## Shared Concepts from '{shared_cat_name}'\n\n")
                f.write(context_description)
                f.write("\n---\n\n")
                f.write("## List of shared concept pages:\n")
                f.write(context_index + "\n\n")
                f.write("## Full content for shared concepts:\n\n")
                f.write(context_content)

    print(f"[✓] Generated {output_file} with {len(content_blocks)} pages")

# Generate LLMS files for all categories including shared core content.
def generate_all_categories():
    """
    1) Generate the “shared categories” and store their extracted content in shared_data.
    2) Generate each normal category, attaching the shared data at the end.
    """
    shared_data = {}

    # 1) Generate each shared category and store it
    for sc in SHARED_CATEGORIES:
        cat_name = sc["name"]
        cat_description = sc["contextDescription"].format(PROJECT_NAME=PROJECT_NAME)

        # Generate the shared category files
        extract_category(cat_name, SECTION_PRIORITY)
        
        path = os.path.join(output_dir, f"llms-{cat_name.lower()}.txt")
        if not os.path.isfile(path):
            print(f"[!] Shared category file not found for {cat_name}: {path}")
            continue

        with open(path, 'r', encoding='utf-8') as f:
            raw = f.read()

        # Extract the index block
        index_match = re.search(
            r"## List of doc pages:\n(.*?)\n+## Full content for each doc page",
            raw,
            re.DOTALL
        )
        index = index_match.group(1).strip() if index_match else ""

        # Extract the content blocks
        blocks = re.findall(
            r"Doc-Content: (.*?)\n--- BEGIN CONTENT ---\n(.*?)\n--- END CONTENT ---",
            raw, re.DOTALL
        )

        content = ""
        for url, block in blocks:
            content += f"Doc-Content: {url}\n--- BEGIN CONTENT ---\n{block.strip()}\n--- END CONTENT ---\n\n"

        # Store in shared_data
        shared_data[cat_name.lower()] = {
            "index": index,
            "content": content.strip(),
            "contextDescription": cat_description
        }

    # 2) Generate each normal category, appending shared_data
    for cat in CATEGORIES:
        extract_category(cat, SECTION_PRIORITY, shared_data)

# Only run this if script is executed directly
if __name__ == "__main__":
    generate_all_categories()


