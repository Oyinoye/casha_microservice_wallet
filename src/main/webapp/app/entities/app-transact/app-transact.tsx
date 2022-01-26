// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './app-transact.reducer';
import { IAppTransact } from 'app/shared/model/app-transact.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAppTransactProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const AppTransact = (props: IAppTransactProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { appTransactList, match, loading } = props;
  return (
    <div>
      <h2 id="app-transact-heading" data-cy="AppTransactHeading">
        <Translate contentKey="walletApp.appTransact.home.title">App Transacts</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="walletApp.appTransact.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="walletApp.appTransact.home.createLabel">Create new App Transact</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {appTransactList && appTransactList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="walletApp.appTransact.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.appTransact.type">Type</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.appTransact.transactionDate">Transaction Date</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.appTransact.transactionRef">Transaction Ref</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.appTransact.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.appTransact.customer">Customer</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {appTransactList.map((appTransact, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${appTransact.id}`} color="link" size="sm">
                      {appTransact.id}
                    </Button>
                  </td>
                  <td>
                    <Translate contentKey={`walletApp.TransactionType.${appTransact.type}`} />
                  </td>
                  <td>
                    {appTransact.transactionDate ? (
                      <TextFormat type="date" value={appTransact.transactionDate} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{appTransact.transactionRef}</td>
                  <td>{appTransact.description}</td>
                  <td>
                    {appTransact.customer ? <Link to={`customer/${appTransact.customer.id}`}>{appTransact.customer.customerID}</Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${appTransact.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${appTransact.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${appTransact.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="walletApp.appTransact.home.notFound">No App Transacts found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ appTransact }: IRootState) => ({
  appTransactList: appTransact.entities,
  loading: appTransact.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AppTransact);
