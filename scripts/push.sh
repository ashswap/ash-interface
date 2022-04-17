#!/bin/sh

source scripts/env.sh

docker login ghcr.io -u $DOCKER_USER -p $DOCKER_PSECET
docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG