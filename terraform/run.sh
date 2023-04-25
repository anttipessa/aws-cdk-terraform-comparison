#!/usr/bin/env bash
 
TF_ENV=$1
 
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
 
# Always run from the location of this script
cd $DIR
 
if [ $# -gt 0 ]; then
        terraform -chdir=./environments/$TF_ENV $2 $3
fi
 
# Head back to original location to avoid surprises
cd -
