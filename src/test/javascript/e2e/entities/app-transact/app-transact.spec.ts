import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AppTransactComponentsPage from './app-transact.page-object';
import AppTransactUpdatePage from './app-transact-update.page-object';
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

describe('AppTransact e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let appTransactComponentsPage: AppTransactComponentsPage;
  let appTransactUpdatePage: AppTransactUpdatePage;
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
    appTransactComponentsPage = new AppTransactComponentsPage();
    appTransactComponentsPage = await appTransactComponentsPage.goToPage(navBarPage);
  });

  it('should load AppTransacts', async () => {
    expect(await appTransactComponentsPage.title.getText()).to.match(/App Transacts/);
    expect(await appTransactComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete AppTransacts', async () => {
    const beforeRecordsCount = (await isVisible(appTransactComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(appTransactComponentsPage.table);
    appTransactUpdatePage = await appTransactComponentsPage.goToCreateAppTransact();
    await appTransactUpdatePage.enterData();

    expect(await appTransactComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(appTransactComponentsPage.table);
    await waitUntilCount(appTransactComponentsPage.records, beforeRecordsCount + 1);
    expect(await appTransactComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await appTransactComponentsPage.deleteAppTransact();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(appTransactComponentsPage.records, beforeRecordsCount);
      expect(await appTransactComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(appTransactComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
