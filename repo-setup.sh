#!/bin/bash

# Run this after cloning to set up remotes
# and git hooks.

# To run, type this command:
# ./repo-setup.sh

# Resets directory to git base, incase
# this file is run while the user
# is not 'cd'-ed into the directory.
parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
cd "$parent_path"


# Get current remotes
REMOTES=$(git remote -v)

echo 'Adding dev remote (git push dev)'
if [[ $REMOTES =~ .*/dev/.* ]]
then
  git remote rm dev
fi
git remote add dev        ssh://git@vps1.med.ucf.edu:32/var/www/repositories/dev/wp-panopto-embed.git

#echo 'Adding staging remote (git push staging)'
#if [[ $REMOTES =~ .*/staging/.* ]]
#then
#  git remote rm staging
#fi
#git remote add staging    ssh://git@vps1.med.ucf.edu:32/var/www/med.ucf.edu/staging/wp-content/themes/wp-panopto-embed

echo 'Adding production remote (git push production)'
if [[ $REMOTES =~ .*/production/.* ]]
then
  git remote rm production
fi
git remote add production ssh://git@vps1.med.ucf.edu:32/var/www/repositories/production/wp-panopto-embed.git

echo 'Linking repo hooks'
# if .git/hooks is a directory (and also not a symlink), move it
if [ -d .git/hooks ] && ! [ -h .git/hooks ]
then
  mv .git/hooks/ .git/hooks-samples/
fi
ln -snf ../hooks .git/hooks
git config core.hooksPath ./hooks

echo 'Ignore .devpushed'
if ! grep -q .devpushed ".gitignore"
then
  echo .devpushed >> .gitignore
fi
