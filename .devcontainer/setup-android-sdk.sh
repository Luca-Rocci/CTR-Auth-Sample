#!/bin/bash
set -e

SDK_DIR="/home/vscode/android-sdk"
mkdir -p "$SDK_DIR/cmdline-tools"

# Download Command Line Tools di Android SDK
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip
unzip -q /tmp/cmdline-tools.zip -d /tmp
mv /tmp/cmdline-tools "$SDK_DIR/cmdline-tools/latest"
rm /tmp/cmdline-tools.zip

# Impostazione del PATH temporaneo per lo script
export PATH="$PATH:$SDK_DIR/cmdline-tools/latest/bin"

# Accetta le licenze SDK e installa i pacchetti necessari
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Installazione globale di EAS CLI
npm install -g eas-cli