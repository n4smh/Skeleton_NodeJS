#/bin/bash 
echo "-------------------------------------------------"
echo "Entered DemoSchipt.sh"
echo "-------------------------------------------------"

if [ $# -eq 0 ]
then
    echo "No argument passed." 
    echo "Writing to standard error." 1>&2
else
    BASEDIR=$(dirname $0)
    echo "Base directory: ${BASEDIR}"
    echo "Total number of arguments passed: $#"
    
    for i in $*; do 
        echo $i 
    done    
    
fi

echo "-------------------------------------------------"
echo "Leaving DemoSchipt.sh"
echo "-------------------------------------------------"