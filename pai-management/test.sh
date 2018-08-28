#!/bin/bash

set -e

for((i=0;i<100;i++)); do
  ./paictl.py cluster k8s-bootup -p ./pai-config/
  echo "*********************************** k8s bootup succesfully! ********************************"
  sleep 10
  ./paictl.py cluster k8s-clean -p ./pai-config/ -f
  echo "finished once"
  echo $i
done

