#!/usr/bin/env bash

echo "Synchronous:"
awk -f test.awk test1.data

echo "Asynchronous:"
node "${CHT_BASEDIR:=/var/opt/cht}/lib/govHUB/carget.js" <test1.data
