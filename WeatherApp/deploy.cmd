@echo off

call tsc
call git status
call git add .
call git commit -m "%1"
call git pull
call git push -u origin --all

@echo on