# Comandos para subir Chess Legacy a GitHub

# 1. Inicializar repositorio Git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: Chess Legacy - Sistema de análisis histórico de ajedrez"

# 4. Conectar con tu repositorio remoto de GitHub
# Reemplaza TU_USUARIO y TU_REPO con tus datos
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# 5. Subir al repositorio
git branch -M main
git push -u origin main

# ============================================
# COMANDOS ADICIONALES ÚTILES
# ============================================

# Ver estado de los archivos
git status

# Ver archivos ignorados
git status --ignored

# Verificar conexión remota
git remote -v

# Si necesitas cambiar la URL remota
git remote set-url origin https://github.com/TU_USUARIO/TU_REPO.git
