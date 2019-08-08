#!/bin/bash

set -e

# first argument of this script must be the base dir of the repository
if [ -z "$1" ]
  then
    echo "Usage: buildStackImage.sh <path to stack root directory>"
    exit 1
fi
base_dir="$(cd "$1" && pwd)"
if ([ ! -d "$base_dir/image" ] && [ ! -d "$base_dir/scripts" ]) || [ ! -d "$base_dir/templates" ]
then
    echo "Usage: buildStackImage.sh <path to stack root directory>"
    exit 1
fi


STACK_VERSION=`grep version $base_dir/stack.yaml | sed -e "s/version: //"`

cd $base_dir/image

docker build -t knolleary/node-red:$STACK_VERSION -f Dockerfile-stack .
