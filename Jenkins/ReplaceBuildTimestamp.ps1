Param(
    [Parameter(Mandatory=$true)]
    [string]$Workspace,
    [Parameter(Mandatory=$true)]
    [string]$BuildTimestamp,
    [Parameter(Mandatory=$true)]
    [string]$BuildNumber
)
(Get-Content $Workspace/TpMaterial/src/app/timepuncher-client-config.ts) -replace "<buildtimestamp>", "$BuildTimestamp build $BuildNumber" | Set-Content $Workspace/TpMaterial/src/app/timepuncher-client-config.ts