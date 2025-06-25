
export function generateOTP(length: number = 6):string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp
    
}
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function storeOTP(email: string, otp: string,ttlInMinutes=15) {
    
    const expiresAt = Date.now() + ttlInMinutes * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });
}
export function isOTPValid(email: string, otp: string): boolean {
    const storedOtp = otpStore.get(email);
    if (!storedOtp) {
        return false;
    }
    return storedOtp.otp === otp && storedOtp.expiresAt > Date.now();
}