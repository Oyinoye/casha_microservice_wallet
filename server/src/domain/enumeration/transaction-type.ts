/**
 * The TransactionType enumeration.
 */
export enum TransactionType {
    WalletTransfer = 'WalletTransfer',  // Transfer from one wallet to another wallet within the system
    BankTransfer = 'BankTransfer',      // Withdrawing money out from the wallet to a bank account
    WalletFunding = 'WalletFunding',    // Transfer to another wallet outside of the system or a diferent bank
    BankFunding = 'BankFunding',        // Putting money in wallet from bank
    BillPayment = 'BillPayment',        // Bill payment to a third party's wallet
}
