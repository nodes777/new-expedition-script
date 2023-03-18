@echo off
set ARG=%1
echo Creating new expedition for %ARG%...
cd C:\Users\taylo\Desktop\Coding\new-expedition-script 
npm run new-exp -- %ARG%
echo Finished creating new expedition
