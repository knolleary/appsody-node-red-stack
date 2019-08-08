#!/bin/bash

set -e

# first argument of this script must be the base dir of the repository
if [ -z "$1" ]
  then
    echo "Usage: packageTemplate.sh <path to stack root directory>"
    exit 1
fi
base_dir="$(cd "$1" && pwd)"
if ([ ! -d "$base_dir/image" ] && [ ! -d "$base_dir/scripts" ]) || [ ! -d "$base_dir/templates" ]
then
    echo "Usage: packageTemplate.sh <path to stack root directory>"
    exit 1
fi

package_dir=$base_dir/repo
mkdir -p $package_dir
base_dir_len=${#base_dir}+1

for template_dir in $base_dir/templates/*/
do
    echo Packaging $template_dir
    cd $template_dir
    filename=${template_dir:$base_dir_len}
    filename=${filename////.}tar.gz
    tar -cvzf $package_dir/node-red.$filename .
done
