@echo off
echo Descargando Stockfish...

mkdir stockfish 2>nul

curl -L https://github.com/official-stockfish/Stockfish/releases/download/sf_17/stockfish-windows-x86-64-avx2.zip -o stockfish.zip

tar -xf stockfish.zip -C stockfish --strip-components=1

del stockfish.zip

echo Stockfish instalado correctamente en ./stockfish/
