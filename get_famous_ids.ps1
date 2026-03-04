$games = @(
  @{jugadorId=1; desc="Tal vs Smyslov 1959";       inicio="1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6 6.Be2 a6 7.O-O Nbd7 8.f4 b5"},
  @{jugadorId=1; desc="Tal vs Botvinnik 1960";      inicio="1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6 6.Nf3 g6"},
  @{jugadorId=1; desc="Tal vs Keres 1957";          inicio="1.d4 Nf6 2.c4 e6 3.Nf3 c5 4.e3 d5 5.a3"},
  @{jugadorId=2; desc="Capa vs Bernstein 1914";     inicio="1.d4 d5 2.Nf3 Nf6 3.c4 e6 4.Nc3 Nbd7 5.Bg5 Be7 6.e3 c6 7.Bd3 dxc4"},
  @{jugadorId=2; desc="Capa vs Lasker 1921";        inicio="1.d4 d5 2.Nf3 Nf6 3.c4 e6 4.Bg5 Nbd7 5.e3 Be7 6.Nc3 O-O 7.Rc1 b6"},
  @{jugadorId=2; desc="Capa vs Marshall 1918";      inicio="1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5"},
  @{jugadorId=3; desc="Kasparov vs Topalov 1999";   inicio="1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5"},
  @{jugadorId=3; desc="Kasparov vs Karpov 1985";    inicio="1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nb5 d6 6.c4 Nf6 7.N1c3 a6 8.Na3 d5"},
  @{jugadorId=3; desc="Kasparov vs Deep Blue 1996"; inicio="1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Nbd7 8.Qf3 Qc7"},
  @{jugadorId=4; desc="Fischer vs Byrne 1956";      inicio="1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4"},
  @{jugadorId=4; desc="Fischer vs Spassky 1972";    inicio="1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Bb4 5.e3 O-O 6.Bd3 c5 7.O-O Nc6 8.a3 Bxc3"},
  @{jugadorId=4; desc="Fischer vs Taimanov 1971";   inicio="1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6 6.Bc4 e6 7.Bb3 Be7 8.Be3 O-O"},
  @{jugadorId=5; desc="Karpov vs Korchnoi 1978 r27";inicio="1.c4 Nf6 2.Nc3 e5 3.Nf3 Nc6 4.g3 Bb4 5.Nd5 Nxd5"},
  @{jugadorId=5; desc="Karpov vs Kasparov 1986";    inicio="1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.b4"},
  @{jugadorId=5; desc="Karpov vs Unzicker 1974";    inicio="1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3"},
  @{jugadorId=6; desc="Alekhine vs Capablanca 1927";inicio="1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4"},
  @{jugadorId=6; desc="Alekhine vs Nimzowitsch 1930";inicio="1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7"},
  @{jugadorId=7; desc="Petrosian vs Spassky 1966";  inicio="1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 a6 6.b3 Bb4"},
  @{jugadorId=7; desc="Petrosian vs Botvinnik 1963";inicio="1.c4 g6 2.d4 Nf6 3.Nc3 Bg7 4.e4 d6 5.Be2 O-O 6.Nf3 e5 7.d5 Nbd7"},
  @{jugadorId=7; desc="Petrosian vs Fischer 1971";  inicio="1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Bd3 Bc5 6.Nb3 Ba7"},
  @{jugadorId=8; desc="Carlsen vs Karjakin 2016";   inicio="1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6 5.e3 a6 6.b3 Bb4 7.Bd2 Nbd7"},
  @{jugadorId=8; desc="Carlsen vs Anand 2013";      inicio="1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 a6 6.b3 Bb4"},
  @{jugadorId=8; desc="Carlsen vs Aronian 2012";    inicio="1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Be7 5.Bg5 h6 6.Bh4 O-O 7.Rc1 b6"}
)
foreach ($g in $games) {
  try {
    $enc = [uri]::EscapeDataString($g.inicio)
    $r = Invoke-RestMethod "http://localhost:5000/api/partidas/buscar-por-pgn?jugadorId=$($g.jugadorId)&pgnStart=$enc"
    Write-Host "id=$($r.id) jugadorId=$($g.jugadorId) | $($g.desc)"
  } catch {
    Write-Host "NOT FOUND jugadorId=$($g.jugadorId) | $($g.desc)"
  }
}
