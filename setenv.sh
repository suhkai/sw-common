#!/bin/bash

path="./.env"

while IFS= read -r line
do
    export "$line"
done < "$path"