// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './biller.reducer';
import { IBiller } from 'app/shared/model/biller.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBillerProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Biller = (props: IBillerProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { billerList, match, loading } = props;
  return (
    <div>
      <h2 id="biller-heading" data-cy="BillerHeading">
        <Translate contentKey="walletApp.biller.home.title">Billers</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="walletApp.biller.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="walletApp.biller.home.createLabel">Create new Biller</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {billerList && billerList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="walletApp.biller.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.biller.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.biller.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="walletApp.biller.wallet">Wallet</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {billerList.map((biller, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${biller.id}`} color="link" size="sm">
                      {biller.id}
                    </Button>
                  </td>
                  <td>{biller.name}</td>
                  <td>{biller.description}</td>
                  <td>{biller.wallet ? <Link to={`wallet/${biller.wallet.id}`}>{biller.wallet.accountNumber}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${biller.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${biller.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${biller.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="walletApp.biller.home.notFound">No Billers found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ biller }: IRootState) => ({
  billerList: biller.entities,
  loading: biller.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Biller);
