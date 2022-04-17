#!/bin/sh

source scripts/env.sh

docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG . --build-arg NETWORK=$NETWORK