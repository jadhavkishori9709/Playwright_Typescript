import * as fs from 'fs';
import * as path from 'path';

interface UserCredentials {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    isVerified: boolean;
    createdAt: string;
}

interface CredentialsStore {
    users: UserCredentials[];
}

const CREDENTIALS_FILE = path.join(__dirname, '..', 'test-data', 'credentials.json');

/**
 * Ensure the credentials file and directory exist
 */
function ensureCredentialsFile(): void {
    const dir = path.dirname(CREDENTIALS_FILE);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(CREDENTIALS_FILE)) {
        const initialData: CredentialsStore = { users: [] };
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(initialData, null, 2));
    }
}

/**
 * Load credentials from file
 * @returns CredentialsStore object
 */
function loadCredentials(): CredentialsStore {
    ensureCredentialsFile();
    const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
    return JSON.parse(data);
}

/**
 * Save credentials to file
 * @param store - CredentialsStore object to save
 */
function saveCredentials(store: CredentialsStore): void {
    ensureCredentialsFile();
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(store, null, 2));
}

/**
 * Save user credentials after successful signup and verification
 * @param credentials - User credentials to save
 */
export function saveUserCredentials(credentials: UserCredentials): void {
    const store = loadCredentials();

    // Check if user already exists
    const existingIndex = store.users.findIndex(u => u.email === credentials.email);

    if (existingIndex >= 0) {
        // Update existing user
        store.users[existingIndex] = credentials;
    } else {
        // Add new user
        store.users.push(credentials);
    }

    saveCredentials(store);
}

/**
 * Get a verified user's credentials
 * @returns UserCredentials or null if no verified user exists
 */
export function getVerifiedUser(): UserCredentials | null {
    const store = loadCredentials();
    const verifiedUser = store.users.find(u => u.isVerified);
    return verifiedUser || null;
}

/**
 * Get all verified users
 * @returns Array of verified user credentials
 */
export function getAllVerifiedUsers(): UserCredentials[] {
    const store = loadCredentials();
    return store.users.filter(u => u.isVerified);
}

/**
 * Get user by email
 * @param email - Email address to search for
 * @returns UserCredentials or null if not found
 */
export function getUserByEmail(email: string): UserCredentials | null {
    const store = loadCredentials();
    const user = store.users.find(u => u.email === email);
    return user || null;
}

/**
 * Mark user as verified
 * @param email - Email address of the user to verify
 */
export function markUserAsVerified(email: string): void {
    const store = loadCredentials();
    const user = store.users.find(u => u.email === email);

    if (user) {
        user.isVerified = true;
        saveCredentials(store);
    }
}

/**
 * Clear all saved credentials (useful for test cleanup)
 */
export function clearAllCredentials(): void {
    const store: CredentialsStore = { users: [] };
    saveCredentials(store);
}

/**
 * Delete user by email
 * @param email - Email address of the user to delete
 */
export function deleteUser(email: string): void {
    const store = loadCredentials();
    store.users = store.users.filter(u => u.email !== email);
    saveCredentials(store);
}
