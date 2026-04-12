#!/usr/bin/env bash
set -euo pipefail

echo "Reloading systemd daemon..."
systemctl daemon-reload

echo "Restarting autohaus service..."
systemctl restart autohaus

echo "Status:"
systemctl status autohaus --no-pager
