# Super-Harness Playwright E2E Testing Guide

## Test Execution
- Run all desktop & mobile smoke specs: 
px playwright test
- Inspect trace reports: 
px playwright show-report
"@ 
    -CommitMessage "docs(playwright): add automated end-to-end testing guidelines, fixture setup, and trace inspection" 
    -PushIndex 16

# Push 17: SuperHarness Benchmarks
Execute-Push -ProjectDir "C:\Users\Dell\.gemini\antigravity\scratch\SuperHarness" 
    -FilePath "docs\BENCHMARKS.md" 
    -Content @"
# Super-Harness Performance Benchmarks

## Cold Start & Render
- First Contentful Paint (FCP): < 280ms
- Interaction to Next Paint (INP): < 45ms
- Total Bundle Size: < 180kB gzipped
