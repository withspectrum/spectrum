from premailer import transform
import glob, os, os.path

output_path = '../built-email-templates'
input_path = '../email-templates'

# remove all previously-built email templates
old_files = glob.glob(os.path.join(output_path, "*.html"))
for old_file in old_files:
  print(f'Removing previously built file {old_file}')
  os.remove(old_file)

# get the path names of all email templates in the 'email-templates' dir
raw_template_paths = glob.glob(os.path.join(input_path, "*.html"))
for raw_template in raw_template_paths:
  # constuct a new filename so that that the transformed file gets written to the output dir
  file_name = raw_template.replace(input_path, output_path)
  file_obj = open(raw_template)
  html = file_obj.read()

  # premailer escapes curly braces, which we don't want since we use handlebars
  # so after we transform our html, we then replace escaped braces with the actual
  # curly brace character
  triplemapping = (('%7B%7B%7B', '{{{ '), ('%7D%7D%7D', ' }}}'))
  doublemapping = (('%7B%7B', '{{ '), ('%7D%7D', ' }}'))
  
  transformed = transform(html)
  
  for k, v in triplemapping:
    transformed = transformed.replace(k, v)

  for k, v in doublemapping:
    transformed = transformed.replace(k, v)

  # open a writeable file in the output directory
  new_file = open(file_name, 'w')
  new_file.write(transformed)

  # clean up
  new_file.close()
  file_obj.close()


