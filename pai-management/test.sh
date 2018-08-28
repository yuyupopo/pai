#!/bin/bash

set -e

i=0

while ((i<100)); do
  ./paictl.py cluster k8s-bootup -p ~/pai-config/
  echo "*********************************** k8s bootup succesfully! ********************************"
  sleep 10
  ./paictl.py cluster k8s-clean -p ~/pai-config/ -f
  echo "finished once"
  let i++
done

