-- Crear tabla Intentos si no existe
CREATE TABLE IF NOT EXISTS "Intentos" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "PosicionId" INTEGER NOT NULL,
    "MovimientoJugado" TEXT NOT NULL,
    "ScorePrecision" REAL NOT NULL,
    "ScoreEstilo" REAL NOT NULL,
    "ScoreFinal" REAL NOT NULL,
    "MejorMovimiento" TEXT NOT NULL,
    "EvaluacionCentipawns" INTEGER NOT NULL,
    "FechaIntento" TEXT NOT NULL,
    FOREIGN KEY("PosicionId") REFERENCES "Posiciones"("Id") ON DELETE CASCADE
);
