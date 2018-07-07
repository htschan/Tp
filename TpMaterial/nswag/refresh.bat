@echo off
REM Run nswag to extract Web API from running backend
pushd %~dp0
"..\node_modules\.bin\nswag" run /runtime:NetCore20
popd
