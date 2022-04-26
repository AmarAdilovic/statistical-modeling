#!/bin/bash
chmod +x build.sh 
cd server
npm run production
pip install -r requirements.txt