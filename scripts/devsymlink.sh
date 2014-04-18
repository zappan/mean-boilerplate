#!/bin/sh

mkdir -p server/public

cd server/public
ln -s ../../client/vendor
ln -s ../../client/src

exit 0
