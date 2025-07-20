#!/bin/bash

echo "🚀 Quick Hugo Deployment"

# Build site
hugo --minify

# Commit and push source
git add .
git commit -m "Update site - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

# Commit and push public submodule
cd public
git add .
git commit -m "Update site - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
cd ..

echo "✅ Deployment complete!"
