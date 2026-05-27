#!/usr/bin/zsh

#fallback manager
set -e
trap 'echo "Error Occured. Restoring projects.html"; mv projects.html.bak projects.html' ERR
cp ./projects.html projects.html.bak
echo "Backup Created"

#inputs
echo -n "Enter Project Name: "
read ProjectNameUnsafe
ProjectNameUSUnsafe=$(echo "$ProjectNameUnsafe" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/_\+/_/g' | sed 's/^_//;s/_$//')

echo -n "Enter Project Summary: "
read ProjectSummaryUnsafe

#avoid errors with "\", "|", "&", etc
ProjectName="$ProjectNameUnsafe"
ProjectNameUS="$ProjectNameUSUnsafe"

SafeName=$(printf '%s\n' "$ProjectNameUnsafe" | sed 's/[&/\\]/\\&/g')
SafeNameUS=$(printf '%s\n' "$ProjectNameUSUnsafe" | sed 's/[&/\\]/\\&/g')
SafeSummary=$(printf '%s\n' "$ProjectSummaryUnsafe" | sed 's/[&/\\]/\\&/g')

#check if project already exists
if [[ -e "projects/$ProjectNameUS" ]]; then
  echo -e "Project already exists\nExiting"
  exit 1
else
  mkdir "projects/$ProjectNameUS"
  cp ./.templates/project-index.html projects/$ProjectNameUS/index.html
  echo "Created Project Files"
fi

#numbering
i=$(find "projects/$ProjectNameUS" -maxdepth 1 -type f -regex '.*/[0-9]+\..*' 2>/dev/null | wc -l || echo 0)

read "a?Add images? (y/n): "
while [[ -z "$a" || $a == [yY] ]]; do
  ranger --choosefile=/tmp/ranger ~/Pictures/screenshots
  img_file=""
  [[ -f /tmp/ranger ]] && img_file=$(cat /tmp/ranger)
  [[ -z "$img_file" ]] && continue

  ext="${img_file##*.}"
  ((++i))
  new_name="$i.$ext"

  cp "$img_file" "projects/$ProjectNameUS/$new_name"
  echo "Added image $img_file to $ProjectName"
  read "a?Add more images? (y/n): "
done

#adding project to projects.html
last_project=$(grep -n project-header projects.html | tail -n 1 | awk -F ":" '{print $1}')
current_project=$(( last_project + 13 ))

add2main=$(cat ./.templates/project-add2main.html)

awk -v line="$current_project" -v content="$add2main" '
NR == line { print; print content; next }
1
' projects.html > tmp && mv tmp projects.html

echo "Referenced project to projects.html"

#replace template temporary variable names
sed -i "s|--PROJECTNAMEHERE--|$SafeNameUS|g" ./projects.html
sed -i "s|--PROJECTNAMEHERESPACES--|$SafeName|g" ./projects.html
sed -i "s|--PROJECTQUICKSUMMARYHERE--|$SafeSummary|g" ./projects.html
sed -i "s|--PROJECTNAMEHERE--|$SafeNameUS|g" ./projects/$ProjectNameUS/index.html
sed -i "s|--PROJECTNAMEHERESPACES--|$SafeName|g" ./projects/$ProjectNameUS/index.html
sed -i "s|--PROJECTQUICKSUMMARYHERE--|$SafeSummary|g" ./projects/$ProjectNameUS/index.html

echo "Added project files successfully!!"
