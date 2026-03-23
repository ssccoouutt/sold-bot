#!/usr/bin/env bash
# Usage: sudo ./scripts/add-sudo-user.sh <username> [--no-password]
# Creates a user if missing and adds them to the sudo/wheel group.
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <username> [--no-password]"
  exit 2
fi

USERNAME="$1"
NO_PASS=${2-}

# Create user if it doesn't exist
if id "$USERNAME" &>/dev/null; then
  echo "User $USERNAME already exists."
else
  echo "Creating user $USERNAME..."
  # create user with home and bash shell; will prompt for password unless --no-password supplied
  if [ "$NO_PASS" = "--no-password" ]; then
    sudo useradd -m -s /bin/bash "$USERNAME"
    echo "$USERNAME:"$(openssl rand -base64 12)" | sudo chpasswd
  else
    sudo adduser "$USERNAME"
  fi
fi

# Add to sudo or wheel depending on distro
if command -v apt-get >/dev/null 2>&1 || [ -f /etc/debian_version ]; then
  echo "Adding $USERNAME to sudo group (Debian/Ubuntu)..."
  sudo usermod -aG sudo "$USERNAME"
elif [ -f /etc/redhat-release ] || command -v yum >/dev/null 2>&1; then
  echo "Adding $USERNAME to wheel group (RHEL/CentOS)..."
  sudo usermod -aG wheel "$USERNAME"
else
  echo "Unknown distribution: add $USERNAME to appropriate sudoers group manually."
fi

echo "Done. Verify with: groups $USERNAME
