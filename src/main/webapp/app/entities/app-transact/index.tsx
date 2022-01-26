import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import AppTransact from './app-transact';
import AppTransactDetail from './app-transact-detail';
import AppTransactUpdate from './app-transact-update';
import AppTransactDeleteDialog from './app-transact-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AppTransactUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AppTransactUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AppTransactDetail} />
      <ErrorBoundaryRoute path={match.url} component={AppTransact} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AppTransactDeleteDialog} />
  </>
);

export default Routes;
