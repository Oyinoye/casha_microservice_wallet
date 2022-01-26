import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Customer from './customer';
import Wallet from './wallet';
import JournalLine from './journal-line';
import Journal from './journal';
import AppTransact from './app-transact';
import Biller from './biller';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}customer`} component={Customer} />
      <ErrorBoundaryRoute path={`${match.url}wallet`} component={Wallet} />
      <ErrorBoundaryRoute path={`${match.url}journal-line`} component={JournalLine} />
      <ErrorBoundaryRoute path={`${match.url}journal`} component={Journal} />
      <ErrorBoundaryRoute path={`${match.url}app-transact`} component={AppTransact} />
      <ErrorBoundaryRoute path={`${match.url}biller`} component={Biller} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
