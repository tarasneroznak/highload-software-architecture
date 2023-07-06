if [ ! -n "$1" ]
then
	echo "Error: \$time not set or NULL"
else
    for VARIABLE in 10 25 50 100
    do
        echo "Load testing with $VARIABLE concurrent users for $1 seconds"
        siege -j -q -c $VARIABLE --time=$1S -f load-test-data.txt
    done
fi
