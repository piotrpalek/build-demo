#!/bin/bash

CMD=$1
SUBCMD=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case "$CMD" in
"build")
    case "$SUBCMD" in
      "docs")
        echo $0
        evcl-docs
      ;;
      "demo")
        echo $0
        evcl-demo
      ;;
    esac
    ;;
*)
  echo "evcl build docs || evcl build demo"
    ;;
esac
