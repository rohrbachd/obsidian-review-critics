[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('patch', 'minor', 'major')]
  [string]$Type
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "[release-auto] Starting $Type release from $repoRoot"
node (Join-Path $PSScriptRoot 'release.mjs') $Type
