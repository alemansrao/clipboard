<#
AI‑Optimized Folder + File Combiner
-----------------------------------
- Ignores ALL dot-folders (.next, .git, .vscode, .cache, etc.)
- Ignores node_modules
- If .gitignore exists, applies its patterns
- Does NOT list or recurse into ignored folders
- Only logs "EXCLUDED DIR <folder>" at top-level
- Very clean AI-friendly folder+file map
#>

# region Helpers
function Get-RelativePath {
    param(
        [Parameter(Mandatory)][string]$RootPath,
        [Parameter(Mandatory)][string]$FullPath
    )
    $root = $RootPath.TrimEnd('\') + '\'
    $rootUri = [System.Uri]::new($root)
    $fileUri = [System.Uri]::new($FullPath)
    $rel = $rootUri.MakeRelativeUri($fileUri).ToString()
    return ($rel -replace '/', '\')
}

function Test-IsBinary {
    param(
        [Parameter(Mandatory)][string]$Path,
        [int]$BytesToCheck = 8192
    )
    try {
        $fs = [System.IO.File]::Open($Path,'Open','Read','ReadWrite')
        try {
            $buf = New-Object byte[] $BytesToCheck
            $read = $fs.Read($buf,0,$buf.Length)
            for ($i=0; $i -lt $read; $i++) {
                if ($buf[$i] -eq 0) { return $true }
            }
            return $false
        }
        finally { $fs.Dispose() }
    }
    catch { return $false }
}

function Load-GitIgnorePatterns {
    param([string]$rootPath)
    $gitignore = Join-Path $rootPath ".gitignore"
    if (-not (Test-Path $gitignore)) { return @() }

    $patterns = @()
    foreach ($line in Get-Content $gitignore) {
        $trim = $line.Trim()
        if ($trim -and -not $trim.StartsWith("#")) { $patterns += $trim }
    }
    return $patterns
}

function Matches-GitIgnore {
    param(
        [string]$rel,
        [string[]]$patterns
    )

    foreach ($p in $patterns) {
        $escaped = [Regex]::Escape($p) -replace '\\\*','.*'
        if ($rel -match $escaped) { return $true }
    }
    return $false
}
# endregion Helpers


try {
    if (Test-Path "CombinedContent.txt") {
        Remove-Item "CombinedContent.txt"
        Write-Host "Deleted old CombinedContent.txt" -ForegroundColor Yellow
    }

    $ErrorActionPreference = "Stop"
    $rootPath = (Get-Location).Path
    $outputFile = Join-Path $rootPath "CombinedContent.txt"
    $MaxBytes = 10MB

    # ======== EXCLUSION LOGIC ========
    $HardExcludes = @("node_modules")    # always exclude
    $GitIgnorePatterns = Load-GitIgnorePatterns $rootPath

    function Should-Exclude-Folder([string]$folderName) {

        if ($folderName.StartsWith(".")) { return $true }       # ignore dot folders
        if ($HardExcludes -contains $folderName) { return $true }

        return $false
    }

    # ======== INPUT ========
    $inputFolders = Read-Host "Enter folders to include (semicolon-separated)"
    $folders = $inputFolders -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ }

    $inputFiles = Read-Host "Enter additional files (semicolon-separated, optional)"
    $filesManual = $inputFiles -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ }

    # ======== VALIDATE FOLDERS (EXCLUDE DOT + NODE_MODULES) ========
    $validDirs = foreach ($f in $folders) {
        if (Should-Exclude-Folder $f) {
            Write-Warning "Folder excluded automatically: $f"
            continue
        }
        $candidate = Join-Path $rootPath $f
        if (Test-Path $candidate -PathType Container) { Get-Item $candidate }
        else { Write-Warning "Folder not found: $f" }
    }

    $validFilesManual = foreach ($f in $filesManual) {
        $candidate = Join-Path $rootPath $f
        if (Test-Path $candidate -PathType Leaf) { Get-Item $candidate }
        else { Write-Warning "File not found: $f" }
    }

    # ======== RECURSE INCLUDED FOLDERS (WITHOUT IGNORING RULE BREAKS) ========
    $allFiles = @()

    foreach ($dir in $validDirs) {
        $allFiles += Get-ChildItem $dir.FullName -File -Recurse -ErrorAction SilentlyContinue |
        Where-Object {
            $rel = Get-RelativePath $rootPath $_.FullName
            $top = $rel.Split("\")[0]

            # skip dot folders & node_modules completely
            if (Should-Exclude-Folder $top) { return $false }

            # skip gitignore patterns
            if (Matches-GitIgnore $rel $GitIgnorePatterns) { return $false }

            return $true
        }
    }

    # also add manual files
    $allFiles += $validFilesManual

    # Sort results
    $sortedFiles = $allFiles | Sort-Object {
        (Get-RelativePath $rootPath $_.FullName).ToLower()
    }

    # ======== OUTPUT STREAM WRITER ========
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $writer = New-Object System.IO.StreamWriter($outputFile,$false,$utf8NoBom)

    try {

        # ======= HEADER =======
        $writer.WriteLine("######## CombinedContent.txt ########")
        $writer.WriteLine("Root: ./")
        $writer.WriteLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
        $writer.WriteLine("Included folders: " + ($folders -join '; '))
        $writer.WriteLine("Included files: " + ($filesManual -join '; '))
        $writer.WriteLine("Ignored: dot-folders (.*), node_modules, gitignore patterns")
        $writer.WriteLine("####################################")
        $writer.WriteLine()


        # ======= CLEAN FOLDER STRUCTURE MAP =======
        $writer.WriteLine("######## FOLDER STRUCTURE ########")

        foreach ($item in Get-ChildItem -Force) {

            if ($item.PSIsContainer) {

                if (Should-Exclude-Folder $item.Name) {
                    $writer.WriteLine("EXCLUDED DIR $($item.Name)")
                    continue
                }

                if (Matches-GitIgnore $item.Name $GitIgnorePatterns) {
                    $writer.WriteLine("EXCLUDED DIR $($item.Name)")
                    continue
                }

                $writer.WriteLine("DIR $($item.Name)")
            }
            else {
                $writer.WriteLine("FILE $($item.Name)")
            }
        }

        $writer.WriteLine("##################################")
        $writer.WriteLine()


        # ======== FILE CONTENTS ========
        foreach ($file in $sortedFiles) {

            $rel = Get-RelativePath $rootPath $file.FullName

            if ($file.Length -gt $MaxBytes) {
                $writer.WriteLine("===== FILE START: $rel =====")
                $writer.WriteLine("SKIPPED: File > 10MB")
                $writer.WriteLine("===== FILE END =====")
                $writer.WriteLine()
                continue
            }

            if (Test-IsBinary $file.FullName) {
                continue
            }

            $writer.WriteLine("===== FILE START: $rel =====")
            $writer.WriteLine("===== FILE CONTENT BELOW =====")
            $writer.WriteLine((Microsoft.PowerShell.Management\Get-Content -LiteralPath $file.FullName -Raw))
            $writer.WriteLine("===== FILE END =====")
            $writer.WriteLine()

        }

    }
    finally { $writer.Dispose() }

    Write-Host "Done. Output written to CombinedContent.txt" -ForegroundColor Green
}
catch {
    Write-Error $_
}
