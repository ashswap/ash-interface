#!/bin/sh

if [[ ! $(which git) ]]; then
    if [[ $(which yum) ]]; then
        yum -y install git
    elif [[ $(which apt) ]]; then
        apt update && apt install -y git
    elif [[ $(which apk) ]]; then
        apk update && apk add --no-cache git
    else
        printf '%s\n' "Git is required" >&2
        exit 1
    fi
fi

DOCKER_IMAGE_TAG="${TAG_NAME:=latest}"

NETWORK="devnet"
if [[ "$DOCKER_IMAGE_TAG" == *"testnet"* ]]; then
    NETWORK="testnet"
fi

echo $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG