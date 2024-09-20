
-- Script para criar um backup do banco de dados
BACKUP DATABASE CombustiveisDB
TO DISK = '/var/opt/mssql/backup/CombustiveisDB.bak'
WITH FORMAT, MEDIANAME = 'SQLServerBackups', NAME = 'Backup Completo';

-- Script para restaurar um backup do banco de dados
RESTORE DATABASE CombustiveisDB
FROM DISK = '/var/opt/mssql/backup/CombustiveisDB.bak'
WITH REPLACE;
