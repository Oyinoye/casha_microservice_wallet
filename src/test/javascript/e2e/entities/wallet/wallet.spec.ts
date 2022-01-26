import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WalletComponentsPage from './wallet.page-object';
import WalletUpdatePage from './wallet-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Wallet e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let walletComponentsPage: WalletComponentsPage;
  let walletUpdatePage: WalletUpdatePage;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();
    await signInPage.username.sendKeys(username);
    await signInPage.password.sendKeys(password);
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    walletComponentsPage = new WalletComponentsPage();
    walletComponentsPage = await walletComponentsPage.goToPage(navBarPage);
  });

  it('should load Wallets', async () => {
    expect(await walletComponentsPage.title.getText()).to.match(/Wallets/);
    expect(await walletComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Wallets', async () => {
    const beforeRecordsCount = (await isVisible(walletComponentsPage.noRecords)) ? 0 : await getRecordsCount(walletComponentsPage.table);
    walletUpdatePage = await walletComponentsPage.goToCreateWallet();
    await walletUpdatePage.enterData();

    expect(await walletComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(walletComponentsPage.table);
    await waitUntilCount(walletComponentsPage.records, beforeRecordsCount + 1);
    expect(await walletComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await walletComponentsPage.deleteWallet();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(walletComponentsPage.records, beforeRecordsCount);
      expect(await walletComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(walletComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
