#!/usr/bin/env bash

awk -f test3.awk test3[1].data | "${CHT_BASEDIR}/bin/GH" carget -v
