import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class CustomerUpdatePage {
  pageTitle: ElementFinder = element(by.id('walletApp.customer.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  customerIDInput: ElementFinder = element(by.css('input#customer-customerID'));
  phoneNumberInput: ElementFinder = element(by.css('input#customer-phoneNumber'));
  nationalityInput: ElementFinder = element(by.css('input#customer-nationality'));
  addressInput: ElementFinder = element(by.css('input#customer-address'));
  bvnInput: ElementFinder = element(by.css('input#customer-bvn'));
  dateOfBirthInput: ElementFinder = element(by.css('input#customer-dateOfBirth'));
  userSelect: ElementFinder = element(by.css('select#customer-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setCustomerIDInput(customerID) {
    await this.customerIDInput.sendKeys(customerID);
  }

  async getCustomerIDInput() {
    return this.customerIDInput.getAttribute('value');
  }

  async setPhoneNumberInput(phoneNumber) {
    await this.phoneNumberInput.sendKeys(phoneNumber);
  }

  async getPhoneNumberInput() {
    return this.phoneNumberInput.getAttribute('value');
  }

  async setNationalityInput(nationality) {
    await this.nationalityInput.sendKeys(nationality);
  }

  async getNationalityInput() {
    return this.nationalityInput.getAttribute('value');
  }

  async setAddressInput(address) {
    await this.addressInput.sendKeys(address);
  }

  async getAddressInput() {
    return this.addressInput.getAttribute('value');
  }

  async setBvnInput(bvn) {
    await this.bvnInput.sendKeys(bvn);
  }

  async getBvnInput() {
    return this.bvnInput.getAttribute('value');
  }

  async setDateOfBirthInput(dateOfBirth) {
    await this.dateOfBirthInput.sendKeys(dateOfBirth);
  }

  async getDateOfBirthInput() {
    return this.dateOfBirthInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
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
    await this.setCustomerIDInput('customerID');
    expect(await this.getCustomerIDInput()).to.match(/customerID/);
    await waitUntilDisplayed(this.saveButton);
    await this.setPhoneNumberInput('phoneNumber');
    expect(await this.getPhoneNumberInput()).to.match(/phoneNumber/);
    await waitUntilDisplayed(this.saveButton);
    await this.setNationalityInput('nationality');
    expect(await this.getNationalityInput()).to.match(/nationality/);
    await waitUntilDisplayed(this.saveButton);
    await this.setAddressInput('address');
    expect(await this.getAddressInput()).to.match(/address/);
    await waitUntilDisplayed(this.saveButton);
    await this.setBvnInput('5');
    expect(await this.getBvnInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setDateOfBirthInput('01-01-2001');
    expect(await this.getDateOfBirthInput()).to.eq('2001-01-01');
    await this.userSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
