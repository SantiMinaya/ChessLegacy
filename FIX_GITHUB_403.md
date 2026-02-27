# Solución Error 403 - GitHub Authentication

## Opción 1: Usar Personal Access Token (Recomendado)

### Paso 1: Crear Token en GitHub
1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Nombre: "ChessLegacy"
4. Selecciona: `repo` (todos los permisos de repositorio)
5. Click "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)

### Paso 2: Actualizar URL del repositorio
```bash
# Formato: https://TOKEN@github.com/USUARIO/REPO.git
git remote set-url origin https://TU_TOKEN@github.com/SantiMinaya/ChessLegacy.git
```

### Paso 3: Push
```bash
git push -u origin main
```

## Opción 2: Usar SSH (Alternativa)

### Paso 1: Generar clave SSH
```bash
ssh-keygen -t ed25519 -C "tu_email@example.com"
# Presiona Enter 3 veces (ubicación por defecto, sin contraseña)
```

### Paso 2: Copiar clave pública
```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```

### Paso 3: Agregar a GitHub
1. Ve a: https://github.com/settings/keys
2. Click "New SSH key"
3. Pega la clave copiada
4. Click "Add SSH key"

### Paso 4: Cambiar URL a SSH
```bash
git remote set-url origin git@github.com:SantiMinaya/ChessLegacy.git
```

### Paso 5: Push
```bash
git push -u origin main
```

## Verificar configuración actual
```bash
# Ver URL remota actual
git remote -v

# Ver configuración de usuario
git config user.name
git config user.email
```

## Si necesitas cambiar usuario de Git
```bash
git config user.name "SantiMinaya"
git config user.email "tu_email@example.com"
```
