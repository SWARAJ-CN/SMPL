const CREDENTIAL_KEY = "smpl5s-admin-credential-v1"
const SESSION_KEY = "smpl5s-admin-session-v1"

type Credential = {
  salt: string
  hash: string
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  )
}

async function derive(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt.match(/../g) || [], (pair) =>
        parseInt(pair, 16),
      ),
      iterations: 150000,
      hash: "SHA-256",
    },
    key,
    256,
  )
  return toHex(new Uint8Array(bits))
}

export function hasAdminPasscode() {
  try {
    return localStorage.getItem(CREDENTIAL_KEY) !== null
  } catch {
    return false
  }
}

export function isAdminSignedIn() {
  try {
    return hasAdminPasscode() && sessionStorage.getItem(SESSION_KEY) === "true"
  } catch {
    return false
  }
}

export async function setupAdminPasscode(password: string) {
  if (hasAdminPasscode())
    throw new Error("An admin passcode is already set up in this browser.")
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const credential: Credential = { salt, hash: await derive(password, salt) }
  localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(credential))
  sessionStorage.setItem(SESSION_KEY, "true")
}

export async function signInAdmin(password: string) {
  const stored = localStorage.getItem(CREDENTIAL_KEY)
  if (!stored) return false
  const credential = JSON.parse(stored) as Credential
  const matches = (await derive(password, credential.salt)) === credential.hash
  if (matches) sessionStorage.setItem(SESSION_KEY, "true")
  return matches
}

export function signOutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}
