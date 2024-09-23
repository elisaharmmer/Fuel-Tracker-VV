
-- Script para criar um backup do banco de dados
BACKUP DATABASE FuelTrackerVV
TO DISK = '/var/opt/mssql/backup/FuelTrackerVV.bak'
WITH FORMAT, MEDIANAME = 'SQLServerBackups', NAME = 'Backup Completo';

-- Script para restaurar um backup do banco de dados
RESTORE DATABASE FuelTrackerVV
FROM DISK = '/var/opt/mssql/backup/CombustiveisDB.bak'
WITH REPLACE;
