#!/usr/bin/env bash

current_script_directory_relative="$(dirname "$0")"
current_script_directory="$(greadlink -f "$current_script_directory_relative")"
build_dir_path="$(greadlink -f "${current_script_directory}/../build")"
repo_root_path="$(greadlink -f "${current_script_directory}/..")"

npm run build
cp -r node_modules "$build_dir_path"
(cd "$build_dir_path" && zip -r -X "$repo_root_path/build.zip" .)
