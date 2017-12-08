Param(
    [Parameter(Mandatory=$true)]
    [string]$Workspace,
    [Parameter(Mandatory=$true)]
    [string]$BuildTimestamp,
    [Parameter(Mandatory=$true)]
    [string]$BuildNumber
)
(Get-Content $Workspace/CosmiIonic/src/cosmi-client-config.ts) -replace "<buildtimestamp>", "$BuildTimestamp build $BuildNumber" | Set-Content $Workspace/CosmiIonic/src/cosmi-client-config.ts