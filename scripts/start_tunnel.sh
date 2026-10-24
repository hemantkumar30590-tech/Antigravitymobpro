#!/data/data/com.termux/files/usr/bin/bash
# -----------------------------------------------------------------------------
# Antigravitymobpro Cloudflare Port Tunneling Utility
# Exposes any local port (e.g. 3000, 8080) to a public https:// URL with zero configuration.
# -----------------------------------------------------------------------------
set -e

PORT="${1:-3000}"

echo "=========================================================="
echo "🌐 Antigravitymobpro Cloudflare Public Tunnel"
echo "   Target Local Service: http://127.0.0.1:${PORT}"
echo "=========================================================="

TMP_BIN="$HOME/.local/bin"
mkdir -p "$TMP_BIN"
export PATH="$TMP_BIN:$PATH"

if ! command -v cloudflared &>/dev/null; then
    echo "⬇️ Downloading official Cloudflare Tunnel ARM64 binary..."
    curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o "$TMP_BIN/cloudflared"
    chmod +x "$TMP_BIN/cloudflared"
    echo "✅ cloudflared binary installed to $TMP_BIN/cloudflared"
fi

echo "🚀 Opening secure public tunnel... (Look for the trycloudflare.com URL below)"
echo "----------------------------------------------------------"
cloudflared tunnel --url "http://127.0.0.1:${PORT}"
