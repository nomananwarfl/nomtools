import os
import re

# Path to the tools directory
tools_dir = os.path.join('d:\\Noman\\nomtools-main', 'tools')

# Logo HTML to be inserted
logo_html = '''<div class="logo-container">
  <a href="/index.html">
    <img src="/images/logo.png" alt="NomTools Logo" class="site-logo">
  </a>
</div>'''

# Process each HTML file in the tools directory
for filename in os.listdir(tools_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(tools_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Remove the back to home link
            content = re.sub(r'<div class="tool-nav"><a href=\.\./index\.html">← Back to Home</a></div>\s*', '', content)
            
            # Add logo before the header
            content = content.replace('<header class="tool-header">', f'{logo_html}\n    <header class="tool-header">')
            
            # Write the updated content back to the file
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            
            print(f'Updated: {filename}')
            
        except Exception as e:
            print(f'Error processing {filename}: {str(e)}')

print("Tool pages update complete.")

# Now update the other pages
other_pages = [
    'about.html',
    'contact.html',
    'sitemap.html'
]

base_dir = 'd:\\Noman\\nomtools-main'

for page in other_pages:
    filepath = os.path.join(base_dir, page)
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Add logo at the beginning of the header
        if '<header class="site-header"' in content:
            content = content.replace(
                '<header class="site-header"',
                f'<header class="site-header">\n    <div class="logo-container">\n      <a href="/index.html">\n        <img src="/images/logo.png" alt="NomTools Logo" class="site-logo">\n      </a>\n    </div>',
                1
            )
            
            # Write the updated content back to the file
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            
            print(f'Updated: {page}')
        else:
            print(f'Header not found in {page}')
            
    except Exception as e:
        print(f'Error processing {page}: {str(e)}')

print("All updates complete.")
