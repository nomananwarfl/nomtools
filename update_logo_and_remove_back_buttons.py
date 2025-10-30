import os
import re

# Path to the root directory
root_dir = r'd:\Noman\nomtools-main'

# Logo HTML to be inserted
logo_html = '''<a class="logo" href="https://nomtool.space/">
  <img src="/images/logo.png" alt="NomTools Logo" style="height: 40px; width: auto;">
</a>'''

# Pattern to match the back to home link
back_home_pattern = r'<div class="tool-nav"><a href=[^>]*>← Back to Home</a></div>\s*'

# Process all HTML files in the directory
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Remove back to home button if it exists
                content = re.sub(back_home_pattern, '', content)
                
                # Update logo link
                content = re.sub(
                    r'<a class="logo" href=[^>]*>.*?</a>',
                    logo_html,
                    content,
                    flags=re.DOTALL
                )
                
                # Write the updated content back to the file
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f'Updated: {file}')
                
            except Exception as e:
                print(f'Error processing {file}: {str(e)}')

print("Update complete.")
