# Script to kill process on port 3001
# Usage: .\kill-port.ps1 [port]

param(
    [int]$Port = 3001
)

$connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($connection) {
    $pid = $connection.OwningProcess
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Killing process $pid ($($process.ProcessName)) on port $Port..."
        taskkill /PID $pid /F
        Write-Host "✅ Process killed"
    } else {
        Write-Host "Process not found"
    }
} else {
    Write-Host "No process found on port $Port"
}

