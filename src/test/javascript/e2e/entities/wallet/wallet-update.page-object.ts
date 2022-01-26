import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class WalletUpdatePage {
  pageTitle: ElementFinder = element(by.id('walletApp.wallet.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  walletIDInput: ElementFinder = element(by.css('input#wallet-walletID'));
  nubanInput: ElementFinder = element(by.css('input#wallet-nuban'));
  accountNumberInput: ElementFinder = element(by.css('input#wallet-accountNumber'));
  balanceInput: ElementFinder = element(by.css('input#wallet-balance'));
  expiryDateInput: ElementFinder = element(by.css('input#wallet-expiryDate'));
  typeSelect: ElementFinder = element(by.css('select#wallet-type'));
  statusSelect: ElementFinder = element(by.css('select#wallet-status'));
  customerSelect: ElementFinder = element(by.css('select#wallet-customer'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setWalletIDInput(walletID) {
    await this.walletIDInput.sendKeys(walletID);
  }

  async getWalletIDInput() {
    return this.walletIDInput.getAttribute('value');
  }

  async setNubanInput(nuban) {
    await this.nubanInput.sendKeys(nuban);
  }

  async getNubanInput() {
    return this.nubanInput.getAttribute('value');
  }

  async setAccountNumberInput(accountNumber) {
    await this.accountNumberInput.sendKeys(accountNumber);
  }

  async getAccountNumberInput() {
    return this.accountNumberInput.getAttribute('value');
  }

  async setBalanceInput(balance) {
    await this.balanceInput.sendKeys(balance);
  }

  async getBalanceInput() {
    return this.balanceInput.getAttribute('value');
  }

  async setExpiryDateInput(expiryDate) {
    await this.expiryDateInput.sendKeys(expiryDate);
  }

  async getExpiryDateInput() {
    return this.expiryDateInput.getAttribute('value');
  }

  async setTypeSelect(type) {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect() {
    return this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption() {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }
  async setStatusSelect(status) {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect() {
    return this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption() {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }
  async customerSelectLastOption() {
    await this.customerSelect.all(by.tagName('option')).last().click();
  }

  async customerSelectOption(option) {
    await this.customerSelect.sendKeys(option);
  }

  getCustomerSelect() {
    return this.customerSelect;
  }

  async getCustomerSelectedOption() {
    return this.customerSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setWalletIDInput('walletID');
    expect(await this.getWalletIDInput()).to.match(/walletID/);
    await waitUntilDisplayed(this.saveButton);
    await this.setNubanInput('nuban');
    expect(await this.getNubanInput()).to.match(/nuban/);
    await waitUntilDisplayed(this.saveButton);
    await this.setAccountNumberInput('accountNumber');
    expect(await this.getAccountNumberInput()).to.match(/accountNumber/);
    await waitUntilDisplayed(this.saveButton);
    await this.setBalanceInput('5');
    expect(await this.getBalanceInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setExpiryDateInput('01-01-2001');
    expect(await this.getExpiryDateInput()).to.eq('2001-01-01');
    await waitUntilDisplayed(this.saveButton);
    await this.typeSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.statusSelectLastOption();
    await this.customerSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
