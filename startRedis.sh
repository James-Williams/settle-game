#!/bin/bash -e

docker-compose up -d

export REDIS_URL="redis://localhost/"
