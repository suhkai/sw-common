  // from https://en.wikipedia.org/wiki/Path_(computing)
    DOSSLASH: '\0x20',
    DOSROOT: '\0x21',
    /*

    unix  seperator /
    /

    dos  (command.com) seperator \
    c:\ 
     \\servername\volume\ 

    ms windows (cmd.exe)
    
    dir \ (works)
    dir / (doent work)
    
    dir "/Program Files" works
    dir "\Program Files" works (but singular "\" doesnt)

    dir "\Program Files/R" works

    dir "c:/Program Files" works

  
    dir \\?\c:\ works

    dir c:   works (but it does current directory)

    dir \\.\c:\  works

    dir c:/ doesnt work

    dir "c:/" does work

    dir / doesnt work
    dir "/" says it cant find anything

    >dir "//./c:/" works
    >dir //./c:/   doesnt work
    dir \\.\c: doesnt work
    dir \\.\c:\  works (but not in powershell!!)

    dir //./c:/ works but not in powershell

    powershell
    dir c:  shows current dir
    dir \\Desktop-j8f8v02\c  works
    dir \\Desktop-j8f8v02\ doesnt
    dir //Desktop-j8f8v02/c  works
    dir //Desktop-j8f8v02 doesnt work
    dir //./

    // show device name for disks
    wmic diskdrive list brief

    Caption                              DeviceID            Model                                Partitions  Size          
    Generic MassStorageClass USB Device  \\.\PHYSICALDRIVE2  Generic MassStorageClass USB Device  0                         
    Micron_1100_MTFDDAV512TBN            \\.\PHYSICALDRIVE0  Micron_1100_MTFDDAV512TBN            3           512105932800  
    Generic MassStorageClass USB Device  \\.\PHYSICALDRIVE1  Generic MassStorageClass USB Device  0   


    \\?\  means turn of "." and ".." interpolation.

    
    or [drive_letter]:\
    or \\[server]\[sharename]\   example \\Server01\user\docs\Letter.txt, 
    or \\?\[drive_spec]:\           example \\?\C:\user\docs\Letter.txt
    or \\?\[server]\[sharename]\
    or \\?\UNC\[server]\[sharename]\  example \\?\UNC\Server01\user\docs\Letter.tx
    or \\.\[physical_device]\

    powerhell \ or /
    [drive letter:]/  example UserDocs:/Letter.txt
    [drive name:]\
    \\[server name]\

      \\?\Volume{c7586f73-3a1f-4dd4-b069-ed096296d352}

      
    dir  "\\?\Volume{c7586f73-3a1f-4dd4-b069-ed096296d352}\Program Files"  (not!! does not work in powershell)

    dir \\.\UNC\localhost\c$\bin this works in powershell, does not work in cmd.Exe

    */
    DOSSERVERROOT: '\0x22',
    POSIXROOT: '\0x23', 
    UNCROOT: '\0x24',
    WINDEVICEROOT: '\0x25'