import os

def add_ga_to_file(file_path):
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if GA tag already exists
    if 'www.googletagmanager.com/gtag/js' in content:
        print(f"Skipping {file_path} - Google Analytics tag already exists")
        return False
    
    # Find the head tag
    head_pos = content.find('<head>')
    if head_pos == -1:
        print(f"Warning: No <head> tag found in {file_path}")
        return False
    
    # Insert the GA code right after the head tag
    insert_pos = head_pos + 6  # length of '<head>'
    new_content = (
        content[:insert_pos] + 
        '\n    <!-- Google tag (gtag.js) -->\n    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7WRE7G63RN"></script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag(\'js\', new Date());\n      gtag(\'config\', \'G-7WRE7G63RN\');\n    </script>' +
        content[insert_pos:]
    )
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)
    
    print(f"Updated {file_path}")
    return True

def main():
    # Directory containing HTML files
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all HTML files
    html_files = []
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html') and not file.startswith('google'):
                html_files.append(os.path.join(root, file))
    
    # Process each HTML file
    updated_count = 0
    for file_path in html_files:
        if add_ga_to_file(file_path):
            updated_count += 1
    
    print(f"\nUpdate complete! {updated_count} files were updated.")

if __name__ == "__main__":
    main()
