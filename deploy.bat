@echo off
echo Creating deployment zip file...
del deploy.zip 2>nul
"C:\Program Files\7-Zip\7z.exe" a deploy.zip . -r -xr!node_modules -xr!.next\cache -xr!.git -xr!.env* -x!*.zip
echo Done! Deployment zip file created as deploy.zip