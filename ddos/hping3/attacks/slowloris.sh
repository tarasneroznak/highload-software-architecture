slowhttptest -c 1000 -H -g -o slowhttp -i 10 -r 200 -t GET -u ${TARGET_URL} -x 24 -p 3

slowhttptest -c 1000 -H -g -o slowhttp -i 10 -r 200 -t GET -u http://protected -x 24 -p 3