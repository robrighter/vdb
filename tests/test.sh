PORT=27017

RED="\033[1;31m"
GREEN="\033[1;32m"

# Load up the scripts
if mongo localhost:$PORT/test --quiet ../dbscripts/main.js; then
	echo $GREEN"Passed: Loading dbscripts"
else
	echo $RED"Failed: Loading dbscripts"
fi
tput sgr0 # Reset colors to "normal."

#run through the unit tests
if mongo localhost:$PORT/test --quiet ./primarykeys.js; then
	echo $GREEN"Passed: Primary Keys Tests"
else
	echo $RED"Failed: Primary Keys Tests"
fi
tput sgr0 # Reset colors to "normal."

if mongo localhost:$PORT/test --quiet ./insert.js; then
	echo $GREEN"Passed: Insert Tests"
else
	echo $RED"Failed: Insert Tests"
fi
tput sgr0 # Reset colors to "normal."

if mongo localhost:$PORT/test --quiet ./merge.js; then
	echo $GREEN"Passed: Merge Tests"
else
	echo $RED"Failed: Merge Tests"
fi
tput sgr0 # Reset colors to "normal."