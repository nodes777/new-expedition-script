@echo off
set ARG=%1
echo Sorting photos based on %ARG%...
cd C:\Users\taylo\Desktop\Coding\new-expedition-script 
npm run sort-photos -- %ARG%
echo Finished sorting photos
