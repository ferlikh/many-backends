#!/bin/bash

readarray -t vars < ./.env

for item in ${vars[@]}; do
    if [[ $item != *"="* ]]; then
        continue;
    fi
    IFS='=' read -r -a parts <<< "$item"
    name=${parts[0]}
    value=${parts[1]}
    export $name=$value
done