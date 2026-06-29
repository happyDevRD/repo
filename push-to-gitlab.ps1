# Subir frontend a GitLab (egarcia/iflow)
# Ejecutar: .\push-to-gitlab.ps1
# Otra rama: .\push-to-gitlab.ps1 -Branch develop

param(
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$git = "C:\Users\egarcia\AppData\Local\Programs\Git\cmd\git.exe"
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path $git)) {
    Write-Host "No se encontró Git. Instálalo desde https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

$env:Path = "C:\Users\egarcia\AppData\Local\Programs\Git\cmd;" + $env:Path

& $git -C $repo remote set-url origin "git@gitlabsrv.shs.local:egarcia/iflow.git"

Write-Host "Remoto:" -ForegroundColor Cyan
& $git -C $repo remote -v
Write-Host ""
Write-Host "Subiendo rama $Branch..." -ForegroundColor Green
& $git -C $repo push -u origin $Branch
