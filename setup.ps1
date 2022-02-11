$vars = (Get-Content .env) -split '\n'
foreach ($item in $vars) {
    
    if ($item -notlike '*=*') { continue; }

    $name, $value = $item -split '='

    Invoke-Expression "`$env:$name='$value'"
    # &([scriptblock]::create("`$env:$name='$value'"))
}