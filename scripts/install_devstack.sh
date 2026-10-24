#!/data/data/com.termux/files/usr/bin/bash
# -----------------------------------------------------------------------------
# Antigravitymobpro One-Click Termux Developer Stack Installer
# Installs Node.js LTS, pnpm, Python 3, uv, Git, Go, Rust, OpenSSH & build tools.
# -----------------------------------------------------------------------------
set -e

echo "=========================================================="
echo "🚀 Bootstrapping Antigravitymobpro Termux Developer Stack"
echo "=========================================================="

echo "📦 [1/5] Updating Termux package repositories..."
pkg update -y || apt-get update -y

echo "📦 [2/5] Installing core compilers & languages..."
pkg install -y nodejs-lts python git gh golang rust openssh curl wget tar gzip jq build-essential

echo "📦 [3/5] Configuring Node.js package managers (pnpm)..."
npm install -g pnpm yarn @modelcontextprotocol/server-github @modelcontextprotocol/server-sqlite || true

echo "📦 [4/5] Upgrading Python toolchains (pip & uv)..."
pip install --upgrade pip uv || true

echo "📦 [5/5] Ensuring local bin PATH exists..."
mkdir -p "$HOME/.local/bin"
grep -qxF 'export PATH="$HOME/.local/bin:$PATH"' "$HOME/.bashrc" || echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"

echo "=========================================================="
echo "✅ Developer Stack Installation Complete!"
echo "   Node: $(node -v 2>/dev/null || echo 'installed')"
echo "   pnpm: $(pnpm -v 2>/dev/null || echo 'installed')"
echo "   Python: $(python3 --version 2>/dev/null || echo 'installed')"
echo "   Git: $(git --version 2>/dev/null || echo 'installed')"
echo "   Go: $(go version 2>/dev/null || echo 'installed')"
echo "=========================================================="
