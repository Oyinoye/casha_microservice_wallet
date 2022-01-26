import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Biller from './biller';
import BillerDetail from './biller-detail';
import BillerUpdate from './biller-update';
import BillerDeleteDialog from './biller-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BillerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BillerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BillerDetail} />
      <ErrorBoundaryRoute path={match.url} component={Biller} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BillerDeleteDialog} />
  </>
);

export default Routes;
