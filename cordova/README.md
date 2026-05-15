# Cordova → APK

Wrapper Cordova del proyecto, empaqueta el build de Vite (`cordova/www/`) como una app Android

## 1. Requisitos previos (una sola vez)

Verifica versiones:

```bash
node -v        # >= 18
java -version  # JDK 17 (Cordova Android 13 lo requiere)
```

Si no los tienes:

- **JDK 17** (en macOS, con Homebrew):
  ```bash
  brew install --cask temurin@17
  echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
  source ~/.zshrc
  ```
- **Android Studio**: descárgalo de https://developer.android.com/studio, al abrirlo, en *SDK Manager* instala:
  - Android SDK Platform **34**
  - Android SDK Build-Tools 34.x
  - Android SDK Command-line Tools
  - Android SDK Platform-Tools
- Variables de entorno: hay que decirle a la terminal dónde está el SDK que instaló Android Studio. Esto se hace **una sola vez**, editando `~/.zshrc` (el archivo de configuración de zsh que se carga en cada terminal nueva)

  1. Verifica la ruta del SDK y la versión de build-tools instalada:
     ```bash
     ls ~/Library/Android/sdk                
     ls ~/Library/Android/sdk/build-tools
     ```
  2. Abre el archivo (si no existe, se crea):
     ```bash
     open -e ~/.zshrc
     ```
  3. Pega al final (reemplaza `34.0.0` por la versión que viste arriba en la terminal con el comando anterior):
     ```bash
     export ANDROID_HOME="$HOME/Library/Android/sdk"
     export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/build-tools/34.0.0"
     ```
  4. Guarda, cierra y recarga la terminal:
     ```bash
     source ~/.zshrc
     ```
  5. Verifica que quedó bien:
     ```bash
     echo $ANDROID_HOME
     adb --version
     sdkmanager --version
     ```

  Para qué sirve cada cosa: `ANDROID_HOME` lo lee Gradle/Cordova para ubicar el SDK, `platform-tools` aporta `adb`, `cmdline-tools/latest/bin` aporta `sdkmanager`, y `build-tools/<versión>` aporta `apksigner`
- **Gradle**: lo descarga Cordova automáticamente la primera vez. Si quieres tenerlo global: `brew install gradle`
- **Cordova CLI**:
  ```bash
  npm install -g cordova
  ```

Acepta las licencias del SDK:

```bash
yes | sdkmanager --licenses
```

## 2. Generar el bundle web

Desde la raíz del proyecto (`proyecto-final/`):

```bash
pnpm build:cordova
```

Esto compila TypeScript, corre Vite con `VITE_CORDOVA=1` (rutas relativas + HashRouter) y deja la salida en `cordova/www/`

## 3. Preparar la plataforma Android (una sola vez)

Desde `cordova/`:

```bash
cd cordova
cordova platform add android
```

Esto crea `cordova/platforms/android/` con el proyecto Gradle.

## 4. Build de debug (rápido, sin firmar)

```bash
cordova build android
```

APK resultante (sin firmar, sólo sirve para probar):
`cordova/platforms/android/app/build/outputs/apk/debug/app-debug.apk`

Para probarlo conecta un dispositivo con depuración USB activada y:

```bash
adb devices                                      # confirma que aparece
cordova run android --device                     # compila e instala
# o instalar el APK manualmente:
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 5. Build de release + firma

### 5a. Crear el keystore (una sola vez, guárdalo bien porque no se puede recuperar)

```bash
keytool -genkey -v \
  -keystore proyecto-final.keystore \
  -alias proyecto-final \
  -keyalg RSA -keysize 2048 -validity 10000
```

Te pedirá una contraseña y hay que anotala

### 5b. Configurar Cordova para firmar el release

Crea `cordova/release-signing.properties`:

```properties
storeFile=../proyecto-final.keystore
storeType=jks
keyAlias=proyecto-final
keyPassword=TU_PASSWORD
storePassword=TU_PASSWORD
```

> Cordova lo detecta automáticamente desde `platforms/android/release-signing.properties`. Copia el archivo allí también:
> ```bash
> cp release-signing.properties platforms/android/release-signing.properties
> ```

### 5c. Construir el APK firmado

```bash
cordova build android --release
```

Salida:
`cordova/platforms/android/app/build/outputs/apk/release/app-release.apk`

### 5d. (Opcional) Verificar la firma

```bash
$ANDROID_HOME/build-tools/34.0.0/apksigner verify --print-certs \
  platforms/android/app/build/outputs/apk/release/app-release.apk
```

## 6. Instalar y probar en un celular

```bash
adb install -r platforms/android/app/build/outputs/apk/release/app-release.apk
```

Abre la app desde el launcher. Verifica:

- Login con email/contraseña.
- Crear cuenta nueva.
- Navegar a `/registro`, completar el formulario, ver que se guarde en Firestore.
- Subir avatar en `/perfil` y comprobar la imagen en Firebase Storage.