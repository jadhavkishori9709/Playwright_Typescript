/**
 * Generate a random email address for testing
 * @param prefix - Optional prefix for the email
 * @returns A random email address
 */
export function generateRandomEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}_${timestamp}_${random}@test.com`;
}

/**
 * Generate a random password
 * @param length - Length of the password (default: 12)
 * @returns A random password
 */
export function generateRandomPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate a random first name
 * @returns A random first name
 */
export function generateRandomFirstName(): string {
    const names = [
        'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily',
        'James', 'Emma', 'Robert', 'Olivia', 'William', 'Ava',
        'Richard', 'Sophia', 'Joseph', 'Isabella', 'Thomas', 'Mia'
    ];
    return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate a random last name
 * @returns A random last name
 */
export function generateRandomLastName(): string {
    const names = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
        'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
        'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson'
    ];
    return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate random user data
 * @returns Object containing random user data
 */
export function generateRandomUserData() {
    const firstName = generateRandomFirstName();
    const lastName = generateRandomLastName();
    const email = generateRandomEmail(firstName.toLowerCase());
    const password = generateRandomPassword();

    return {
        firstName,
        lastName,
        email,
        password,
        fullName: `${firstName} ${lastName}`
    };
}

/**
 * Wait for a specified amount of time
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date to string
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
}

/**
 * Get timestamp string
 * @returns Timestamp string
 */
export function getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
}
