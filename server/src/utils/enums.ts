export enum OtpTypes {
	EMAIL =  'Email',
	PHONE_NUMBER = 'PhoneNumber'
}

export enum OtpUsage {
	VERIFY_PHONE_NUMBER =  'Verify phone number',
	COMPLETE_TRANSACTION = 'Complete transaction'
}

export enum EmailSendOperation {
	RESET_PASSWORD = 'resetPassword', 
	WELCOME_EMAIL = 'welcomeEmail'
}

export enum OtpStatus {
	UNUSED = 'unused',
	USED = 'used'
}